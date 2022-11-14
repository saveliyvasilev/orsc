from dataclasses import fields
from datetime import datetime
from enum import Enum
from typing import Dict, List
import pandas as pd

from .types import ModelOutput, SolutionStatus


class FieldNames(Enum):
    location = "Location"
    time = "Time"


def format_output(model_output: ModelOutput):
    """Given the model raw output, generate output report(s)

    In this case the output is an excel workbook, where the sheets
    represent different pieces of information (obj parts, var1, var2, ...)
    """

    if model_output.solution_status == SolutionStatus.FAIL:
        raise ValueError("Cannot construct excel sheets for failed optimization.")

    sheet_dict = _sheet_dict(model_output)
    # TODO: eventually here you can inject some custom-made reports, refactor code for it
    _save_to_file(sheet_dict)


def _sheet_dict(model_output: ModelOutput) -> Dict[str, pd.DataFrame]:
    # TODO: eventually move to some lib-like code since it's quite low level and we don't
    # want to expose these details. Btw, it's coupled with ModelOutput, that's why it didn't
    # go directly into a lib-like code
    out = dict()
    out["Objective"] = _objective_df(model_output)
    for field in fields(model_output.variables):
        out[field.name] = _variable_df(model_output, field.name)

    return out


def _dict_to_records(d: Dict, field_names: List[str]) -> List[Dict]:
    out = list()
    for index, value in d.items():
        out.append({**dict(zip(field_names, index)), "value": value})
    return out


def _variable_df(model_output: ModelOutput, var_name: str) -> pd.DataFrame:
    var_columns = {  # TODO: refactor this into something out of here
        "production": [FieldNames.location.value, FieldNames.time.value],
        "stock": [FieldNames.location.value, FieldNames.time.value],
    }

    var_dict = getattr(model_output.variables, var_name)
    return pd.DataFrame.from_records(_dict_to_records(var_dict, var_columns[var_name]))


def _objective_df(model_output: ModelOutput) -> pd.DataFrame:
    out = pd.DataFrame([model_output.objective]).T

    out.reset_index(inplace=True)
    out.rename(columns={0: "Value", "index": "Part"}, inplace=True, errors="raise")
    return out


def _save_to_file(sheet_dict: Dict[str, pd.DataFrame]):
    with pd.ExcelWriter(f"output/{_timestamp()}_output.xlsx") as writer:
        for sheet_name, df in sheet_dict.items():
            df.to_excel(writer, sheet_name=sheet_name, index=False)


def _timestamp():
    return datetime.now().strftime("%Y%m%d_%H%M%S")
