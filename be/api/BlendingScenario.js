const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// This is to speed up early stage dev. Consider using a schema in a larger project.
const blendingScenarioSchema = new Schema({}, { strict: false });

module.exports = mongoose.model("BlendingScenario", blendingScenarioSchema);
