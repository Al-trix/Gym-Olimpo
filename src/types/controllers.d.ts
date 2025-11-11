import { RequestHandler } from 'express';
import type { UserType, SubscriptionType } from '@prisma/client';

export type AuthBody = {
  fullName?: string;
  email?: string;
  password: string;
  role: UserType;
  document: string;
};

export type SubscriptionBody = {
  type: SubscriptionType;
  document: string;
  fullName?: string;
  active: boolean;
};

type Params = {
  id: string;
};

type Creator = {
  creator: UserType;
};

export type AuthController = {
  authLogin: RequestHandler<
    {},
    unknown,
    Pick<AuthBody, 'email' | 'password' | 'document' | 'role'>,
    Creator
  >;

  authRegister: RequestHandler<{}, unknown, AuthBody, Creator>;

  authUpdate: RequestHandler<Params, unknown, Partial<AuthBody>>;

  authDelete: RequestHandler<Params>;

  authLogout: RequestHandler<Params>;

  authValidteCookie: RequestHandler;
};

type filtersQuery = {
  type?: SubscriptionType;
  active?: boolean;
  document?: string;
  fullName?: string;
  creator?: UserType;
  page?: number;
  limit?: number;
}

export type SubscriptionController = {
  viewSubscriptions: RequestHandler<unknown, unknown, filtersQuery>;
  viewOneSubscription: RequestHandler<Params, unknown>;
  createSubscription: RequestHandler<{ idCreatedBy: string }, unknown, SubscriptionBody>;
  updateSubscription: RequestHandler<
    Params,
    unknown,
    Partial<SubscriptionBody>
  >;
  deleteSubscription: RequestHandler<Params, unknown>;
};
