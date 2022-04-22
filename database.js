import { createConnection } from 'typeorm';
export const testDatabase = () => {
  try {
    (async () => {
      const connection = await createConnection({
        type: 'mssql',
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT) ?? 1433,
        username: process.env.DATABASE_LOGIN_NAME,
        password: process.env.DATABASE_LOGIN_PASSWORD,
        extra: {
          trustServerCertificate: true,
        },
      });
      const queryRunner = connection.createQueryRunner();

      await queryRunner.query(`
      USE master
  
      IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'${process.env.DATABASE_DB_NAME}')
      BEGIN
        CREATE DATABASE ${process.env.DATABASE_DB_NAME}
      END
    `);

      const result = await queryRunner.query(`
      USE master
      SELECT name FROM sys.databases WHERE name = N'${process.env.DATABASE_DB_NAME}'`);

      console.log(result);
    })();
  } catch (error) {
    console.log('=======');
    console.log('Database Connection Failed');
    console.log(error);
  }
};
