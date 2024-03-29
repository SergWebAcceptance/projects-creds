const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmailAccountsSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  aliases: [{ type: String }],
  emailCategory:{ type: Schema.Types.ObjectId, ref: "ProjectsCategory", required: true }
});

module.exports =
  mongoose.models.EmailAccounts || mongoose.model("EmailAccounts", EmailAccountsSchema);
