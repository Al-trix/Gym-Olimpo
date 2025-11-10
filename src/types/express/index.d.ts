import 'express';
import jwt from 'jsonwebtoken';
import { BodyToken } from '../libs';
import { UserType } from '@prisma/client';

interface AuthBody {
  data: {
    id: string;
  };
  role: UserType;
}
declare global {
  namespace Express {
    interface Request {
      cookies: {
        token__user?: BodyToken;
        [key: string]: any;
      };
      user?:  AuthBody;
    }
  }
}
