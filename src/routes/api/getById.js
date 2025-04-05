const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    const { user: ownerId } = req;
    const { id } = req.params;

    logger.info(`Fetching fragment by ID: ${id}`);

    const fragment = await Fragment.byId(ownerId, id);
    logger.debug(`Fragment result: ${JSON.stringify(fragment)}`);

    if (!fragment) {
      logger.warn(`Fragment not found for ID: ${id}`);
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }

    try {
      const data = await fragment.getData();
      logger.debug(`Fragment data received, length: ${data.length}`);

      res.setHeader('Content-Type', fragment.type || 'application/octet-stream');
      res.setHeader('Content-Length', fragment.size || Buffer.byteLength(data));

      logger.info(`Successfully sending data for fragment ${id}`);
      return res.status(200).send(data);
    } catch (dataError) {
      logger.error(`getData() failed for ID ${id}: ${dataError.message}`, { error: dataError.stack });
      return res.status(404).json(createErrorResponse(404, 'An error occurred while retrieving fragment data'));
    }
  } catch (error) {
    logger.error(`Unexpected error: ${error.message}`, { error: error.stack });
    return res.status(500).json(createErrorResponse(500, 'An error occurred while fetching the fragment'));
  }
};

