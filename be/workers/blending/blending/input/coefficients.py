# Definitions for blending input data factories.
# This is to decouple the data source from the model code

from abc import ABC, abstractmethod
from typing import Dict, Set, Tuple
from ..model_types import Sets, Coefficients


class ProductCostFactory(ABC):
    @abstractmethod
    def build(self) -> Dict[str, float]:
        pass


class ProductAvailableFactory(ABC):
    @abstractmethod
    def build(self) -> Dict[str, float]:
        pass


class DemandFactory(ABC):
    @abstractmethod
    def build(self) -> Dict[str, float]:
        pass


class AsyHardLBFactory(ABC):
    @abstractmethod
    def build(self) -> Dict[Tuple[str, str], float]:
        pass


class AsySoftLBFactory(ABC):
    @abstractmethod
    def build(self) -> Dict[Tuple[str, str], float]:
        pass


class AsySoftUBFactory(ABC):
    @abstractmethod
    def build(self) -> Dict[Tuple[str, str], float]:
        pass


class AsyHardUBFactory(ABC):
    @abstractmethod
    def build(self) -> Dict[Tuple[str, str], float]:
        pass


class ProductAsyFactory(ABC):
    @abstractmethod
    def build(self) -> Dict[Tuple[str, str], float]:
        pass


class AsyDeviationCostFactory(ABC):
    @abstractmethod
    def build(self) -> Dict[str, float]:
        pass


class CoefficientsFactory:
    def __init__(
        self,
        product_cost_factory: ProductCostFactory,
        product_available_factory: ProductAvailableFactory,
        demand_factory: DemandFactory,
        asy_hard_lb_factory: AsyHardLBFactory,
        asy_soft_lb_factory: AsySoftLBFactory,
        asy_soft_ub_factory: AsySoftUBFactory,
        asy_hard_ub_factory: AsyHardUBFactory,
        product_asy_factory: ProductAsyFactory,
        asy_deviation_cost_factory: AsyDeviationCostFactory,
    ) -> None:
        self._product_cost_factory = product_cost_factory
        self._product_available_factory = product_available_factory
        self._demand_factory = demand_factory
        self._asy_hard_lb_factory = asy_hard_lb_factory
        self._asy_soft_lb_factory = asy_soft_lb_factory
        self._asy_soft_ub_factory = asy_soft_ub_factory
        self._asy_hard_ub_factory = asy_hard_ub_factory
        self._product_asy_factory = product_asy_factory
        self._asy_deviation_cost_factory = asy_deviation_cost_factory

    def build(self) -> Coefficients:
        return Coefficients(
            product_cost=self._product_cost_factory.build(),
            product_available=self._product_available_factory.build(),
            demand=self._demand_factory.build(),
            asy_hard_lb=self._asy_hard_lb_factory.build(),
            asy_soft_lb=self._asy_soft_lb_factory.build(),
            asy_soft_ub=self._asy_soft_ub_factory.build(),
            asy_hard_ub=self._asy_hard_ub_factory.build(),
            product_asy=self._product_asy_factory.build(),
            asy_deviation_cost=self._asy_deviation_cost_factory.build(),
        )
