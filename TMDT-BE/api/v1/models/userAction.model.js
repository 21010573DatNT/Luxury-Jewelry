const mongoose = require("mongoose");

const userActionSchema = new mongoose.Schema({
    user_id: String,
    product_id: [],
    action_type: String, 
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UserAction", userActionSchema, "user_actions");