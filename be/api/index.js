const express = require('express')
const cors = require("cors")

const PORT = process.env.PORT || 3001;

const mock_scenarios = [
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

const app = express();
app.use(
    cors({
        origin: "*",
    })
)

app.get('/scenarios', (request, response) => {
    response.json(mock_scenarios);
});

app.listen(PORT,
    () => {
        console.log(`Listening at port ${PORT}`)
    }
)