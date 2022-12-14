const express = require("express");
const router = express.Router();
const BlendingScenario = require("../BlendingScenario");
const { v4: uuidv4 } = require("uuid");

router.get("/:scenario_id", async (req, res) => {
    // Fetch only the input from a stored scenario_id and create a new id and status for the
    // same input

    console.log("Querying for duplication: " + req.params.scenario_id);
    try {
        const scenario = await BlendingScenario.findOne({ scenario_id: req.params.scenario_id });

        new_id = uuidv4();
        let data = {
            scenario_id: new_id,
            name: `${scenario.name} (Copy)`,
            status: "NEW",
            created_at: new Date(),
            input: scenario.input,
        };

        res.json(data);
    } catch (err) {
        console.error(err);
        res.json({ Error: "mongo" }); // TODO: handle errors properly api-wise
    }
});

module.exports = router;
