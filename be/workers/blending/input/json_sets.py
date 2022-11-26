from typing import Dict, List, Set
from .sets import ProductsFactory, OrdersFactory, AssaysFactory
import pandas as pd


class JSONAssaysFactory(AssaysFactory):
    def __init__(self) -> None:
        super().__init__()

    def build(self) -> Set[str]:
        return {"API_gravity", "sulfur"}  # TODO: Hardocded


class JSONProductsFactory(ProductsFactory):
    def __init__(self, product_records: List[Dict]) -> None:
        super().__init__()
        self._product_records = product_records.copy()

    def build(self) -> Set[str]:
        return set(product["product_id"] for product in self._product_records)


class JSONOrdersFactory(OrdersFactory):
    def __init__(self, order_records: List[Dict]) -> None:
        super().__init__()
        self._order_records = order_records.copy()

    def build(self) -> Set[str]:
        return set(order["order_id"] for order in self._order_records)
