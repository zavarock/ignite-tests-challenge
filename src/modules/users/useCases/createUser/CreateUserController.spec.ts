import request from 'supertest';

import {app} from "../../../../app";

describe('Create User Controller', () => {
  it('should be able to create a user', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'John Doe',
      email: 'johndoe@localhost',
      password: '123123',
    }).expect(201);
  });

  it('should not be able to create an existent user', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'John Doe',
      email: 'johndoe@localhost',
      password: '123123',
    }).expect(400);
  });
});
