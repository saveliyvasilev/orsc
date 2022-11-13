const reader = require('xlsx')
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

router.get('/new', (req, res) => {
    // Fetch raw data for new scenario and return in json format
    // TODO: Here a lot of the code will be written to pull data from many
    // systems, so might be a good idea to refactor it a bit in order to avoid 
    // rabbit holes.

    // Reading the manual excel file -- note that this file can be mounted via docker 
    console.log('Current directory: ' + process.cwd());
    const file = reader.readFile('./data/input_data.xlsx')

    let data = {}

    const sheets = file.SheetNames

    for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(
            file.Sheets[file.SheetNames[i]]
        )
        data[sheets[i]] = []
        temp.forEach((res) => {
            data[sheets[i]].push(res)
        })
    }
    console.log(data)
    res.json(data);
}
)

module.exports = router;
