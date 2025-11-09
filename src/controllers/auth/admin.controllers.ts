import prisma from '../../libs/prisma';
import { hash, compare } from 'bcryptjs';
import createToken from '../../libs/createToken';
import { AdminController, AdminBody } from '../../types/controllers.d';
import { UserType } from '@prisma/client';

export const adminLogin: AdminController['adminLogin'] = async (req, res) => {
  try {
    const { email, password }: Pick<AdminBody, 'email' | 'password'> = req.body;

    const userAdmin = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        role: true,
      },
    });

    if (!userAdmin) {
      return res.status(400).json({
        error: {
          message: 'User not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    const passwordMatch = await compare(password, userAdmin.password);

    if (!passwordMatch) {
      return res.status(400).json({
        error: {
          message: 'Invalid password',
          typeError: 'INVALID_PASSWORD',
        },
      });
    }

    
    if (!userAdmin.role.name) {
      return res.status(400).json({
        error: {
          message: 'Role not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    if (userAdmin.role?.name !== UserType.ADMIN) {
      return res.status(400).json({
        error: {
          message: 'User is not an admin',
          typeError: 'NOT_ADMIN',
        },
      });
    }

   
    createToken({ id: userAdmin.id }, userAdmin.role?.name, 'token__user', res);

    res.status(200).json({
      body: {
        id: userAdmin.id,
        fullName: userAdmin.fullName,
        email: userAdmin.email,
        role: userAdmin.role?.name,
        document: userAdmin.document,
        active: userAdmin.active,
      },
      message: 'Login successful',
    });
  } catch (err) {}
};

export const adminRegister: AdminController['adminRegister'] = async (
  req,
  res
) => {
  try {
    const { fullName, email, password, role, document }: AdminBody = req.body;

    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return res.status(400).json({
        error: {
          message: 'User already exists',
          typeError: 'ALREADY_EXISTS',
        },
      });
    }

    const hashedPassword = await hash(password, 10);

    const roleExists = await prisma.roles.findFirst({
      where: {
        name: role,
      },
    });

    if (!roleExists) {
      return res.status(400).json({
        error: {
          message: 'Role not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    const userAdminCreated = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: {
          connect: {
            id: roleExists?.id,
          },
        },
        document,
      },
    });

    if (!userAdminCreated) {
      return res.status(400).json({
        error: {
          message: 'User not created',
          typeError: 'NOT_CREATED',
        },
      });
    }

    createToken(
      { id: userAdminCreated.id },
      roleExists.name,
      'token__user',
      res
    );

    return res.status(200).json({
      body: {
        id: userAdminCreated.id,
        email: userAdminCreated.email,
        document: userAdminCreated.document,
        role: roleExists.name,
        fullName: userAdminCreated.fullName,
        active: userAdminCreated.active,
        createdAt: userAdminCreated.createdAt,
        updatedAt: userAdminCreated.updatedAt,
      },
      message: 'User created successfully',
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: {
        message: 'Internal server error',
        typeError: 'INTERNAL_SERVER_ERROR',
      },
    });
  }
};

export const adminUpdate: AdminController['adminUpdate'] = async (
  req,
  res
) => {};

export const adminDelete: AdminController['adminDelete'] = async (
  req,
  res
) => {};

export const adminLogout: AdminController['adminLogout'] = async (
  req,
  res
) => {};
