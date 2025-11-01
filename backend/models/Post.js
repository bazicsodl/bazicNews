const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema({
  title: String,
  excerpt: String,
  content: String,
  author: String,
  urlToImage: String,
  thumbnail: String,
  category: String,
  tags: [String],
  source: String,
  url: String, // 
  slug: { type: String, unique: true }, // ← Add this
  publishedAt: { type: Date, default: Date.now },
});

// Generate slug before saving
postSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
