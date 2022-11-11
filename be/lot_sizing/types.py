from dataclasses import dataclass
from enum import Enum, auto
from typing import Dict, List, Set, Tuple
import pulp as pl


@dataclass
class Variables:
    production: Dict[Tuple[str, int], pl.LpVariable | float]  # location, time
    stock: Dict[Tuple[str, int], pl.LpVariable | float]  # location, time


@dataclass
class Constraints:
    stock_initial: Dict[str, pl.LpConstraint]  # location
    # stock_continuity: Dict[Tuple[str, int], pl.LpConstraint]  # location, time
    stock_capacity: Dict[Tuple[str, int], pl.LpConstraint]  # location, time
    demand_satisfaction: Dict[Tuple[str, int], pl.LpConstraint]  # location, time


@dataclass
class ObjectiveFunction:
    production_cost: pl.LpAffineExpression | float
    stock_cost: pl.LpAffineExpression | float


@dataclass
class Coefficients:
    production_cost: Dict[Tuple[str, int], float]  # location, time
    demand: Dict[Tuple[str, int], float]  # location, time
    stock_capacity: Dict[str, float]  # location
    initial_stock: Dict[str, float]  # location
    stock_cost: Dict[str, float]  # location


@dataclass
class Sets:
    locations: Set[str]
    time_buckets: List[int]


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
