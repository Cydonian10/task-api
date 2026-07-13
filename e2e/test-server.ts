import "reflect-metadata";
import { AppRoutes } from "@/src/routes.js";
import { ServerApp } from "@/src/server.js";
import { AppDataSource } from "@/src/database/data-source.js";
import pg from "pg";
import { envs } from "@/src/config/envs.js";

export const testServer = new ServerApp({
  port: 3000,
  publicPath: "public",
});

testServer.setRoutes(AppRoutes.routes());

export async function initTestDb() {
  const client = new pg.Client({
    host: envs.POSTGRES_HOST,
    port: envs.POSTGRES_PORT,
    user: envs.POSTGRES_USER,
    password: envs.POSTGRES_PASSWORD,
    database: envs.POSTGRES_DB_NAME,
  });

  await client.connect();
  await client.query(`
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
    GRANT ALL ON SCHEMA public TO ${envs.POSTGRES_USER};
  `);
  await client.end();

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
}

export async function closeTestDb() {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
}
