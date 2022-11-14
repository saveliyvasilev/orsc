import traceback
from validation.check_result_status import CheckResultStatus
from .check_result import CheckResult
from typing import List


class Check:
    """
    Base class for implementing and extending a validation library

    To extend, inherit and override the `_run(self)` method. If needed,
    use `__init__` method for passing data parameters and configuring the check.
    """

    def __init__(self) -> None:
        self._results = []

    def run(self) -> None:
        """Safely execute the check

        Returns:
            CheckResult: The result of the check
        """
        try:
            self._results = []
            self._run()
        except NotImplementedError:
            raise
        except Exception:  # pylint: disable=broad-except
            self._add_fail(message=traceback.format_exc())

    @property
    def results(self) -> List[CheckResult]:
        return self._results

    def _check_name(self) -> str:
        return self.__class__.__name__

    def _add_check_result(self, check_result: CheckResult) -> None:
        self._results.append(check_result)

    def _add_fail(self, message: str) -> None:
        self._add_check_result(
            CheckResult(self._check_name(), CheckResultStatus.FAIL, message)
        )

    def _add_pass(self, message: str) -> None:
        self._add_check_result(
            CheckResult(self._check_name(), CheckResultStatus.PASS, message)
        )

    def _add_warn(self, message: str) -> None:
        self._add_check_result(
            CheckResult(self._check_name(), CheckResultStatus.WARN, message)
        )

    def _run(self) -> None:
        """Execute the concrete check, stub method for overriding

        Use `self._add_fail`, `self._add_pass` and `self._add_warn` to store the results
        Raises:
            NotImplementedError: If not overriden

        Returns:
            CheckResult: The result of the check
        """
        raise NotImplementedError()
