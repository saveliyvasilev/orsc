from typing import Dict, Set, Tuple, List, Any
from .coefficients import (
    ProductCostFactory,
    ProductAvailableFactory,
    DemandFactory,
    AsyHardLBFactory,
    AsySoftLBFactory,
    AsySoftUBFactory,
    AsyHardUBFactory,
    ProductAsyFactory,
    AsyDeviationCostFactory,
)
import pandas as pd


def _extract_from_df(
    indices: List[str], value_column: str, df: pd.DataFrame
) -> Dict[Tuple, Any]:
    d = df.loc[:, indices + [value_column]]
    d.loc[:, indices] = d.loc[:, indices].astype(str)
    return d.set_index(indices)[value_column].to_dict()  # type: ignore


class ExcelProductCostFactory(ProductCostFactory):
    def __init__(self, product_df: pd.DataFrame) -> None:
        super().__init__()
        self._product_df = product_df.copy()

    def build(self) -> Dict[str, float]:
        return _extract_from_df(["product_id"], "cost", self._product_df)  # type: ignore


class ExcelProductAvailableFactory(ProductAvailableFactory):
    def __init__(self, product_df: pd.DataFrame) -> None:
        super().__init__()
        self._product_df = product_df.copy()

    def build(self) -> Dict[str, float]:
        return _extract_from_df(["product_id"], "reserves", self._product_df)  # type: ignore


class ExcelDemandFactory(DemandFactory):
    def __init__(self, orders_df: pd.DataFrame) -> None:
        super().__init__()
        self._orders_df = orders_df.copy()

    def build(self) -> Dict[str, float]:
        return _extract_from_df(["order_id"], "demand", self._orders_df)  # type: ignore


class ExcelAsyHardLBFactory(AsyHardLBFactory):
    def __init__(self, assays: Set[str], orders_df: pd.DataFrame) -> None:
        super().__init__()
        self._assays = assays
        self._orders_df = orders_df.copy()

    def build(self) -> Dict[Tuple[str, str], float]:
        asy_dicts = list()
        for asy in self._assays:
            asy_col_name = asy + "_hard_lb"
            asy_dicts.append(
                _extract_from_df(["order_id", asy], asy_col_name, self._orders_df)
            )
        return {k: v for asy_dict in asy_dicts for k, v in asy_dict.items()}


class ExcelAsySoftLBFactory(AsySoftLBFactory):
    def __init__(self, assays: Set[str], orders_df: pd.DataFrame) -> None:
        super().__init__()
        self._assays = assays
        self._orders_df = orders_df.copy()

    def build(self) -> Dict[Tuple[str, str], float]:
        asy_dicts = list()
        for asy in self._assays:
            asy_col_name = asy + "_soft_lb"
            asy_dicts.append(
                _extract_from_df(["order_id", asy], asy_col_name, self._orders_df)
            )
        return {k: v for asy_dict in asy_dicts for k, v in asy_dict.items()}


class ExcelAsySoftUBFactory(AsySoftUBFactory):
    def __init__(self, assays: Set[str], orders_df: pd.DataFrame) -> None:
        super().__init__()
        self._assays = assays
        self._orders_df = orders_df.copy()

    def build(self) -> Dict[Tuple[str, str], float]:
        asy_dicts = list()
        for asy in self._assays:
            asy_col_name = asy + "_soft_ub"
            asy_dicts.append(
                _extract_from_df(["order_id", asy], asy_col_name, self._orders_df)
            )
        return {k: v for asy_dict in asy_dicts for k, v in asy_dict.items()}


class ExcelAsyHardUBFactory(AsyHardUBFactory):
    def __init__(self, assays: Set[str], orders_df: pd.DataFrame) -> None:
        super().__init__()
        self._assays = assays
        self._orders_df = orders_df.copy()

    def build(self) -> Dict[Tuple[str, str], float]:
        asy_dicts = list()
        for asy in self._assays:
            asy_col_name = asy + "_hard_ub"
            asy_dicts.append(
                _extract_from_df(["order_id", asy], asy_col_name, self._orders_df)
            )
        return {k: v for asy_dict in asy_dicts for k, v in asy_dict.items()}


class ExcelProductAsyFactory(ProductAsyFactory):
    def __init__(self, assays: Set[str], product_df: pd.DataFrame) -> None:
        super().__init__()
        self._assays = assays
        self._product_df = product_df.copy()

    def build(self) -> Dict[Tuple[str, str], float]:
        asy_dicts = list()
        for asy in self._assays:
            asy_dicts.append(_extract_from_df(["product_id"], asy, self._product_df))
        return {k: v for asy_dict in asy_dicts for k, v in asy_dict.items()}


class ExcelAsyDeviationCostFactory(AsyDeviationCostFactory):
    def __init__(self, assays: Set[str]) -> None:
        super().__init__()
        self._assays = assays

    def build(self) -> Dict[str, float]:
        base_penalty = 10.0
        hardcoded_penalties = {
            "API_gravity": base_penalty,
            "sulfur": base_penalty * 161,
        }  # the 161 is to adjusto for magnitude in deviations between sulfur and API_gravity
        if set(hardcoded_penalties.keys()) != self._assays:
            raise ValueError(
                "Something is wrong with hardcoded data, missing or excess assay types"
            )
        return hardcoded_penalties
