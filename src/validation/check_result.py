from .check_result_status import CheckResultStatus


class CheckResult:
    """Represents an output of a Check."""

    def __init__(
        self, check_name: str, status: CheckResultStatus, message: str = ""
    ) -> None:
        """Constructor

        Args:
            check_name (str): Name of the check that generated this result
            status (CheckResultStatus): Check outcome
            message (str, optional): Hopefully an actionable message in case of no success. Defaults to "".
        """
        self._check_name = check_name
        self._status = status
        self._message = message

    @property
    def check_name(self) -> str:
        return self._check_name

    @property
    def message(self) -> str:
        return self._message

    @property
    def status(self) -> CheckResultStatus:
        return self._status
