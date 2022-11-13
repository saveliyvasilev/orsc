const amqp = require('amqplib')
const express = require('express')

const router = express.Router()

const scenario = { name: "MyName" }

async function connectAmqp() {
    try {
        const amqpConnection = await amqp.connect(`amqp://guest:guest:rabbitmq:5672`);
        const channel = await amqpConnection.createChannel();
        const result = await channel.assertQueue("blendingScenario");
        channel.sendToQueue("blendingScenario", Buffer.from(JSON.stringify(scenario)));
        console.log("Enqueued " + scenario.name)
    } catch (ex) {
        console.log(ex)
    }
}
connectAmqp();
// amqp.


router.post('/', (req, res) => {
    // Enqueue the optimization scenario
    console.log(req.body)

    res.status(201).json()
})

module.exports = router;
