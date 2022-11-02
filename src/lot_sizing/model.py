from typing import Dict, Tuple
import pulp as pl
from .types import (
    ModelInput,
    ModelOutput,
    ObjectiveFunction,
    SolutionStatus,
    Variables,
    Constraints,
)
from dataclasses import fields

# This is a tighly coupled model to PuLP. Eventually it might be a good idea
# to decouple this, since the solver might be something else entirely.
class LotSizingModel:
    def __init__(self, model_input: ModelInput) -> None:
        self.input = model_input
        constraints: Constraints
        vars: Variables
        objective_function: ObjectiveFunction

        self._model = pl.LpProblem(name="LotSizing", sense=pl.const.LpMinimize)
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
            from pprint import pprint

            return ModelOutput(
                model_input=self.input,
                solution_status=SolutionStatus.SUCCESS,
                variables=self._extract_variable_values(),
                objective=self._extract_objective_values(),
            )
            pprint(self._extract_variable_values())
            # return SolveStatus.SUCCESS
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
        production = pl.LpVariable.dicts(
            "production",
            [
                (location, time)
                for location in self.input.sets.locations
                for time in self.input.sets.time_buckets
            ],
            lowBound=0,
            upBound=None,
            cat=pl.const.LpContinuous,
        )
        stock = pl.LpVariable.dicts(
            "stock",
            [
                (location, time)
                for location in self.input.sets.locations
                for time in self.input.sets.time_buckets
            ],
            lowBound=0,
            upBound=None,
            cat=pl.const.LpContinuous,
        )
        self.vars = Variables(production=production, stock=stock)

    def _add_objective_function(self):
        """Build the obj function here."""

        production_cost = pl.lpSum(
            self.vars.production[l, t] * self.input.coefficients.production_cost[l, t]
            for l in self.input.sets.locations
            for t in self.input.sets.time_buckets
        )
        stock_cost = pl.lpSum(
            self.vars.stock[l, t] * self.input.coefficients.stock_cost[l]
            for l in self.input.sets.locations
            for t in self.input.sets.time_buckets
        )
        self.objective_function = ObjectiveFunction(
            production_cost=production_cost, stock_cost=stock_cost
        )
        self._model += self.objective_function.production_cost, "Obj func"

    def _add_constraints(self):
        """Adds all the constraints"""
        # stock_continuity = self._c_stock_continuity()
        self.constraints = Constraints(
            demand_satisfaction=self._c_demand_satisfaction(),
            stock_initial=self._c_stock_initial(),
            stock_capacity=self._c_stock_capacity(),
        )

        # TODO: refactor the thing below, it should be at a lower-code place
        for field in fields(self.constraints):
            constraint_dict = getattr(self.constraints, field.name)
            for constraint_name, constraint in constraint_dict.items():
                full_name = field.name + str(constraint_name)
                self._model.addConstraint(constraint, full_name)

    def _c_demand_satisfaction(self) -> Dict[Tuple[str, int], pl.LpConstraint]:
        """for each location:
        stock_{t-1} + production{t} = demand_t + stock_t
        """
        vars = self.vars
        coeff = self.input.coefficients
        out = dict()
        for l in self.input.sets.locations:
            for t in self.input.sets.time_buckets:
                if t > 0:
                    out[l, t] = (
                        vars.stock[l, t - 1] + vars.production[l, t]
                        == coeff.demand[l, t] + vars.stock[l, t]
                    )
        return out

    def _c_stock_initial(self) -> Dict[str, pl.LpConstraint]:
        """stock_{l, 0} = initial stock"""
        out = dict()
        vars = self.vars
        coeff = self.input.coefficients
        for l in self.input.sets.locations:
            out[l] = vars.stock[l, 0] == coeff.initial_stock[l]
        return out

    def _c_stock_capacity(self) -> Dict[Tuple[str, int], pl.LpConstraint]:
        """stock_{l, t} <= capacity_l for each l, t"""
        vars = self.vars
        coeff = self.input.coefficients
        out = dict()
        for l in self.input.sets.locations:
            for t in self.input.sets.time_buckets:
                out[l, t] = vars.stock[l, t] <= coeff.stock_capacity[l]
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
