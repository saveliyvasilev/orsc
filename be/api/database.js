const mongoose = require("mongoose");
const MONGO_DB_URI = "mongodb://mongo/blending";

const conn = mongoose.connect(MONGO_DB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
console.log("Connected to mongoDB");
