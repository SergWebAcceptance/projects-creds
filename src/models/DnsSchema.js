const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DnsAccountSchema = new Schema({
  name: { type: String, required: true },
  login: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports =
  mongoose.models.DnsAccount || mongoose.model("DnsAccount", DnsAccountSchema);
