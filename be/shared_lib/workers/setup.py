from setuptools import setup, find_packages

setup(
    name="workers",
    version="0.0.1",
    description="Small lib to run the models under different interactor modes. Currently supporting CLI and AMQP (RabbitMQ)",
    author="Saveliy Vasilev",
    author_email="saveliy.v.vasilev@gmail.com",
    packages=find_packages(exclude=("tests")),
    install_requires=["pika"],
)
