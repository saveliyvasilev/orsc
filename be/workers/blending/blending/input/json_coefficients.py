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
    UnderloadCostFactory,
)

import pandas as pd


def _extract_floats_from_records_with_id(
    records: List[Dict], id_field: str, value_field: str
) -> Dict[str, float]:
    return {record[id_field]: record[value_field] for record in records}


class JSONProductCostFactory(ProductCostFactory):
    def __init__(self, product_records: List[Dict]) -> None:
        super().__init__()
        self._product_records = product_records

    def build(self) -> Dict[str, float]:
        return _extract_floats_from_records_with_id(
            self._product_records, "product_id", "cost"
        )


class JSONProductAvailableFactory(ProductAvailableFactory):
    def __init__(self, product_records: List[Dict]) -> None:
        super().__init__()
        self._product_records = product_records

    def build(self) -> Dict[str, float]:
        return _extract_floats_from_records_with_id(
            self._product_records, "product_id", "reserves"
        )


class JSONDemandFactory(DemandFactory):
    def __init__(self, order_records: List[Dict]) -> None:
        super().__init__()
        self._order_records = order_records

    def build(self) -> Dict[str, float]:
        return _extract_floats_from_records_with_id(
            self._order_records,
            "order_id",
            "amount",
        )


class JSONAsyHardLBFactory(AsyHardLBFactory):
    def __init__(self, assays: Set[str], order_records: List[Dict]) -> None:
        super().__init__()
        self._assays = assays
        self._order_records = order_records

    def build(self) -> Dict[Tuple[str, str], float]:
        return {
            (r["order_id"], asy): r[asy + "_hard_lb"]
            for asy in self._assays
            for r in self._order_records
        }


class JSONAsySoftLBFactory(AsySoftLBFactory):
    def __init__(self, assays: Set[str], order_records: List[Dict]) -> None:
        super().__init__()
        self._assays = assays
        self._order_records = order_records

    def build(self) -> Dict[Tuple[str, str], float]:
        return {
            (r["order_id"], asy): r[asy + "_soft_lb"]
            for asy in self._assays
            for r in self._order_records
        }


class JSONAsySoftUBFactory(AsySoftUBFactory):
    def __init__(self, assays: Set[str], order_records: List[Dict]) -> None:
        super().__init__()
        self._assays = assays
        self._order_records = order_records

    def build(self) -> Dict[Tuple[str, str], float]:
        return {
            (r["order_id"], asy): r[asy + "_soft_ub"]
            for asy in self._assays
            for r in self._order_records
        }


class JSONAsyHardUBFactory(AsyHardUBFactory):
    def __init__(self, assays: Set[str], order_records: List[Dict]) -> None:
        super().__init__()
        self._assays = assays
        self._order_records = order_records

    def build(self) -> Dict[Tuple[str, str], float]:
        return {
            (r["order_id"], asy): r[asy + "_hard_ub"]
            for asy in self._assays
            for r in self._order_records
        }


class JSONProductAsyFactory(ProductAsyFactory):
    def __init__(self, assays: Set[str], product_records: List[Dict]) -> None:
        super().__init__()
        self._assays = assays
        self._product_records = product_records.copy()

    def build(self) -> Dict[Tuple[str, str], float]:
        return {
            (r["product_id"], asy): r[asy]
            for asy in self._assays
            for r in self._product_records
        }


class JSONAsyDeviationCostFactory(AsyDeviationCostFactory):
    def __init__(self, assays: Set[str], scenario_settings: Dict[str, float]) -> None:
        super().__init__()
        self._assays = assays
        self._scenario_settings = scenario_settings

    def build(self) -> Dict[str, float]:
        penalties = {
            "API_gravity": self._scenario_settings["API_gravity_deviation_cost"],
            "sulfur": self._scenario_settings["sulfur_deviation_cost"],
        }
        if set(penalties.keys()) != self._assays:
            raise ValueError(
                "Something is wrong with hardcoded data, missing or excess assay types"
            )
        return penalties


class JSONUnderloadCostFactory(UnderloadCostFactory):
    def __init__(self, scenario_settings: Dict[str, float]) -> None:
        super().__init__()
        self._scenario_settings = scenario_settings

    def build(self) -> float:
        return self._scenario_settings["underload_cost"]
