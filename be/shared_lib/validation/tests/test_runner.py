import pytest

from ..check_result import CheckResult
from ..check_result_status import CheckResultStatus
from ..check import Check
from ..check_runner import CheckRunner
from .positive_element_check import PositiveElementsCheck


def _equal_check_results(r1: CheckResult, r2: CheckResult) -> bool:
    """Compare for equality two CheckResults, helper for testing"""
    eq = r1.check_name == r2.check_name
    eq &= r1.message == r2.message
    eq &= r1.status == r2.status
    return eq


def test_runner_with_empty_checks_yields_no_results():
    r = CheckRunner([])
    r.run()
    assert len(r.results) == 0


def test_runner_with_invalid_check_fails():
    r = CheckRunner([Check()])
    with pytest.raises(NotImplementedError):
        r.run()


def test_runner_with_single_check_yields_same_results_as_check():
    r = CheckRunner([PositiveElementsCheck([1, 2, 3])])
    r.run()
    run_result = r.results[0]

    check = PositiveElementsCheck([1, 2, 3])
    check.run()
    check_result = check.results[0]

    assert _equal_check_results(check_result, run_result)


def test_runner_with_two_simple_checks_returns_two_answers():
    r = CheckRunner([PositiveElementsCheck([1, 2]), PositiveElementsCheck([0, 2])])
    r.run()

    assert len(r.results) == 2
    assert (
        len([result for result in r.results if result.status == CheckResultStatus.WARN])
        == 1
    )
    assert (
        len([result for result in r.results if result.status == CheckResultStatus.PASS])
        == 1
    )
    assert (
        len([result for result in r.results if result.status == CheckResultStatus.FAIL])
        == 0
    )
