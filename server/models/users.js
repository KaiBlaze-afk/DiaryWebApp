const mongoose = require("mongoose")

const users = new mongoose.Schema({
    username : String,
    email : String,
    password : String,
    viewMode : {type: String, default: "Detail"}
})
const Usermodel = mongoose.model("users", users)
module.exports = Usermodel
