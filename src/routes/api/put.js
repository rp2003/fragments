// src/routes/api/put.js

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  const { user: ownerId } = req;
  const { id } = req.params;

  try {
    logger.info(`Attempting to update fragment ${id}`);

    const fragment = await Fragment.byId(ownerId, id);
    if (!fragment) {
      logger.warn(`Fragment not found for ID: ${id}`);
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }

    // Update fragment data
    await fragment.setData(req.body);
    fragment.type = req.headers['content-type'];

    await fragment.save();

    logger.info(`Successfully updated fragment ${id}`);

    const responseFragment = {
      id: fragment.id,
      ownerId: fragment.ownerId,
      created: fragment.created,
      updated: fragment.updated,
      size: fragment.size,
      type: fragment.type,
    };

    return res.status(200).json(createSuccessResponse({ fragment: responseFragment }));
  } catch (error) {
    logger.error(`Error updating fragment ${id}: ${error.message}`, { error });
    return res.status(500).json(createErrorResponse(500, 'An error occurred while updating the fragment'));
  }
};
