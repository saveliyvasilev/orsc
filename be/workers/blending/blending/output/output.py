from typing import Dict
from ..model_types import ModelOutput
from .kpis import kpis
from .orders import orders
from .product_usage import product_usage


def build_json_model_output(model_output: ModelOutput) -> Dict:
    return {
        "kpis": kpis(model_output),
        "orders": orders(model_output),
        "product_usage": product_usage(model_output),
    }
