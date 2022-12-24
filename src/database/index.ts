import {createConnection, getConnectionOptions} from 'typeorm';

(async () => {
  const defaultOptions = await getConnectionOptions();

  return await createConnection(Object.assign({
    ...defaultOptions,
    host: process.env.NODE_ENV !== 'test' ? 'database' : 'localhost',
    database: process.env.NODE_ENV !== 'test' ? defaultOptions.database : 'fin_api_test'
  }));
})();
