// src/routes/api/get.js

// Import the success response helper
const { createSuccessResponse } = require('../../response');


/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  // Placeholder implementation: return an empty array for now
  res.status(200).json(createSuccessResponse({ fragments: [] }));
};