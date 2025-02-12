// src/routes/api/get.js

/*const { createSuccessResponse, createErrorResponse } = require('../../response');

//importing Fragment class..
const Fragment = require('../../model/fragment');



const logger = require('../../logger');

// importing Utils Functions.
const {
  hasExtension,
  separateIdExtensionAndMediaType,
  isConversionPossible,
  convertFragment,
} = require('../../model/data/utils');

async function getFragmentById(req, res) {
  const fragmentId = req.params.id;

  try {
    if (hasExtension(fragmentId)) {
      await handleFragmentWithExtension(fragmentId, req, res);
    } else {
      await handleFragmentWithoutExtension(fragmentId, req, res);
    }
  } catch (error) {
    logger.error(error);
    handleErrorResponse(
      res,
      404,
      `Fragment with ID '${
        hasExtension(fragmentId) ? separateIdExtensionAndMediaType(fragmentId).id : fragmentId
      }' does not exist.`
    );
  }
}

async function handleFragmentWithExtension(fragmentId, req, res) {
  const { id, extension, mediaType } = separateIdExtensionAndMediaType(fragmentId);
  //let fragment = new Fragment(await Fragment.byId(req.user, id));
  const fragment = await Fragment.byId(req.user, id);

  try {
    if (isConversionPossible(fragment.type, extension)) {
      let data = await fragment.getData();
      const convertedData = await convertFragment(data, fragment.type, extension, mediaType);
      res.set('Content-Type', mediaType);
      res.status(200).send(convertedData);
    } else {
      let errorMessage = mediaType
        ? `The requested conversion from Media Type '${fragment.type}' to '${mediaType}' is not possible.`
        : `The requested conversion from Media Type '${fragment.type}' to extension '.${extension}' is not possible.`;
      handleErrorResponse(res, 415, errorMessage);
    }
  } catch (error) {
    // error can  occur during conversion thus need to handle it
    logger.error(error); // Log the error using Pino logger
    res.status(500).json(createErrorResponse(500, `An error occurred: ${error}`));
  }
}

async function handleFragmentWithoutExtension(fragmentId, req, res) {
  const fragment = await Fragment.byId(req.user, fragmentId);
  let data = await fragment.getData();
  res.set('Content-Type', fragment.type);
  res.status(200).send(data);
}

function handleErrorResponse(res, statusCode, errorMessage) {
  res.status(statusCode).json(createErrorResponse(statusCode, errorMessage));
}

async function getFragmentsByUser(req, res) {
  console.log('Fragment:', Fragment);
  console.log('Fragment.byUser:', typeof Fragment.byUser);
  const expand = req.query.expand === 'true'; // Convert query param to boolean
  console.log('Fragment:', Fragment);
  console.log('Fragment.byUser:', typeof Fragment.byUser);
  try {
    const fragments = await Fragment.byUser(req.user, expand);
    res.status(200).json(createSuccessResponse({ fragments }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(createErrorResponse(500, `An error occurred: ${error.message}`));
  }
}


module.exports = {
  getFragmentById,
  getFragmentsByUser
};
*/

// src/routes/api/get.js
/*

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
*/
/**
 * Get a list of fragments for the current user.
 */
/*
module.exports = async (req, res) => {
  try {
    logger.debug('Handling request with query params:', req.query);

    // Ensure expand is correctly parsed as a boolean
    const isExpanded = req.query.expand === 'true';

    // Fetch user fragments
    const fragments = await Fragment.byUser(req.user, isExpanded);

    logger.info(`Fetched ${fragments.length} fragments for user ${req.user}`);

    // Return fragments as JSON response
    return res.status(200).json(createSuccessResponse({ fragments }));
  } catch (error) {
    logger.error(`Failed to retrieve fragments: ${error.message}`);
    return res.status(500).json(createErrorResponse(500, `Error fetching fragments: ${error.message}`));
  }
};
*/

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');


module.exports = async (req, res) => {
  logger.info(`Received GET request from user ${req.user}`);
  // checking for expand query in domain
  const expandFlag = req.query['expand'] === '1';
  const { user: ownerId } = req;
  try {
    logger.debug('Attempting to fetch fragments for user:', ownerId);
    // Fetch all fragments for the current user
    const fragments = await Fragment.byUser(ownerId, expandFlag);
    // Log the number of fragments found
    logger.info(`Found ${fragments.length} fragments for user ${ownerId}`);
    // Send the fragments back in the response
    res.status(200).json(
      createSuccessResponse({ fragments: [...fragments] })
    );
    logger.info(`Successfully fetched fragments for user ${ownerId}`);
  } catch (error) {
    logger.error(`Error occurred while fetching fragments for user ${ownerId}: ${error.message}`);
    res.status(500).json(createErrorResponse(500, error.message));
  }
};