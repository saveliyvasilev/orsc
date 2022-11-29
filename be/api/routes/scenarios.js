const reader = require("xlsx");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const BlendingScenario = require("../BlendingScenario");

router.get("/", async (request, response) => {
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

router.get("/new", (req, res) => {
    // Fetch raw data for new scenario and return in json format
    // TODO: Here a lot of the code will be written to pull data from many
    // systems, so might be a good idea to refactor it a bit in order to avoid
    // rabbit holes.

    // Reading the manual excel file -- note that this file can be mounted via docker
    console.log("Current directory: " + process.cwd());
    const file = reader.readFile("./data/input_data.xlsx");
    new_id = uuidv4();
    let data = {
        scenario_id: new_id, // Note: mongoose does not like to store "id" as field, somehow it's skipped. This is why we have "scenario_id"
        name: `New scenario`,
        status: "NEW",
        created_at: new Date(),
        input: {},
    };

    const sheets = file.SheetNames;

    for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
        data.input[sheets[i]] = [];
        temp.forEach((res) => {
            data.input[sheets[i]].push(res);
        });
    }
    res.json(data);
});

module.exports = router;
