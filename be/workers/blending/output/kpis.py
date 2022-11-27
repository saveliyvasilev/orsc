from typing import Dict
from ..model_types import ModelOutput


def kpis(model_output: ModelOutput) -> Dict:
    return {
        "total_demand": _total_demand(model_output),
        "total_underload": _total_underload(model_output),
        "total_product_cost": _total_product_cost(model_output),
        # "total_off_spec_orders": _total_off_spec_orders(model_output)
    }


def _total_demand(model_output: ModelOutput) -> float:
    return sum(model_output.model_input.coefficients.demand.values())


def _total_underload(model_output: ModelOutput) -> float:
    return sum(model_output.variables.underload.values())


def _total_product_cost(model_output: ModelOutput) -> float:
    load = model_output.variables.load
    return sum(
        amount * model_output.model_input.coefficients.product_cost[product]
        for (product, order), amount in load.items()
    )
