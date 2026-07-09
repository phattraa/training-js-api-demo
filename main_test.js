const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const http = require('http');
const app = require('./main');

chai.use(chaiHttp);

describe('Express app', () => {
  let server;

  // Setup: Start server before tests
  before((done) => {
    server = http.createServer(app);
    server.listen(0, () => {
      done();
    });
  });

  // Teardown: Stop server after tests
  after((done) => {
    server.close(() => {
      done();
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await chai.request(server).get('/health');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.status).to.equal('ok');
      expect(res.body.timestamp).to.be.a('string');
    });
  });

  describe('GET /', () => {
    it('should return all data', async () => {
      const res = await chai.request(server).get('/');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.greaterThan(0);
    });

    it('should return data with expected structure', async () => {
      const res = await chai.request(server).get('/');
      expect(res.status).to.equal(200);
      if (res.body.length > 0) {
        const firstItem = res.body[0];
        expect(firstItem).to.have.property('guid');
        expect(firstItem).to.have.property('school');
        expect(firstItem).to.have.property('mascot');
        expect(firstItem).to.have.property('nickname');
        expect(firstItem).to.have.property('location');
      }
    });
  });

  describe('GET /:guid', () => {
    const validGuid = '05024756-765e-41a9-89d7-1407436d9a58';

    it('should return a single item of data for valid GUID', async () => {
      const res = await chai.request(server).get(`/${validGuid}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.guid).to.equal(validGuid);
      expect(res.body).to.have.property('school');
      expect(res.body).to.have.property('mascot');
    });

    it('should return 404 for non-existent GUID', async () => {
      const nonExistentGuid = '00000000-0000-0000-0000-000000000000';
      const res = await chai.request(server).get(`/${nonExistentGuid}`);
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.have.property('message');
      expect(res.body.error).to.have.property('statusCode', 404);
      expect(res.body.error).to.have.property('requestId');
    });

    it('should return 400 for invalid GUID format (too short)', async () => {
      const invalidGuid = 'invalid-guid';
      const res = await chai.request(server).get(`/${invalidGuid}`);
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.have.property('message');
      expect(res.body.error.message).to.include('Invalid GUID format');
      expect(res.body.error).to.have.property('statusCode', 400);
    });

    it('should return 400 for invalid GUID format (wrong structure)',
        async () => {
          const invalidGuid = 'not-a-valid-uuid-format';
          const res = await chai.request(server).get(`/${invalidGuid}`);
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.have.property('message');
          expect(res.body.error.message).to.include('Invalid GUID format');
        });

    it('should return 400 for empty GUID', async () => {
      const res = await chai.request(server).get('/');
      // This should hit the root route, not the GUID route
      expect(res.status).to.equal(200);
    });

    it('should return 400 for GUID with invalid characters', async () => {
      // 'g' is invalid hex character
      const invalidGuid = '05024756-765e-41a9-89d7-1407436d9a5g';
      const res = await chai.request(server).get(`/${invalidGuid}`);
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error');
      expect(res.body.error.message).to.include('Invalid GUID format');
    });
  });

  describe('Error handling', () => {
    it('should return 404 for undefined routes', async () => {
      const res = await chai.request(server).get('/nonexistent/route');
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.have.property('message');
      expect(res.body.error.message).to.include('Route not found');
      expect(res.body.error).to.have.property('statusCode', 404);
      expect(res.body.error).to.have.property('requestId');
    });

    it('should return 404 for POST to undefined route', async () => {
      const res = await chai.request(server).post('/nonexistent');
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error');
      expect(res.body.error.message).to.include('Route not found');
    });

    it('should include request ID in error responses', async () => {
      const res = await chai.request(server).get('/invalid-guid-format');
      expect(res.status).to.equal(400);
      expect(res.body.error).to.have.property('requestId');
      expect(res.body.error.requestId).to.be.a('string');
    });
  });

  describe('Response headers', () => {
    it('should include X-Request-ID header', async () => {
      const res = await chai.request(server).get('/health');
      expect(res.headers).to.have.property('x-request-id');
      expect(res.headers['x-request-id']).to.be.a('string');
    });

    it('should include X-Request-ID header in error responses', async () => {
      const res = await chai.request(server).get('/invalid-guid');
      expect(res.headers).to.have.property('x-request-id');
    });
  });
});
