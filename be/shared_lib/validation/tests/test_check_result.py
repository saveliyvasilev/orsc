from ..check_result import CheckResult
from ..check_result import CheckResultStatus


def test_check_result_fail():
    cr = CheckResult("CheckName1", CheckResultStatus.FAIL, "Some failed message")
    assert cr.check_name == "CheckName1"
    assert cr.status == CheckResultStatus.FAIL
    assert cr.message == "Some failed message"


def test_check_result_pass():
    cr = CheckResult("CheckName2", CheckResultStatus.PASS, "Some great message")
    assert cr.check_name == "CheckName2"
    assert cr.status == CheckResultStatus.PASS
    assert cr.message == "Some great message"


def test_check_result_warn():
    cr = CheckResult("CheckName3", CheckResultStatus.WARN, "Some obscure message")
    assert cr.check_name == "CheckName3"
    assert cr.status == CheckResultStatus.WARN
    assert cr.message == "Some obscure message"


def test_check_result_default_str():
    cr = CheckResult("CheckName", CheckResultStatus.PASS)
    assert cr.check_name == "CheckName"
    assert cr.message == ""
