// tests/unit/health.test.js

const request = require('supertest');

// Get our Express app object (we don't need the server part)
const app = require('../../src/app');

// Get the version and author from our package.json
//const { version, author } = require('../../package.json');

describe('404 Middleware', () => {
    test('returns 404 status and error message for unknown routes', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 'error',
        error: {
          message: 'not found',
          code: 404,
        },
      });
    });
  });

