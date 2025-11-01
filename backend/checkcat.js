// Run this in your server.js or a temporary script
const Post = require('./models/Post');

async function checkCategories() {
  const categories = await Post.distinct('category');
  console.log('Existing categories in DB:', categories);
  
  const counts = await Post.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);
  console.log('Article counts per category:', counts);
}

checkCategories();