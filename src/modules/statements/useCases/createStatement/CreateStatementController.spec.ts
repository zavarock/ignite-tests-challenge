import request from "supertest";

import {app} from "../../../../app";

let authenticationResponse: request.Response;

describe('Create Statement Controller', () => {
  beforeAll(async () => {
    await request(app).post('/api/v1/users').send({
      name: 'John Doe',
      email: 'johndoe@localhost',
      password: '123123',
    }).expect(201);

    authenticationResponse = await request(app).post('/api/v1/sessions').send({
      email: 'johndoe@localhost',
      password: '123123',
    }).expect(200);
  });

  it('should be able to make a deposit', async () => {
    await request(app).post('/api/v1/statements/deposit').send({
      amount: 500.00,
      description: 'First deposit'
    }).set({
      'Authorization': `Bearer ${authenticationResponse.body.token}`
    }).expect(201);
  });

  it('should be able to make a withdraw', async () => {
    await request(app).post('/api/v1/statements/withdraw').send({
      amount: 300.00,
      description: 'First withdraw'
    }).set({
      'Authorization': `Bearer ${authenticationResponse.body.token}`
    }).expect(201);
  });
});
