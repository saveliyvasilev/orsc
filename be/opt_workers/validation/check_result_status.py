from enum import Enum, auto

class CheckResultStatus(Enum):
    PASS = auto()
    WARN = auto()
    FAIL = auto()
