const request = require('supertest');
const fetchMock = require('node-fetch');

jest.mock('node-fetch');

describe('analytics route', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    process.env.JAVA_BASE_URL = 'http://java:8080';
  });

  it('forwards query params and returns json', async () => {
    const mockResponse = {
      status: 200,
      headers: { get: () => 'application/json' },
      text: async () => JSON.stringify({ ok: true })
    };
    fetchMock.mockResolvedValue(mockResponse);
    const app = require('./index');
    await request(app)
      .get('/analytics?start=123&end=456')
      .expect(200, { ok: true });
    expect(fetchMock).toHaveBeenCalledWith('http://java:8080/api/analytics?start=123&end=456');
  });
});
