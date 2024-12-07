declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    SERVER_PORT: string;
    DATA_PATH: string;
    JWT_SECRET: string;
    ADMIN_USERNAME : string;
    ADMIN_PASSWORD : string;
    [key: string]: string | undefined; // 允许额外的环境变量
  }
}
