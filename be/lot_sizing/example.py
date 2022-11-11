from .output import format_output
from .types import ModelInput
from .model import LotSizingModel, SolutionStatus
from .input import build_coefficients, build_sets


def model_input():
    sets = build_sets()
    coefficients = build_coefficients(sets)
    return ModelInput(sets=sets, coefficients=coefficients)


if __name__ == "__main__":
    lsm = LotSizingModel(model_input=model_input())
    model_output = lsm.solve()
    if model_output.solution_status == SolutionStatus.FAIL:
        raise RuntimeError("something failed")
    # pprint(model_output.objective.__dict__)
    format_output(model_output)
