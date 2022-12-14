from typing import Dict

from .json_sets import JSONAssaysFactory, JSONOrdersFactory, JSONProductsFactory
from .json_coefficients import (
    JSONAsyDeviationCostFactory,
    JSONAsyHardLBFactory,
    JSONAsyHardUBFactory,
    JSONAsySoftLBFactory,
    JSONAsySoftUBFactory,
    JSONDemandFactory,
    JSONProductAsyFactory,
    JSONProductAvailableFactory,
    JSONProductCostFactory,
    JSONUnderloadCostFactory,
)
from ..model_types import ModelInput
from .sets import SetFactory
from .coefficients import CoefficientsFactory


class JSONInputFactory:
    """A fully json-based input factory"""

    def __init__(self, input_data: Dict):
        self._input_data = input_data

    def build(self) -> ModelInput:
        products = self._input_data["products"]
        orders = self._input_data["orders"]
        scenario_settings = self._input_data["scenario_settings"]
        sets = SetFactory(
            products_factory=JSONProductsFactory(products),
            orders_factory=JSONOrdersFactory(orders),
            assays_factory=JSONAssaysFactory(),
        ).build()
        return ModelInput(
            sets=sets,
            coefficients=CoefficientsFactory(
                product_cost_factory=JSONProductCostFactory(product_records=products),
                product_available_factory=JSONProductAvailableFactory(products),
                demand_factory=JSONDemandFactory(orders),
                asy_hard_lb_factory=JSONAsyHardLBFactory(sets.assays, orders),
                asy_soft_lb_factory=JSONAsySoftLBFactory(sets.assays, orders),
                asy_soft_ub_factory=JSONAsySoftUBFactory(sets.assays, orders),
                asy_hard_ub_factory=JSONAsyHardUBFactory(sets.assays, orders),
                product_asy_factory=JSONProductAsyFactory(sets.assays, products),
                asy_deviation_cost_factory=JSONAsyDeviationCostFactory(
                    sets.assays, scenario_settings
                ),
                underload_cost_factory=JSONUnderloadCostFactory(scenario_settings),
            ).build(),
        )
