# Definitions for blending input data factories.
# This is to decouple the data source from the model code

from abc import ABC, abstractmethod
from typing import Set
from ..model_types import Sets, Coefficients


class ProductsFactory(ABC):
    @abstractmethod
    def build(self) -> Set[str]:
        pass


class OrdersFactory(ABC):
    @abstractmethod
    def build(self) -> Set[str]:
        pass


class AssaysFactory(ABC):
    @abstractmethod
    def build(self) -> Set[str]:
        pass


class SetFactory:
    def __init__(
        self,
        products_factory: ProductsFactory,
        orders_factory: OrdersFactory,
        assays_factory: AssaysFactory,
    ) -> None:
        self._products_factory = products_factory
        self._orders_factory = orders_factory
        self._assays_factory = assays_factory

    def build(self) -> Sets:
        return Sets(
            products=self._products_factory.build(),
            orders=self._orders_factory.build(),
            assays=self._assays_factory.build(),
        )
