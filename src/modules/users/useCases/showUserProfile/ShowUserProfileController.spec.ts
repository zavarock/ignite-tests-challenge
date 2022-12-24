import request from 'supertest';

import {app} from "../../../../app";

describe('Show User Profile Controller', () => {
  it('should be able to show a valid user profile', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'John Doe',
      email: 'johndoe@localhost',
      password: '123123',
    }).expect(201);

    const authenticateResponse = await request(app).post('/api/v1/sessions').send({
      email: 'johndoe@localhost',
      password: '123123',
    }).expect(200);

    const userProfileResponse = await request(app).get('/api/v1/profile/').set({
      'Authorization': `Bearer ${authenticateResponse.body.token}`
    });

    expect(userProfileResponse.body).toHaveProperty('id');
  });
});
