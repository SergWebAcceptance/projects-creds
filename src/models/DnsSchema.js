const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DnsAccountSchema = new Schema({
  name: { type: String, required: false },
  login: { type: String, required: false },
  password: { type: String, required: false },
  projectCategory:{ type: Schema.Types.ObjectId, ref: "ProjectsCategory", required: false }
});

module.exports =
  mongoose.models.DnsAccount || mongoose.model("DnsAccount", DnsAccountSchema);
