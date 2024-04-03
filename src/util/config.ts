import dotenv from 'dotenv';
dotenv.config();

export const config = {
    jwt : {
        access_token_secret: process.env.ACCESS_TOKEN_SECRET,
        refresh_token_secret: process.env.REFRESH_TOKEN_SECRET
    }
}