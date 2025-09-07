const mongoose = require("mongoose");
const generate = require("../../../helpers/generate");

const accountSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    token: {
      type: String,
      default: () => generate.generateRandomString(20), // dùng function để mỗi doc khác nhau
    },
    avatar: { type: String, default: "" },
    role_id: { type: String },
    role_name: { type: String },
    status: { type: String, default: "active" },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true, // tự sinh createdAt, updatedAt
  }
);

const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;
