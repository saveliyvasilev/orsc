from dataclasses import dataclass
from enum import Enum, auto
from typing import Dict, List, Set, Tuple
import pulp as pl


@dataclass
class Variables:
    load: Dict[Tuple[str, str], pl.LpVariable | float]  # product, order
    underload: Dict[str, pl.LpVariable | float]  # order
    asy_deviation_above: Dict[Tuple[str, str], pl.LpVariable | float]  # order, assay
    asy_deviation_below: Dict[Tuple[str, str], pl.LpVariable | float]  # order, assay


@dataclass
class Constraints:
    demand_satisfaction: Dict[str, pl.LpConstraint]  # order
    product_capacity: Dict[str, pl.LpConstraint]  # product
    asy_hard_lb: Dict[Tuple[str, str], pl.LpConstraint]  # order, assay
    asy_soft_lb: Dict[Tuple[str, str], pl.LpConstraint]  # order, assay
    asy_soft_ub: Dict[Tuple[str, str], pl.LpConstraint]  # order, assay
    asy_hard_ub: Dict[Tuple[str, str], pl.LpConstraint]  # order, assay


@dataclass
class ObjectiveFunction:
    product_cost: pl.LpAffineExpression | float
    underload: pl.LpAffineExpression | float
    asy_lower_deviation: pl.LpAffineExpression | float
    asy_upper_deviation: pl.LpAffineExpression | float


@dataclass
class Coefficients:
    product_cost: Dict[str, float]  # product
    product_available: Dict[str, float]  # product
    demand: Dict[str, float]  # order
    asy_hard_lb: Dict[Tuple[str, str], float]  # order, assay
    asy_soft_lb: Dict[Tuple[str, str], float]  # order, assay
    asy_soft_ub: Dict[Tuple[str, str], float]  # order, assay
    asy_hard_ub: Dict[Tuple[str, str], float]  # order, assay
    product_asy: Dict[Tuple[str, str], float]  # product, assay
    asy_deviation_cost: Dict[str, float]  # assay
    # max_underload: Dict[str, float]  # order


@dataclass
class Sets:
    products: Set[str]
    orders: Set[str]
    assays: Set[str]


@dataclass
class ModelInput:
    sets: Sets
    coefficients: Coefficients


class SolutionStatus(Enum):
    SUCCESS = auto()
    FAIL = auto()


@dataclass
class ModelOutput:
    model_input: ModelInput
    solution_status: SolutionStatus
    variables: Variables | None
    objective: ObjectiveFunction | None
