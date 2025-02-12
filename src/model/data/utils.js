const contentType = require('content-type');

/**
 * Checks if a conversion is possible from the original type to the requested type.
 * @param {string} originalType - The original type of the fragment.
 * @param {string} requestedType - The requested type for the conversion.
 * @returns {boolean} Returns true if the conversion is possible, false otherwise.
 */
module.exports.isConversionPossible = (originalType, requestedType) => {
  // Dictionary mapping original types to valid conversion extensions
  const conversions = {
    'text/plain': ['txt'],
  };

  // Check if the original type and requested type are defined and not null
  if (originalType && requestedType) {
    // Check if the original type exists and if the requested type is valid for the original type
    if (
      Object.prototype.hasOwnProperty.call(conversions, originalType.toLowerCase()) &&
      conversions[originalType.toLowerCase()].includes(requestedType.toLowerCase())
    ) {
      return true; // Conversion is possible
    }
  }

  return false; // Conversion is not possible
};

/**
 * Separates an identifier string with an extension into its constituent parts,
 * namely the ID, extension, and media type.
 *
 * @param {string} idWithExtension - The identifier string with an extension that needs to be separated into ID, extension, and media type.
 * @returns {Object} An object with the ID, extension, and media type as properties.
 */
module.exports.separateIdExtensionAndMediaType = (idWithExtension) => {
  // Check if the input is null or undefined
  if (idWithExtension === null || idWithExtension === undefined) {
    return {
      id: String(idWithExtension),
      extension: '',
      mediaType: '',
    };
  }

  // Map extensions to media types
  var mediaTypeMap = {
    txt: 'text/plain',
  };

  // Find the last occurrence of a dot (.)
  var lastDotIndex = idWithExtension.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    // Extract the ID and extension using substring
    var id = idWithExtension.substring(0, lastDotIndex);
    var extension = idWithExtension.substring(lastDotIndex + 1);

    // Determine the media type based on the extension
    var mediaType = mediaTypeMap[extension] || '';

    return {
      id: id,
      extension: extension,
      mediaType: mediaType,
    };
  } else {
    // If there is no dot, consider the entire input as the ID
    return {
      id: idWithExtension,
      extension: '',
      mediaType: '',
    };
  }
};

/**
 * Checks if an identifier string has an extension.
 *
 * @param {string} id - The identifier string to check for an extension.
 * @returns {boolean} A boolean value indicating whether the identifier has an extension.
 * @example
 * var id = "4dcc65b6-9d57-453a-bd3a-63c107a51698.html";
 * var hasExtension = hasExtension(id);
 * console.log("Has extension:", hasExtension);
 * // Output:
 * // Has extension: true
 */
module.exports.hasExtension = (id) => {
  if (id === null || id === undefined) {
    return false;
  }

  var lastDotIndex = id.lastIndexOf('.');
  return lastDotIndex !== -1 && lastDotIndex < id.length - 1;
};



/**
 * Validates the content type of a request body.
 * @param {Buffer} reqBody - The request body as a Buffer.
 * @param {string} contentTypeHeader - The Content-Type header of the request.
 * @throws {Error} If the content type is not supported or if the input is invalid.
 * @returns {Promise<void>} Resolves if the content type is valid.
 */
module.exports.validateContentType = async (reqBody, contentTypeHeader) => {
  if (typeof contentTypeHeader !== 'string') {
    throw new Error('Invalid content type header. Expected a string.');
  }

  const { type } = contentType.parse(contentTypeHeader.toLowerCase());

  if (!Buffer.isBuffer(reqBody)) {
    throw new Error(`Unsupported content type ${type}`);
  }

  if(['text/plain'].includes(type)) {
    // No additional validation required for these content types.
    return;
  } else {
    throw new Error('Unsupported content type.');
  }
};
