declare namespace NodeJS {
  export interface ProcessEnv {
    APP_SECRET: string;
    APP_API_URL: string;
    APP_WEB_URL: string;

    MAIL_DRIVER: string;

    STORAGE_DRIVER: string;
    STORAGE_URL: string;
    STORAGE_AWS_BUCKET: string;

    AMAZON_REGION: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;

    REDIS_URL: string;
    REDIS_PORT: string;
    REDIS_PASSWORD: string;
    REDIS_USER: string;
  }
}
