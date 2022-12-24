import request from "supertest";

import {app} from "../../../../app";

describe('Get Statement Operation Controller', () => {
  it('should be able to get a statement from the authenticated user', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'John Doe',
      email: 'johndoe@localhost',
      password: '123123',
    }).expect(201);

    const authenticationResponse = await request(app).post('/api/v1/sessions').send({
      email: 'johndoe@localhost',
      password: '123123',
    }).expect(200);

    const depositResponse = await request(app).post('/api/v1/statements/deposit').send({
      amount: 500.00,
      description: 'First deposit'
    }).set({
      'Authorization': `Bearer ${authenticationResponse.body.token}`
    }).expect(201);

    await request(app).get(`/api/v1/statements/${depositResponse.body.id}`).set({
      'Authorization': `Bearer ${authenticationResponse.body.token}`
    }).expect(200);
  });
});
