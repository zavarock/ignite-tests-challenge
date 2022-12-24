import * as dotenv from 'dotenv';
import 'reflect-metadata';
import {createConnection, getConnection} from "typeorm";

dotenv.config();

beforeAll(async () => {
  const connection = await createConnection();

  await connection.runMigrations();
});

afterAll(async () => {
  const connection = await getConnection();

  await connection.dropDatabase();
  await connection.close();
});
