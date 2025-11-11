import { RequestHandler } from 'express';
import { UserType } from '@prisma/client';

type Allowoles = (roles: UserType[]) => RequestHandler;

const allowRoles: Allowoles = (roles) => (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: 'Unauthorized', typeError: 'UNAUTHORIZED' });
  }

  const { role } = req.user ;

  if (!roles.includes(role)) {
    return res
      .status(403)
      .json({ message: 'Rol not allowed', typeError: 'FORBIDDEN' });
  }

  next();
};

export default allowRoles;
