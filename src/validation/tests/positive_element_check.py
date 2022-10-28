from typing import List
from ..check import Check


class PositiveElementsCheck(Check):
    """Dummy check class to see if all elements in the list are positive.
    Sends a fail if <0 detected, a warn if == 0 is present, and pass otherwise"""

    def __init__(self, data: List[int]) -> None:
        super().__init__()
        self._data = data

    def _run(self):
        success = all(x > 0 for x in self._data)
        if success:
            self._add_pass("Great!")
        elif any(x < 0 for x in self._data):
            self._add_fail("Failed!")
        else:
            self._add_warn("There is a zero element :/")
