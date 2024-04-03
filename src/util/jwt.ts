import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface CustomJwtPayload extends JwtPayload {
  id: number;
  email: string;
  role: number;
}
export interface JwtRequest extends Request {
  tokenPayload: CustomJwtPayload;
  token: string;
}
