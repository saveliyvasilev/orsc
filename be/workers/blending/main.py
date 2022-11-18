# from pprint import pprint
from workers import AMQPWorker
import time


def fn_solve(raw_input):
    """Transform a json input into a json output"""
    return {
        "result": "I love you but I cannot do much.",
        "status": "Done",
        "name": raw_input["name"],
    }


if __name__ == "__main__":
    time.sleep(5)  # To let docker rabbitmq begin
    worker = AMQPWorker(
        fn_solve,
        amqp_host="rabbitmq",  # Use localhost if executing the main.py outside a container
        input_queue="blendingScenario",
        output_queue="blendingSolution",
    )
    worker.listen()
