const express = require("express");
const cors = require("cors");
const listenToWorkers = require("./consumer");
const database = require("./database");

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
const currentSnapshotRouter = require("./routes/current-snapshot");
const duplicateScenarioRouter = require("./routes/duplicate-scenario");
app.use("/scenarios", scenariosRouter);
app.use("/optimization-queue", optimizationQueueRouter);
app.use("/current-snapshot", currentSnapshotRouter);
app.use("/duplicate-scenario", duplicateScenarioRouter);

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
});

listenToWorkers();
