from typing import Dict, List
from ..model_types import ModelOutput

EPSILON = 0.0001  # TODO: Replace this for epsilon in some config


def orders(model_output: ModelOutput) -> List[Dict]:

    return [
        _order(model_output, order) for order in model_output.model_input.sets.orders
    ]


def _order(model_output: ModelOutput, order: str) -> Dict:
    return {
        "order_id": order,
        "demand_amount": model_output.model_input.coefficients.demand[order],
        "load_amount": _load_amount(model_output, order),
        "load_cost": _load_cost(model_output, order),
        "underload_amount": model_output.variables.underload[order],
        "has_assay_deviation": _has_assay_deviation(model_output, order),
        "load_details": _load_details(model_output, order),
        "assay_details": _assay_details(model_output, order),
    }


def _load_amount(model_output: ModelOutput, order: str) -> float:
    return sum(
        load
        for (_, _order), load in model_output.variables.load.items()
        if _order == order
    )


def _load_cost(model_output: ModelOutput, order: str) -> float:
    return sum(
        load * model_output.model_input.coefficients.product_cost[prd]
        for (prd, _order), load in model_output.variables.load.items()
        if _order == order
    )


def _has_assay_deviation(model_output: ModelOutput, order: str) -> bool:
    deviation_below = sum(
        dev
        for (_order, _), dev in model_output.variables.asy_deviation_below.items()
        if _order == order
    )
    deviation_above = sum(
        dev
        for (_order, _), dev in model_output.variables.asy_deviation_above.items()
        if _order == order
    )
    assert deviation_below >= 0, "Somehow the assay deviation is negative"
    assert deviation_above >= 0, "Somehow the assay deviation is negative"
    return deviation_above + deviation_below > EPSILON


def _load_details(model_output: ModelOutput, order: str) -> List[Dict]:
    return [
        _load_detail(model_output, order, product)
        for product in model_output.model_input.sets.products
        if model_output.variables.load[product, order] > EPSILON
    ]


def _load_detail(model_output: ModelOutput, order: str, product: str) -> Dict:
    return {
        "order_id": order,
        "product_id": product,
        "load_amount": model_output.variables.load[product, order],
        "product_cost": model_output.model_input.coefficients.product_cost[product],
        "load_cost": model_output.model_input.coefficients.product_cost[product]
        * model_output.variables.load[product, order],
        "order_product_assays": _order_product_assays(model_output, order, product),
    }


def _order_product_assays(
    model_output: ModelOutput, order: str, product: str
) -> List[Dict]:
    return [
        _order_product_assay(model_output, order, product, assay)
        for assay in model_output.model_input.sets.assays
    ]


def _order_product_assay(
    model_output: ModelOutput, order: str, product: str, assay: str
) -> Dict:
    return {
        "order_id": order,
        "product_id": product,
        "assay_id": assay,
        "asy_hard_lb": model_output.model_input.coefficients.asy_hard_lb[order, assay],
        "asy_soft_lb": model_output.model_input.coefficients.asy_soft_lb[order, assay],
        "asy_soft_ub": model_output.model_input.coefficients.asy_soft_ub[order, assay],
        "asy_hard_ub": model_output.model_input.coefficients.asy_hard_ub[order, assay],
        "asy_product": model_output.model_input.coefficients.product_asy[
            product, assay
        ],
    }


def _assay_details(model_output: ModelOutput, order: str) -> List[Dict]:
    return [
        _assay_detail(model_output, order, assay)
        for assay in model_output.model_input.sets.assays
    ]


def _assay_detail(model_output: ModelOutput, order: str, assay: str) -> Dict:
    # TODO: Maybe at some point add the penalty cost, but in my experiente it's too tricky to communicate.
    return {
        "order_id": order,
        "assay_id": assay,
        "resulting_assay": _resulting_assay(model_output, order, assay),
        "asy_hard_lb": model_output.model_input.coefficients.asy_hard_lb[order, assay],
        "asy_soft_lb": model_output.model_input.coefficients.asy_soft_lb[order, assay],
        "asy_soft_ub": model_output.model_input.coefficients.asy_soft_ub[order, assay],
        "asy_hard_ub": model_output.model_input.coefficients.asy_hard_ub[order, assay],
    }


def _resulting_assay(model_output: ModelOutput, order: str, assay: str) -> float:
    total_load = _load_amount(
        model_output, order
    )  # Accidental duplication, feel free to re-compute if needed to make a w.avg
    w_assay_sum = sum(
        model_output.variables.load[p, order]
        * model_output.model_input.coefficients.product_asy[p, assay]
        for p in model_output.model_input.sets.products
    )
    if total_load > EPSILON:
        return w_assay_sum / total_load
    else:
        return 0  # TODO: This should account for underload, and if underload 100% then the UI should somehow reflect this "glitch."
