import nodePath from 'node:path';

import dotenv from 'dotenv';


interface ISettings {
  readonly NODE_ENV: 'development' | 'production' | 'test';
  readonly SERVER_PORT: number;
  readonly DATA_PATH: string;
  readonly JWT_SECRET: string;
  readonly ADMIN_USERNAME: string;
  readonly ADMIN_PASSWORD: string;
}


function loadSettings(): ISettings {
  const NODE_ENV = process.env.NODE_ENV || 'development';

  dotenv.config({
    path: nodePath.join(__dirname, '../.env'),
    override: true,
  });
  dotenv.config({
    path: nodePath.join(__dirname, `../.env.${NODE_ENV}`),
    override: true,
  });


  const SERVER_PORT = Number.parseInt(process.env.SERVER_PORT || '20001', 10);
  const DATA_PATH = process.env.DATA_PATH;

  const JWT_SECRET = requiredEnvVar('JWT_SECRET');
  const ADMIN_USERNAME = requiredEnvVar('ADMIN_USERNAME');
  const ADMIN_PASSWORD = requiredEnvVar('ADMIN_PASSWORD');

  return {
    NODE_ENV,
    SERVER_PORT,
    DATA_PATH,
    JWT_SECRET,
    ADMIN_USERNAME,
    ADMIN_PASSWORD,
  };
}

function requiredEnvVar(key: keyof ISettings) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`"${key}" is not defined, please set it in .env file`);
  }
  return value;
}

const settings = loadSettings();

export default settings;