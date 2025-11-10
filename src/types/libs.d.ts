import type { Request, Response, NextFunction } from 'express';
import type { AuthBody } from './controllers';
import type { UserType } from '@prisma/client';

//? Types of createToken
export type CreateToken = (
  payload: { id: string },
  role: UserType,
  nameCookie: string,
  res: Response
) => void;

type BodyToken = {
  data: string;
  role: UserType;
}


