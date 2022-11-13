const express = require('express')
const router = express.Router()

let mock_scenarios = [
    {
        id: 1,
        name: "Extra sales to c1",
        optTime: "16:22 16/11/2022",
        kpi: "$ 2,580,000",
        status: "Completed"
    },
    {
        id: 2,
        name: "Remove the c2 demand",
        optTime: "16:15 16/11/2022",
        kpi: "$ 2,380,000",
        status: "Completed"
    },
    {
        id: 3,
        name: "Extra sales to c1",
        optTime: "16:15 16/11/2022",
        kpi: "$ 2,380,000",
        status: "Completed"
    },
    {
        id: 4,
        name: "Extra sales to c1",
        optTime: "16:15 16/11/2022",
        kpi: "$ 2,380,000",
        status: "Completed"
    }
]


router.get('/', (request, response) => {
    response.json(mock_scenarios);
});

router.delete('/:id', (req, res) => {
    // TODO: make DB
    console.log("Deleting " + req.params.id);
    mock_scenarios = mock_scenarios.filter(scenario => scenario.id != req.params.id)
    res.status(204).send()
})

router.post('/', (req, res) => {
    // TODO: make DB
    id = Math.floor(Math.random() * 1000)
    new_entry = {
        id: id,
        name: "Scenario " + id,
        optTime: "16:22 16/11/2022",
        kpi: "$ 1,580,000",
        status: "Completed"
    }

    mock_scenarios.push(new_entry);
    res.status(201).json(new_entry)
})

module.exports = router;
