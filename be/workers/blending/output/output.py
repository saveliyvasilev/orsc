from typing import Dict
from ..model_types import ModelOutput
from .orders import orders


def build_json_model_output(model_output: ModelOutput) -> Dict:
    return {"orders": orders(model_output)}
