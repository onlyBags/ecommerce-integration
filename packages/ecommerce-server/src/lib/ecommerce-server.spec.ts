import supertest from 'supertest';
import server from './ecommerce-server';

describe('ecommerceServer', () => {
  const request = supertest.agent(server);

  beforeEach(() => {
    jest.setTimeout(10000);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should get /', async () => {
    const res = await request.get('/');
    expect(res.status).toBe(200);
  });

  it('shold get data', async () => {
    const res = await request.get('/');
    expect(res.body).toEqual({ data: 'It Works!' });
  });
});
