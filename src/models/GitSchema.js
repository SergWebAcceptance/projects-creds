const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GitAccountSchema = new Schema({
  login: { type: String, required: false },
  password: { type: String, required: false },
  projectCategory:{ type: Schema.Types.ObjectId, ref: "ProjectsCategory", required: false }
});

module.exports =
  mongoose.models.GitAccount || mongoose.model("GitAccount", GitAccountSchema);
