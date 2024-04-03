import dotenv from 'dotenv';
dotenv.config();

export const config = {
  jwt: {
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET
  },
  nodeMailerAuth: {
    user: process.env.NODEMAILER_AUTH_USER,
    pass: process.env.NODEMAILER_AUTH_PASS
  },
  clientRootURL: process.env.Client_Root_URL,
  database: {
    type: process.env.DB_TYPE,
    name: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  }
};
