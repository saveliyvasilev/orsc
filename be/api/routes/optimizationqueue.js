const amqp = require("amqplib");
const express = require("express");
const BlendingScenario = require("../BlendingScenario");

const router = express.Router();

// TODO: Make this connection manager thing more robust, consider using the
// amqp-connection-manager or read more about the subject. Now we're creating a
// new connection each time we need to queue -- might be a bad idea (but.. we don't
// typically expect a huge load on the queues)
async function enqueue(scenario) {
    try {
        const amqpConnection = await amqp.connect(`amqp://rabbitmq:5672`);
        const channel = await amqpConnection.createChannel();
        await channel.assertQueue("blendingScenario");
        console.log("Opened amqp conn");
        channel.sendToQueue("blendingScenario", Buffer.from(JSON.stringify(scenario)));
        console.log(`Enqueued (id: ${scenario.id}) ${scenario.name}`);
        setTimeout(function () {
            amqpConnection.close();
            console.log("Closed amqp conn");
        }, 500);
    } catch (ex) {
        console.log(ex);
    }
}

router.post("/", async (req, res) => {
    // Create an element in the database
    const newScenario = new BlendingScenario(req.body);
    await newScenario.save();
    // Enqueue the optimization scenario for worker to pick up
    await enqueue(req.body);
    res.status(201).json();
});

module.exports = router;
