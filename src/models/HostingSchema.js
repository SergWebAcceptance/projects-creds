const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HostingSchema = new Schema({
  name: { type: String, required: true },
  login: { type: String, required: true },
  password: { type: String, required: true },
  projectCategory:{ type: Schema.Types.ObjectId, ref: "ProjectsCategory", required: true }
});

module.exports =
  mongoose.models.Hosting || mongoose.model("Hosting", HostingSchema);
