import { RequestHandler } from 'express';
import type { UserType } from './libs';

export type AuthBody = {
  fullName?: string;
  email?: string;
  password: string;
  role: UserType;
  document: string;
};

type AuthId = {
  id: string;
};

type Creator = {
  creatorRole: UserType;
};

export type AuthController = {
  authLogin: RequestHandler<
    {},
    any,
    Pick<AuthBody, 'email' | 'password' | 'document' | 'role'>,
    Creator
  >;

  authRegister: RequestHandler<{}, any, AuthBody, Creator>;

  authUpdate: RequestHandler<AuthId, any, Partial<AuthBody>>;

  authDelete: RequestHandler<AuthId>;

  authLogout: RequestHandler<AuthId>;
};
