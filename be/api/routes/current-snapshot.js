const reader = require("xlsx");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

router.get("/", (req, res) => {
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
