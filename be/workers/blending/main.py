# from pprint import pprint
from workers import AMQPWorker
import time
import socket
from .model_types import ModelInput
from .model import BlendingModel
from .input.json_input import JSONInputFactory
from .output import build_json_model_output


def amqp_host() -> str:
    # TODO: This is super hacky, use environment variables instead
    try:
        socket.gethostbyname("rabbitmq")
        return "rabbitmq"
    except socket.error:
        return "localhost"


def fn_solve(json_input):
    """Transform a json input into a json output"""
    model_input = JSONInputFactory(json_input["input"]).build()
    model = BlendingModel(model_input)
    model_output = model.solve()
    json_model_output = build_json_model_output(model_output)
    worker_output = {  # TODO: Pass along the metadata in a more automatic way, so we don't forget anything if we add something from the API side.
        "scenario_id": json_input["scenario_id"],
        "name": json_input["name"],
        "status": model_output.solution_status.name,
        "result": json_model_output,
    }
    return worker_output


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
