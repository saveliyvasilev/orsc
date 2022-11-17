# from pprint import pprint
from workers import AMQPWorker


def fn_solve(raw_input):
    """Transform a json input into a json output"""
    return {
        "result": "I love you but I cannot do much.",
        "status": "Done",
        "name": "Allo!",
    }


if __name__ == "__main__":
    worker = AMQPWorker(
        fn_solve,
        amqp_host="localhost",
        input_queue="blendingScenario",
        output_queue="blendingSolution",
    )
    worker.listen()
