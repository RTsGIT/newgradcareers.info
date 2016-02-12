var mongoose = require('mongoose');

var CompanyPostSchema = new mongoose.Schema({
  user: String,
  post: String,
  company: String,
  upvotes: 0,
  updated_at: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('CompanyPost', CompanyPostSchema);
