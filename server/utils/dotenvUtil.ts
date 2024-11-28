import nodePath from 'node:path';

import dotenv from 'dotenv';

export function loadEnv() {
  const dotenvPath = nodePath.join(__dirname, '../.env');

  dotenv.config({
    path: dotenvPath,
  });
}