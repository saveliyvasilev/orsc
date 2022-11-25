from typing import Set
from .sets import ProductsFactory, OrdersFactory, AssaysFactory
import pandas as pd


class ExcelAssaysFactory(AssaysFactory):
    def __init__(self) -> None:
        super().__init__()

    def build(self) -> Set[str]:
        return {"API_gravity", "sulfur"}  # TODO: Hardcoded


class ExcelProductsFactory(ProductsFactory):
    def __init__(self, products_df: pd.DataFrame) -> None:
        super().__init__()
        self._products_df = products_df.copy()

    def build(self) -> Set[str]:
        return set(self._products_df.loc[:, "product_id"].astype(str))


class ExcelOrdersFactory(OrdersFactory):
    def __init__(self, orders_df: pd.DataFrame) -> None:
        super().__init__()
        self._orders_df = orders_df.copy()

    def build(self) -> Set[str]:
        return set(self._orders_df.loc[:, "order_id"].astype(str))
