from typing import Dict, Tuple
import pulp as pl
from .model_types import (
    ModelInput,
    ModelOutput,
    ObjectiveFunction,
    SolutionStatus,
    Variables,
    Constraints,
)
from dataclasses import fields, asdict

# This is a tighly coupled model to PuLP. Eventually it might be a good idea
# to decouple this, since the solver might be something else entirely.
class BlendingModel:
    def __init__(self, model_input: ModelInput) -> None:
        self.input = model_input
        constraints: Constraints
        vars: Variables
        objective_function: ObjectiveFunction

        self._model = pl.LpProblem(name="Blending", sense=pl.const.LpMinimize)
        self._add_variables()
        self._add_objective_function()
        self._add_constraints()

    def solve(self) -> ModelOutput:
        status = self._model.solve()
        print(f"Solver exited with PuLP status: {pl.const.LpStatus[status]}.")
        if pl.const.LpStatus[status] in ["Infeasible"]:
            print("Infeasible model, no solution possible")
        if pl.const.LpStatus[status] in ["Unbounded"]:
            print("Unbounded model, recheck the model")
        if pl.const.LpStatus[status] in ["Undefined", "Not Solved"]:
            print("Strange things, undefined or not solved...")
        if pl.const.LpStatus[status] in ["Optimal"]:
            print("Yey! Optimal!")
            return ModelOutput(
                model_input=self.input,
                solution_status=SolutionStatus.SUCCESS,
                variables=self._extract_variable_values(),
                objective=self._extract_objective_values(),
            )
        # return SolveStatus.FAIL
        return ModelOutput(
            model_input=self.input,
            solution_status=SolutionStatus.FAIL,
            variables=None,
            objective=None,
        )

    def _extract_variable_values(self) -> Variables:
        # TODO: refactor the thing below, it should be at a lower abstraction level
        out_dict = dict()
        for field in fields(self.vars):
            out_dict[field.name] = dict()
            var_dict = getattr(self.vars, field.name)
            for var_name, var in var_dict.items():
                out_dict[field.name][var_name] = var.value()
        return Variables(**out_dict)

    def _extract_objective_values(self) -> ObjectiveFunction:
        # TODO: refactor the thing below, it should be at a lower abstraction level
        out_dict = dict()
        for field in fields(self.objective_function):
            lp_affine_expression = getattr(self.objective_function, field.name)
            out_dict[field.name] = lp_affine_expression.value()

        return ObjectiveFunction(**out_dict)

    def _add_variables(self):
        """Call all the variable-generating functions here."""
        load = pl.LpVariable.dicts(
            "load",
            [
                (product, order)
                for product in self.input.sets.products
                for order in self.input.sets.orders
            ],
            lowBound=0,
            upBound=None,
            cat=pl.const.LpContinuous,
        )
        underload = pl.LpVariable.dicts(
            "underload",
            [order for order in self.input.sets.orders],
            lowBound=0,
            upBound=None,
            cat=pl.const.LpContinuous,
        )
        asy_deviation_above = pl.LpVariable.dicts(
            "asy_deviation_above",
            [
                (order, assay)
                for order in self.input.sets.orders
                for assay in self.input.sets.assays
            ],
            lowBound=0,
            upBound=None,
            cat=pl.const.LpContinuous,
        )
        asy_deviation_below = pl.LpVariable.dicts(
            "asy_deviation_below",
            [
                (order, assay)
                for order in self.input.sets.orders
                for assay in self.input.sets.assays
            ],
            lowBound=0,
            upBound=None,
            cat=pl.const.LpContinuous,
        )
        self.vars = Variables(
            load=load,
            underload=underload,
            asy_deviation_above=asy_deviation_above,
            asy_deviation_below=asy_deviation_below,
        )

    def _add_objective_function(self):
        """Build the obj function here."""

        product_cost = pl.lpSum(
            self.vars.load[p, o]
            for p in self.input.sets.products
            for o in self.input.sets.orders
        )
        asy_lower_deviation = pl.lpSum(
            self.vars.asy_deviation_below[o, a]
            * self.input.coefficients.asy_deviation_cost[a]
            for o in self.input.sets.orders
            for a in self.input.sets.assays
        )
        asy_upper_deviation = pl.lpSum(
            self.vars.asy_deviation_above[o, a]
            * self.input.coefficients.asy_deviation_cost[a]
            for o in self.input.sets.orders
            for a in self.input.sets.assays
        )
        underload = pl.lpSum(self.vars.underload[o] for o in self.input.sets.orders)
        self.objective_function = ObjectiveFunction(
            product_cost=product_cost,
            underload=underload,
            asy_lower_deviation=asy_lower_deviation,
            asy_upper_deviation=asy_upper_deviation,
        )
        # TODO: somehow if we do pl.lpSum(asdict(self.objective_function).values()), we get somewhere a comparison that breaks the model when we call solve()
        # it's a strange behavior that might be worth exploring a bit longer, and even mabe contributing a patch to pulp codebase.
        # self._model += pl.lpSum(list(asdict(self.objective_function).values()))
        # This crashes in line 275 of pulp/mps_lp.py, in lines
        #      # objective function
        # if variable in cobj: <<<<--- here.
        # Apparently the comparison used in the "in" breaks the code if we make the objective function as indicated above.. This is a strange behavior indeed.

        # Same thing happens here:
        # ofunc_accum = pl.LpAffineExpression()
        # for affine_expression in asdict(self.objective_function).values():
        #     ofunc_accum += affine_expression
        # self._model += ofunc_accum

        # So as a workaround we use this, but please do the research.
        self._model += pl.lpSum(
            [product_cost, asy_lower_deviation, asy_upper_deviation, underload]
        )

    def _add_constraints(self):
        """Adds all the constraints"""
        self.constraints = Constraints(
            demand_satisfaction=self._c_demand_satisfaction(),
            product_capacity=self._c_product_capacity(),
            asy_hard_lb=self._c_asy_hard_lb(),
            asy_soft_lb=self._c_asy_soft_lb(),
            asy_soft_ub=self._c_asy_soft_ub(),
            asy_hard_ub=self._c_asy_hard_ub(),
        )

        # TODO: refactor the thing below, it should be at a lower-code place
        for field in fields(self.constraints):
            constraint_dict = getattr(self.constraints, field.name)
            for constraint_name, constraint in constraint_dict.items():
                full_name = field.name + str(constraint_name)
                self._model.addConstraint(constraint, full_name)

    def _c_demand_satisfaction(self) -> Dict[str, pl.LpConstraint]:
        """for each order: sum(load) + underload = demand"""
        vars = self.vars
        coeff = self.input.coefficients
        sets = self.input.sets
        out = dict()
        for o in self.input.sets.orders:
            out[o] = (
                pl.lpSum(vars.load[p, o] for p in sets.products) + vars.underload[o]
                == coeff.demand[o]
            )
        return out

    def _c_product_capacity(self) -> Dict[str, pl.LpConstraint]:
        """sum(loads of p) does not exceed amount avail of p"""
        out = dict()
        vars = self.vars
        coeff = self.input.coefficients
        sets = self.input.sets
        for p in sets.products:
            out[p] = (
                pl.lpSum(vars.load[p, o] for o in sets.orders)
                <= coeff.product_available[p]
            )
        return out

    def _asy_expression(self, order: str, assay: str) -> pl.LpAffineExpression:
        """Generate the sum_prod(load_{prod, order} * asy_{a,prod})

        Helper function for all assay quality contraints

        Note that this expression makes it work with underload (see latex doc)
        """
        products = self.input.sets.products
        load = self.vars.load
        producy_asy = self.input.coefficients.product_asy
        return pl.lpSum(
            load[prod, order] * producy_asy[prod, assay] for prod in products
        )

    def _c_asy_hard_lb(self) -> Dict[Tuple[str, str], pl.LpConstraint]:
        """loaded_assay_estimate >= required_asy_lb * (demand - underload)"""
        vars = self.vars
        coeff = self.input.coefficients
        out = dict()
        for o in self.input.sets.orders:
            for asy in self.input.sets.assays:
                out[o, asy] = self._asy_expression(o, asy) >= coeff.asy_hard_lb[
                    o, asy
                ] * (coeff.demand[o] - vars.underload[o])
        return out

    def _c_asy_hard_ub(self) -> Dict[Tuple[str, str], pl.LpConstraint]:
        """loaded_assay_estimate <= required_asy_ub * (demand - underload)"""
        vars = self.vars
        coeff = self.input.coefficients
        out = dict()
        for o in self.input.sets.orders:
            for asy in self.input.sets.assays:
                out[o, asy] = self._asy_expression(o, asy) <= coeff.asy_hard_ub[
                    o, asy
                ] * (coeff.demand[o] - vars.underload[o])
        return out

    def _c_asy_soft_lb(self) -> Dict[Tuple[str, str], pl.LpConstraint]:
        """loaded_assay_estimate + deviation_below >= required_asy_lb * (demand - underload)"""
        vars = self.vars
        coeff = self.input.coefficients
        out = dict()
        for o in self.input.sets.orders:
            for asy in self.input.sets.assays:
                out[o, asy] = self._asy_expression(o, asy) + vars.asy_deviation_below[
                    o, asy
                ] >= coeff.asy_soft_lb[o, asy] * (coeff.demand[o] - vars.underload[o])
        return out

    def _c_asy_soft_ub(self) -> Dict[Tuple[str, str], pl.LpConstraint]:
        """loaded_assay_estimate - deviation_above <= required_asy_ub * (demand - underload)"""
        vars = self.vars
        coeff = self.input.coefficients
        out = dict()
        for o in self.input.sets.orders:
            for asy in self.input.sets.assays:
                out[o, asy] = self._asy_expression(o, asy) - vars.asy_deviation_above[
                    o, asy
                ] <= coeff.asy_soft_ub[o, asy] * (coeff.demand[o] - vars.underload[o])
        return out


# TODO: Snippet  to check if integral variables are indeed integral -- might be handy
# def verify_solved_pulp_model_integrality(model):
#     """Verifies the integrality of the pulp model after being run
#     """
#     ZERO_TOL = 1e-5
#     integer_types = {pulp.LpBinary, pulp.LpInteger}
#     valid = True
#     invalid_vars = 0
#     for v in model.variables():
#         if v.cat in integer_types:
#             var_value = v.value()
#             if abs(var_value - round(var_value)) > ZERO_TOL:
#                 logger.error(f"Integer variable {v.name} has non-integer value {var_value}")
#                 valid = False
#                 invalid_vars += 1
#     if not valid:
#         logger.error(f"Encountered {invalid_vars} integer variables with non-integer value")
#     return valid
