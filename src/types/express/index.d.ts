import 'express';
import jwt from 'jsonwebtoken';
import { BodyToken } from '../libs';
import { UserType } from '@prisma/client';


declare global {
  namespace Express {
    interface Request {
      cookies: {
        token__user?: BodyToken;
        [key: string]: any;
      };
      user?: BodyToken;
    }
  }
}
