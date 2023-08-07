const request = require('supertest');
const app = require('../server');

describe('Test server.js routes', () => {
  it('should return status 200 and appBaseUrl in JSON for GET /api/config', async () => {
    const response = await request(app).get('/api/config');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('appBaseUrl');
  });

  it('should return status 200 for GET / (homepage)', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('should return status 404 for non-existing route', async () => {
    const response = await request(app).get('/non-existing-route');
    expect(response.status).toBe(404);
  });
});
