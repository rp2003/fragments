
/*
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

*/
const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  describe('Authentication', () => {
    test('unauthenticated requests are denied', () => {
      return request(app)
        .post('/v1/fragments')
        .expect(401);
    });

    test('incorrect credentials are denied', () => {
      return request(app)
        .post('/v1/fragments')
        .auth('invalid@email.com', 'incorrect_password')
        .expect(401);
    });

    test('missing credentials are denied', () => {
      return request(app)
        .post('/v1/fragments')
        .auth('', '')
        .expect(401);
    });
  });

  // Content Type Tests updated to match supported types
  describe('Content Type Validation', () => {
    test('missing Content-Type header returns 415', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .send('test data');

      expect(res.status).toBe(415);
    });

    // Test all supported content types
    test.each([
      ['text/plain', 'Hello World'],
      ['text/markdown', '# Header'],
      ['text/html', '<p>Hello</p>'],
      ['application/json', { key: 'value' }],
    ])('supports %s content type', async (contentType, data) => {
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', contentType)
        .send(contentType === 'application/json' ? data :
          Buffer.isBuffer(data) ? data :
            JSON.stringify(data));

      expect(res.status).toBe(201);
      expect(res.body.fragment.type).toBe(contentType);
    });

    // Test unsupported content types
    test.each([
      'audio/mpeg',
      'video/mp4',
      'application/pdf',
      'invalid/type'
    ])('returns 415 for unsupported content type: %s', async (contentType) => {
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', contentType)
        .send('test data');

      expect(res.status).toBe(415);
      expect(res.body.error.code).toBe(415);
      expect(res.body.error.message).toBe('The content format for fragment (supplied by client) is not supported!!');
    });
  });

  // Extended Data Handling Tests
  describe('Data Handling', () => {
    test('handles empty content correctly', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('');

      expect(res.status).toBe(201);
      expect(res.body.fragment.size).toBe(0);
    });

    test('handles large content correctly', async () => {
      const largeContent = 'x'.repeat(1024 * 1024); // 1MB of data
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(largeContent);

      expect(res.status).toBe(201);
      expect(res.body.fragment.size).toBe(largeContent.length);
    });

    test('size property matches actual content length', async () => {
      const content = 'Hello, World!';
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(content);

      expect(res.status).toBe(201);
      expect(res.body.fragment.size).toBe(content.length);
    });
  });

  // Response Structure Tests
  describe('Response Structure', () => {
    test('successful response includes all required properties', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('test content');

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('ok');
      expect(res.body.fragment).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          ownerId: expect.any(String),
          created: expect.any(String),
          updated: expect.any(String),
          type: expect.any(String),
          size: expect.any(Number),
        })
      );
    });

    test('response includes correct Content-Type header', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('test content');

      expect(res.headers['content-type']).toMatch(/application\/json/);
    });

    test('response includes Location header with correct URL', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('test content');

      expect(res.headers.location).toBeDefined();
      expect(res.headers.location).toMatch(/^http:\/\/.*\/v1\/fragments\/[a-zA-Z0-9-_]+$/);
    });
  });

  // Data Handling Tests
  describe('Data Handling', () => {
    test('handles empty content correctly', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('');

      expect(res.status).toBe(201);
      expect(res.body.fragment.size).toBe(0);
    });

    test('handles large content correctly', async () => {
      const largeContent = 'x'.repeat(1024 * 1024); // 1MB of data
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(largeContent);

      expect(res.status).toBe(201);
      expect(res.body.fragment.size).toBe(largeContent.length);
    });

    test('size property matches actual content length', async () => {
      const content = 'Hello, World!';
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(content);

      expect(res.status).toBe(201);
      expect(res.body.fragment.size).toBe(content.length);
    });
  });

  // Error Handling Tests
  describe('Error Handling', () => {
    test('handles server errors gracefully', async () => {
      // Mock Fragment.save to throw an error
      jest.spyOn(console, 'error').mockImplementation(() => { }); // Suppress error logging
      const originalSave = require('../../src/model/fragment').Fragment.prototype.save;
      require('../../src/model/fragment').Fragment.prototype.save = async () => {
        throw new Error('Database error');
      };

      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('test content');

      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
      expect(res.body.error).toBeDefined();

      // Restore original save function
      require('../../src/model/fragment').Fragment.prototype.save = originalSave;
    });
  });

});
