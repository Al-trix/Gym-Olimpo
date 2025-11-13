import { RequestHandler } from 'express';
import { BodyToken } from '../types/libs.d';
import { UserType } from '@prisma/client';
import jwt from 'jsonwebtoken';

const verifyToken: RequestHandler = (req, res, next) => {
  try {
    const { token__user } = req.cookies;

    if (!token__user) {
      return res
        .status(401)
        .json({
          error: {
            message: 'Unauthorized its not have token',
            typeError: 'UNAUTHORIZED',
          }
        });
    }

    if (!token__user.data) {
      return res
        .status(401)
        .json({
          error: {
            message: 'Unauthorized its not have data',
            typeError: 'UNAUTHORIZED',
          }
        });
    }

    if (!token__user.role) {
      return res
        .status(401)
        .json({
          error: {
            message: 'Unauthorized its not have role',
            typeError: 'UNAUTHORIZED',
          }
        });
    }

    const decoded = jwt.verify(token__user.data, process.env.TOKEN_SECRET!) as {
      id: string;
    };

    req.user = {
      data: decoded,
      role: token__user.role,
    };

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      error: {
        message: 'Unauthorized',
        typeError: 'UNAUTHORIZED',
      },
    });
  }
};

export default verifyToken;
