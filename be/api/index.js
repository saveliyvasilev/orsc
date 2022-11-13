const express = require('express')
const cors = require("cors")

const PORT = process.env.PORT || 3001;


const app = express();
app.use(
    cors({
        origin: "*",
    })
)

const scenariosRouter = require('./routes/scenarios')

app.use('/scenarios', scenariosRouter)

app.listen(PORT,
    () => {
        console.log(`Listening at port ${PORT}`)
    }
)