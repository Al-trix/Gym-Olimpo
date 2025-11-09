import 'express';
import jwt from 'jsonwebtoken';
import { BodyToken } from '../libs';

declare global {
  namespace Express {
    interface Request {
      cookies: {
        token__user?: BodyToken;
        [key: string]: any;
      };
      user?: string | jwt.JwtPayload;
    }
  }
}
