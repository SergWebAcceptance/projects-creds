const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CredentialsSchema = new Schema({
  login: { type: String, required: false },
  password: { type: String, required: false },
});
const dnsSchema = new Schema({
  name: { type: String, required: true },
  login: { type: String, required: false },
  password: { type: String, required: false },
});
const ftpSshSchema = new Schema({
  protocol: { type: String, required: false },
  host: { type: String, required: true },
  login: { type: String, required: false },
  password: { type: String, required: false },
  port: { type: Number, required: false },
});

const ProjectSchema = new Schema({
  domain: { type: String, required: true },
  domainRegistrar: {
    type: Schema.Types.ObjectId,
    ref: "DomainRegistrar",
    required: true,
  },
  hosting: { type: Schema.Types.ObjectId, ref: "Hosting", required: true },
  dns: { type: dnsSchema, required: false },
  ftpSsh: { type: ftpSshSchema, required: false },
  github: { type: CredentialsSchema, required: false },
  wpAdmin: { type: CredentialsSchema, required: false },
  testAccess: { type: CredentialsSchema, required: false },
  registerDate:{ type: String, required: false },
  expiredDate:{ type: String, required: false },
  projectsCategory:{ type: Schema.Types.ObjectId, ref: "ProjectsCategory", required: true }
});

module.exports =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);
