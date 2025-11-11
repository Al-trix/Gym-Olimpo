import prisma from '../libs/prisma';
import { Response } from 'express';
import { UserType } from '@prisma/client';

type ComprobateRole = (
  role: UserType,
  email?: string,
  document?: string,
  res: Response
) => Promise<void>;

export const comprobateRole: ComprobateRole = async (
  role,
  email,
  document,
  res
) => {
  if (email) {
    const userExist = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        role: true,
      },
    });

    if (role !== userExist?.role.name) {
      return res.status(400).json({
        error: {
          message: 'Not its your role',
          typeError: 'FORDBIDDEN',
        },
      });
    }
  }

  if (document) {
    const userExist = await prisma.user.findUnique({
      where: {
        document,
      },
      include: {
        role: true,
      },
    });

    if (role !== userExist?.role.name) {
      return res.status(400).json({
        error: {
          message: 'Not its your role',
          typeError: 'FORDBIDDEN',
        },
      });
    }
  }
};
