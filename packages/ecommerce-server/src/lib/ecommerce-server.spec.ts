import supertest from 'supertest';
import server from './ecommerce-server';

// jest.mock(
//   '../../public/swagger.json',
//   () => ({
//     /* Mocked JSON content */
//   }),
//   { virtual: true }
// );

describe('ecommerceServer', () => {
  const request = supertest.agent(server);

  afterAll((done) => {
    server.close(done);
  });

  it('check server', async () => {
    const res = await request.get('/');
    expect(res.body).toEqual({ data: 'Hello World' });
  });

  it('get user data', async () => {
    const res = await request.get('/v1/dashboard/user-keys?id=5');
    console.log(res.body);

    expect(res.body).toEqual({
      id: 5,
      username: 'maiki',
      platform: 'Magento',
      baseUrl: '',
      apiKey: 'myapi',
      consumerKey: '',
      consumerSecret: '',
      isActive: false,
    });
  });
});
