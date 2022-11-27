// TODO: Separate mongo code from worker code, a bit at least (as keeping connections and so forth)

const amqp = require("amqplib");
const BlendingScenario = require("./BlendingScenario");

// We keep an eye on the response queue from the workers.
// When we see a compelted job we store it into the database.
async function storeSolution(solution) {
    try {
        await BlendingScenario.findOneAndUpdate(
            { scenario_id: solution.scenario_id },
            { $set: { output: solution.result, status: solution.status } },
            { new: true }
        );
        console.log(`Updated solution ${solution.scenario_id} in DB`);
    } catch (ex) {
        console.error(ex);
    }
}

async function listenToWorkers() {
    await new Promise((resolve) => setTimeout(resolve, 4000)); // Some delay to allow rabbitmq to spin up -- this should be refactored into something that would reconnect :)
    try {
        const amqpConnection = await amqp.connect(`amqp://rabbitmq:5672`);
        const channel = await amqpConnection.createChannel();
        await channel.assertQueue("blendingSolution");

        channel.consume("blendingSolution", async (message) => {
            try {
                const solution = JSON.parse(message.content.toString());
                await storeSolution(solution);
                channel.ack(message);
                console.log(`Worker completed ${solution.name}, removed from queue`);
            } catch (ex) {
                console.error(ex);
            }
        });
        console.log("Listening blending solutions");
    } catch (ex) {
        console.log(ex);
    }
}

module.exports = listenToWorkers;
