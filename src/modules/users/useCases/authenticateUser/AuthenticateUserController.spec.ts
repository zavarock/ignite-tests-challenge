import request from 'supertest';

import {app} from "../../../../app";

describe('Authenticate User Controller', () => {
  it('should be able to authenticate an user', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'John Doe',
      email: 'johndoe@localhost',
      password: '123123',
    }).expect(201);

    const authenticateResponse = await request(app).post('/api/v1/sessions').send({
      email: 'johndoe@localhost',
      password: '123123',
    });

    expect(authenticateResponse.body).toHaveProperty('token');
  });
});
