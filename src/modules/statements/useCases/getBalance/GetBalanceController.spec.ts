import request from "supertest";

import {app} from "../../../../app";

describe('Get Balance Controller', () => {
  it('should be able to get the balance from the authenticated user', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'John Doe',
      email: 'johndoe@localhost',
      password: '123123',
    }).expect(201);

    const authenticationResponse = await request(app).post('/api/v1/sessions').send({
      email: 'johndoe@localhost',
      password: '123123',
    }).expect(200);

    const balanceResponse = await request(app).get('/api/v1/statements/balance').set({
      'Authorization': `Bearer ${authenticationResponse.body.token}`
    });

    expect(balanceResponse.body).toHaveProperty('balance');
  });
});
