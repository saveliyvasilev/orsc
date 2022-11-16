import pytest
from typing import List

from .positive_element_check import PositiveElementsCheck

from ..check_result_status import CheckResultStatus
from ..check import Check


def test_non_overrided_check_should_raise():
    c = Check()
    with pytest.raises(NotImplementedError):
        c.run()


def test_failing_check_shows_fail():
    pec = PositiveElementsCheck([3, -1])
    pec.run()
    for result in pec.results:
        assert result.status == CheckResultStatus.FAIL
        assert result.message == "Failed!"
        assert result.check_name == "PositiveElementsCheck"


def test_passing_check_shows_pass():
    pec = PositiveElementsCheck([3, 1])
    pec.run()
    for result in pec.results:
        assert result.status == CheckResultStatus.PASS
        assert result.message == "Great!"
        assert result.check_name == "PositiveElementsCheck"


def test_passing_check_shows_warn():
    pec = PositiveElementsCheck([3, 1, 0])
    pec.run()
    for result in pec.results:
        assert result.status == CheckResultStatus.WARN
        assert result.message == "There is a zero element :/"
        assert result.check_name == "PositiveElementsCheck"


def test_running_twice_yields_same_result():
    pec = PositiveElementsCheck([3, 1, 0])
    pec.run()
    first_results = pec.results
    n1 = len(first_results)
    pec.run()
    second_results = pec.results
    n2 = len(second_results)
    for result_1, result_2 in zip(first_results, second_results):
        assert result_1.status == result_2.status
        assert result_1.message == result_2.message
        assert result_1.check_name == result_2.check_name

    assert n1 == n2
