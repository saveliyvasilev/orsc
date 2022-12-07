from typing import Dict, List
from ..model_types import ModelOutput


EPSILON = 0.0001  # TODO: Replace this for epsilon in some config


def product_usage(model_output: ModelOutput) -> List[Dict]:
    product_usage_list = [
        _product(model_output, prd) for prd in model_output.model_input.sets.products
    ]
    product_usage_list.sort(
        key=lambda el: (round(el["usage_share"] * 10000), el["reserves"]), reverse=True
    )
    return product_usage_list


def _product(model_output: ModelOutput, product: str) -> Dict:
    return {
        "product_id": product,
        "reserves": model_output.model_input.coefficients.product_available[product],
        "loaded": _loaded(model_output, product),
        "leftover": _leftover(model_output, product),
        "usage_share": _usage_share(model_output, product),
        "sulfur": model_output.model_input.coefficients.product_asy[product, "sulfur"],
        "API_gravity": model_output.model_input.coefficients.product_asy[
            product, "API_gravity"
        ],
        "load_details": _load_details(model_output, product),
        "cost_per_unit": model_output.model_input.coefficients.product_cost[product],
    }


def _loaded(model_output: ModelOutput, product: str) -> float:
    orders = model_output.model_input.sets.orders
    return sum(model_output.variables.load[product, o] for o in orders)


def _usage_share(model_output: ModelOutput, product: str) -> float:
    loaded = _loaded(model_output, product)
    return loaded / model_output.model_input.coefficients.product_available[product]


def _leftover(model_output: ModelOutput, product: str) -> float:
    loaded = _loaded(model_output, product)
    return model_output.model_input.coefficients.product_available[product] - loaded


def _load_details(model_output: ModelOutput, product: str) -> List[Dict]:
    return [
        _load_detail(model_output, product, order)
        for order in model_output.model_input.sets.orders
        if model_output.variables.load[product, order] > EPSILON
    ]


def _load_detail(model_output: ModelOutput, product: str, order: str) -> Dict:
    return {
        "order_id": order,
        "load_amount": model_output.variables.load[product, order],
    }
