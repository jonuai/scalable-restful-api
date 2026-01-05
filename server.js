// server.js
const express = require('express');
const app = express();

// Configuration from environment variables
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(express.json());

// In-memory storage for posts (no database dependency)
let posts = [];
let postIdCounter = 1;

// GET /health - Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// POST /posts - Create a new post
app.post('/posts', (req, res) => {
  const { title, content, author } = req.body;

  // Validation
  if (!title || !content) {
    return res.status(400).json({
      error: 'Title and content are required'
    });
  }

  const newPost = {
    id: postIdCounter++,
    title,
    content,
    author: author || 'Anonymous',
    createdAt: new Date().toISOString()
  };

  posts.push(newPost);

  res.status(201).json({
    message: 'Post created successfully',
    post: newPost
  });
});

// GET /posts - Retrieve all posts
app.get('/posts', (req, res) => {
  res.status(200).json({
    total: posts.length,
    posts: posts
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, "0.0.0.0",() => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
