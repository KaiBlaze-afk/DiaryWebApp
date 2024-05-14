const mongoose = require("mongoose");

const entriesSchema = new mongoose.Schema({
    color: String,
    email: String,
    dateTime: String,
    tags: [String],
    data: String
});

const UserEntries = mongoose.model("entries", entriesSchema);
module.exports = UserEntries;
