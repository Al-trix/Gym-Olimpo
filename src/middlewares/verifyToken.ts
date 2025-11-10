import { RequestHandler } from 'express';
import { BodyToken } from '../types/libs.d';
import { UserType } from '@prisma/client';
import jwt from 'jsonwebtoken';


const verifyToken: RequestHandler = (req, res, next) => {
  try {
    const { token__user } = req.cookies;

    if (!token__user.data) {
      return res
        .status(401)
        .json({ message: 'Unauthorized its not have token' });
    }

    if (!token__user.role) {
      return res
        .status(401)
        .json({ message: 'Unauthorized its not have role' });
    }

    const decoded = jwt.verify(
      token__user.data,
      process.env.TOKEN_SECRET!
    ) as BodyToken;

    req.user = decoded;

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default verifyToken;
