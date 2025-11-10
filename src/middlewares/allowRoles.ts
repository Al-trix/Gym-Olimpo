import { Request, Response, NextFunction } from 'express';
import { UserType } from '@prisma/client';

type AllowRolesMiddleware = (
  roles: UserType[]
) => (req: Request, res: Response, next: NextFunction) => void;
type AuthBody = {
  id: string;
  role: UserType;
};
export const allowRoles: AllowRolesMiddleware = (roles) => (req, res, next) => {
  const { role } = req.user as AuthBody;
  if (!req.user) {
    return res.status(401).json({
      message: 'Unauthorized',
      typeError: 'UNAUTHORIZED',
    });
  }
  if (!roles.includes(role)) {
    return res.status(403).json({
      message: 'Rol not allowed',
      typeError: 'FORDBIDDEN',
    });
  }

  next();
};
