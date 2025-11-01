const mongoose = require('mongoose');
const Post = require('./models/Post');
const slugify = require('slugify');

const NEWSAPI_KEY = process.env.NEWSAPI_KEY || 'your_api_key';

async function fetchNews() {
  // NewsAPI's officially supported categories
  const supportedCategories = [
    'business',      // This covers finance too
    'sports',
    'technology',    // Can include education-related tech
    'entertainment', // Covers fashion
    'health',
    'science',
    'general'        // Covers politics and international affairs
  ];

  // Special cases that need keyword searches
  const specialCategories = {
    'crime': ['crime', 'police', 'arrest'],
    'education': ['education', 'school', 'university'],
    'fashion': ['fashion', 'clothing', 'designer']
  };

  let allArticles = [];

  // 1. Fetch from standard categories
  for (const category of supportedCategories) {
    const url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=5&apiKey=${NEWSAPI_KEY}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.articles?.length) {
        const articlesWithCategory = data.articles.map(article => ({
          ...article,
          category: mapToCustomCategory(category)
        }));
        allArticles.push(...articlesWithCategory);
      }
    } catch (err) {
      console.error(`Error fetching ${category} news:`, err);
    }
  }

  // 2. Fetch special categories using keyword search
  for (const [category, keywords] of Object.entries(specialCategories)) {
    const query = keywords.join(' OR ');
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&pageSize=5&apiKey=${NEWSAPI_KEY}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.articles?.length) {
        const articlesWithCategory = data.articles.map(article => ({
          ...article,
          category: mapToCustomCategory(category)
        }));
        allArticles.push(...articlesWithCategory);
      }
    } catch (err) {
      console.error(`Error fetching ${category} news:`, err);
    }
  }

  return allArticles;
}

// Map NewsAPI categories to your preferred category names
function mapToCustomCategory(apiCategory) {
  const categoryMap = {
    'business': 'Business & Finance',
    'general': 'Politics & World',
    'technology': 'Technology & Education',
    'entertainment': 'Entertainment',
    // Add other mappings as needed
  };
  
  return categoryMap[apiCategory] || apiCategory.charAt(0).toUpperCase() + apiCategory.slice(1);
}

async function seedNews() {
  console.log('Running news seeder...');

  try {
    const articles = await fetchNews();
    console.log(`Fetched ${articles.length} articles from ${new Set(articles.map(a => a.category)).size} categories`);

    for (const article of articles) {
      const existing = await Post.findOne({ title: article.title });
      if (existing) {
        console.log(`Skipped duplicate: ${article.title}`);
        continue;
      }

      const newPost = new Post({
        title: article.title,
        excerpt: article.description || '',
        content: article.content || article.description || '',
        author: article.author || 'Unknown',
        thumbnail: article.urlToImage || null, // Use null instead of empty string
        category: article.category || 'General',
        tags: [
          article.category.toLowerCase().split(' ')[0], // Primary tag
          'news',
          ...(article.category.toLowerCase().includes('finance') ? ['finance'] : []),
          ...(article.category.toLowerCase().includes('tech') ? ['tech'] : [])
        ],
        url: article.url || '',
        publishedAt: new Date(article.publishedAt) || new Date(),
        slug: generateSlug(article.title)
      });

      await newPost.save();
      console.log(`Saved ${article.category} post: ${article.title}`);
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
}

// Helper function to generate slugs
function generateSlug(title) {
  return slugify(title, {
    replacement: '-',
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    strict: true
  });
}

module.exports = { seedNews };