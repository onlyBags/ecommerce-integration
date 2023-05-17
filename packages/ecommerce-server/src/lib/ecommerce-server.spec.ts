import supertest from 'supertest';
import server from './ecommerce-server';

describe('ecommerceServer', () => {
  const request = supertest.agent(server);

  afterAll((done) => {
    server.close(done);
  });

  it('should get /test', async () => {
    const res = await request.get('/test');
    expect(res.status).toBe(200);
  });

  it('shold get data from /test/2', async () => {
    const res = await request.get('/test/2');
    expect(res.body).toEqual({ data: 'It Works!' });
  });
});
