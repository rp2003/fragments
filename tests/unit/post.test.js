

const { createSuccessResponse, createErrorResponse } = require('../../src/response');
const { Fragment } = require('../../src/model/fragment');
const logger = require('../../src/logger');

module.exports = async (req, res) => {
  try {
    logger.debug('Post: ' + req.body);
    logger.info(`Received POST request from user ${req.user ? req.user.id : 'unknown'}`);

    // Extract ownerId and fragData from request
    const ownerId = req.user ? req.user.id : null;  // Assuming req.user contains user info
    const fragData = req.body;  // Assuming the fragment data is in the body (Buffer)

    if (!ownerId) {
      logger.error('Owner ID is missing');
      return res.status(400).json(createErrorResponse(400, 'Owner ID is missing'));
    }

    if (!fragData) {
      logger.error('Fragment data is missing');
      return res.status(400).json(createErrorResponse(400, 'Fragment data is missing'));
    }

    logger.debug('Attempting to create a new fragment');

    const fragment = new Fragment({ ownerId, type: req.get('Content-Type') });
    await fragment.save();
    await fragment.setData(fragData);

    res.set('Content-Type', fragment.type);

    const locationURL = `${req.protocol}://${req.headers.host}/v1/fragments/${fragment.id}`;
    res.set('Location', locationURL);
    logger.debug(`Location header set: ${locationURL}`);

    res.status(201).location(locationURL).json(
      createSuccessResponse({
        fragment: {
          id: fragment.id,
          ownerId: fragment.ownerId,
          created: fragment.created,
          updated: fragment.updated,
          type: fragment.type,
          size: fragment.size,
        }
      })
    );
    
    logger.info(`Fragment created successfully for user ${ownerId}, ID: ${fragment.id}`);
  } catch (error) {
    logger.error(`Error occurred while creating fragment for user ${req.user ? req.user.id : 'unknown'}: ${error.message}`);
    res.status(500).json(createErrorResponse(500, error.message));
  }
};

describe('My Test Suite', () => {
  // This is the correct way to define a test
  test('should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });
});

