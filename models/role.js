const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roleSchema = new Schema({
  projectId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("Role", roleSchema);
