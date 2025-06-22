const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
  isFake: { type: Boolean, default: null },
  checkedAt: { type: Date }
});

module.exports = mongoose.model('Post', postSchema);
