const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FtpAccountSchema = new Schema({
  protocol: {
    type: String,
    required: true,
    enum: ['ftp', 'sftp'],
  },
  host: { type: String, required: false },
  login: { type: String, required: false },
  password: { type: String, required: false },
  port: { type: Number, required: false },
  projectCategory:{ type: Schema.Types.ObjectId, ref: "ProjectsCategory", required: true }
});

module.exports =
  mongoose.models.FtpAccount || mongoose.model("FtpAccount", FtpAccountSchema);
