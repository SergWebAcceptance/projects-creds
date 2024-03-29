const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectsCategorySchema = new Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.models.ProjectsCategory || mongoose.model('ProjectsCategory', ProjectsCategorySchema);
