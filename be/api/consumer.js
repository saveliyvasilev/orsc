const amqp = require('amqplib')

// We keep an eye on the response queue from the workers.
// When we see a compelted job we store it into the database.

async function listenToWorkers() {
    try {
        const amqpConnection = await amqp.connect(`amqp://rabbitmq:5672`);
        const channel = await amqpConnection.createChannel();
        await channel.assertQueue("blendingSolution");

        channel.consume("blendingSolution", message => {
            try {
                const solution = JSON.parse(message.content.toString());
                channel.ack(message)
                console.log(`Worker completed ${solution.name}, removed from queue`)
            }
            catch (ex) {
                console.error(ex)
            }
        })
        console.log("Listening blending solutions")

    } catch (ex) {
        console.log(ex)
    }
}

module.exports = listenToWorkers