const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: String,

  description: String,
  status: {
    type: String,
    default: "draft",
  },
  createdBy: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("project", ProjectSchema);
