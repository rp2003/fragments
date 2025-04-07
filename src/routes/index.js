// src/routes/index.js

const express = require('express');

// version and author from package.json
const { version, author } = require('../../package.json');

// Import our response utility functions
const { createSuccessResponse } = require('../response');

// Our authentication middleware
const { authenticate } = require('../auth');

// Create a router that we can use to mount our API
const router = express.Router();

const { hostname } = require('os');

/* Expose all of our API routes on /v1/ to include an API version.
 * Protect them all with middleware so you have to be authenticated
 * in order to access things.
 */
router.use(`/v1`, authenticate(), require('./api'));

/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 */
router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  // Send a 200 'OK' response
  const response = createSuccessResponse({
    author,
    // Use your own GitHub URL for this!
    githubUrl: 'https://github.com/rp2003/fragments',
    version,
  });
  res.status(200).json(response);
});



router.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json(
    createSuccessResponse({
      author: 'Riya Puri',
      githubUrl: 'https://github.com/riyapuri123/fragments',
      version,
      hostname: hostname(), // This line adds the ECS host ID
    })
  );
});


module.exports = router;