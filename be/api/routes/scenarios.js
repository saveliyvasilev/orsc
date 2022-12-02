const express = require("express");
const router = express.Router();
const BlendingScenario = require("../BlendingScenario");

router.get("/:scenario_id", async (request, response) => {
    console.log("Querying specific scenario " + request.params.scenario_id);
    try {
        const scenarios = await BlendingScenario.findOne({ scenario_id: request.params.scenario_id });
        response.json(scenarios);
    } catch (err) {
        console.error(err);
        response.json({ Error: "mongo" }); // TODO: handle errors properly api-wise
    }
});

router.get("/", async (request, response) => {
    console.log("Querying all scenarios");
    try {
        const scenarios = await BlendingScenario.find({}).sort({ created_at: "desc" });
        response.json(scenarios);
    } catch (err) {
        console.error(err);
        response.json({ Error: "mongo" }); // TODO: handle errors properly api-wise
    }
});

router.delete("/:scenario_id", async (req, res) => {
    console.log("Deleting " + req.params.scenario_id);
    try {
        const deleteResult = await BlendingScenario.deleteMany({ scenario_id: req.params.scenario_id });
        console.log(deleteResult);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send(); // TODO: handle errors properly api-wise
    }
});

module.exports = router;
