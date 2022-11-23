# from pprint import pprint
from workers import AMQPWorker
import time
import socket


def amqp_host() -> str:
    # TODO: This is super hacky, use environment variables instead
    try:
        socket.gethostbyname("rabbitmq")
        return "rabbitmq"
    except socket.error:
        return "localhost"


def fn_solve(raw_input):
    """Transform a json input into a json output"""
    return {
        "result": "I love you but I cannot do much.",
        "status": "Doddne",
        "name": raw_input["name"],
        "id": raw_input["id"],
    }


if __name__ == "__main__":
    # TODO: This is a hack # To let docker rabbitmq begin
    if amqp_host() == "rabbitmq":
        time.sleep(5)
    # End-hack
    worker = AMQPWorker(
        fn_solve,
        amqp_host=amqp_host(),
        input_queue="blendingScenario",
        output_queue="blendingSolution",
    )
    worker.listen()
