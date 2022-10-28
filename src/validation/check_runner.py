from typing import Collection, List
from .check import Check
from .check_result_status import CheckResultStatus
from .check_result import CheckResult


class CheckRunner:
    def __init__(self, checks: Collection[Check]) -> None:
        """Create a runner instance with the checks in place.

        Instantiation does not mean the checks are executed. Use
        the `run` method to execute these checks

        Args:
            checks (Collection[Check]): the checks themselves, these checks
            contain the data
        """
        self._checks = checks
        self._results: List[CheckResult] = []

    def run(self):
        """Executes the configured runner"""
        self._results = []
        # Unless becomes a performance bottleneck, keep this single-thread
        for check in self._checks:
            check.run()  # Assumes no exception
            self._results.extend(check.results)
        return

    @property
    def results(self) -> List[CheckResult]:
        """Retrieve the executed results"""
        return self._results
