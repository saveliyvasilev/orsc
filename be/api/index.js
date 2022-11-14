const express = require("express");
const cors = require("cors");
const listenToWorkers = require("./consumer");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(
    cors({
        origin: "*",
    })
);
app.use(express.json());

const scenariosRouter = require("./routes/scenarios");
const optimizationQueueRouter = require("./routes/optimizationqueue");
app.use("/scenarios", scenariosRouter);
app.use("/optimizationqueue", optimizationQueueRouter);

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
});

listenToWorkers();
