import pika
import json


class AMQPWorker:
    def __init__(
        self, fn_solve, amqp_host: str, input_queue: str, output_queue: str
    ) -> None:
        """Initialize an AMQP interactor"""
        self._input_queue = input_queue
        self._output_queue = output_queue
        self._connection: pika.BlockingConnection = self._init_conn(amqp_host)
        self._channel = self._connection.channel()
        self._channel.queue_declare(input_queue, durable=True)
        self._channel.queue_declare(output_queue, durable=True)
        self._fn = fn_solve

    def _callback_function(self, ch, method, properties, body):
        scenario = json.loads(body)
        print(f"Received {scenario['id']}")
        result = self._fn(json.loads(body))
        print(f"Computation finished with status: {result['status']}")
        # TODO: enqueue in reply queue
        self._channel.basic_publish(
            exchange="", routing_key=self._output_queue, body=json.dumps(result)
        )

    def listen(self):
        self._channel.basic_consume(
            self._input_queue,
            auto_ack=True,
            on_message_callback=self._callback_function,
        )
        print("Running worker")
        self._channel.start_consuming()

    def _init_conn(self, amqp_host) -> pika.BlockingConnection:
        params = pika.ConnectionParameters(amqp_host)
        return pika.BlockingConnection(params)

    def _init_channel(self):
        return self._connection.channel()
