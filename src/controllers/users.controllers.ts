import prisma from '../libs/prisma';
import { hash, compare } from 'bcryptjs';
import createToken from '../libs/createToken';
import { AuthController } from '../types/controllers';
import { UserType } from '@prisma/client';

export const authLogin: AuthController['authLogin'] = async (req, res) => {
  try {
    const { email, password, document, role } = req.body;

    let user;

    if (
      role !== UserType.ADMIN ||
      role !== UserType.RECEPTIONIST ||
      role !== UserType.LEADER_COACHS
    ) {
      user = await prisma.user.findUnique({
        where: {
          document,
        },
        include: {
          role: true,
        },
      });
    }

    user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      return res.status(400).json({
        error: {
          message: 'User not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    if (!user.role.name) {
      return res.status(400).json({
        error: {
          message: 'Role not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({
        error: {
          message: 'Invalid password',
          typeError: 'INVALID_PASSWORD',
        },
      });
    }
    if (user.role?.name !== UserType.ADMIN) {
      return res.status(400).json({
        error: {
          message: 'User is not an admin',
          typeError: 'NOT_ADMIN',
        },
      });
    }

    createToken({ id: user.id}, user.role?.name, 'token__user', res);

    res.status(200).json({
      body: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role?.name,
        document: user.document,
        active: user.active,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      message: 'Login successful',
    });
  } catch (err) {}
};

export const authRegister: AuthController['authRegister'] = async (
  req,
  res
) => {
  try {
    const { fullName, email, password, role, document } = req.body;
    const { creatorRole } = req.query;

    if (creatorRole !== UserType.ADMIN && creatorRole !== UserType.LEADER_COACHS) {
      return res.status(400).json({
        error: {
          message: 'User is not an admin or leader coach',
          typeError: 'NOT_ADMIN',
        },
      });
    }

    if (role === UserType.USER) {
      return res.status(400).json({
        error: {
          message: 'Account user not allowed',
          typeError: 'NOT_CREATED_USER'
        },
      })  
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

    const userCreated = await prisma.user.create({
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

    if (!userCreated) {
      return res.status(400).json({
        error: {
          message: 'User not created',
          typeError: 'NOT_CREATED',
        },
      });
    }

    createToken({ id: userCreated.id }, roleExists.name, 'token__user', res);

    return res.status(200).json({
      body: {
        id: userCreated.id,
        email: userCreated.email,
        document: userCreated.document,
        role: roleExists.name,
        fullName: userCreated.fullName,
        active: userCreated.active,
        createdAt: userCreated.createdAt,
        updatedAt: userCreated.updatedAt,
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

export const authUpdate: AuthController['authUpdate'] = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, document, role } = req.body;

    const userAdmin = await prisma.user.findUnique({
      where: {
        id,
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

    if (userAdmin.role?.name !== UserType.ADMIN) {
      return res.status(400).json({
        error: {
          message: 'User is not an admin',
          typeError: 'NOT_ADMIN',
        },
      });
    }

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

    //! TODO: Update user for password

    const userAdminUpdated = await prisma.user.update({
      where: {
        id,
      },
      data: {
        fullName,
        email,
        document,
        role: {
          connect: {
            id: roleExists?.id,
          },
        },
      },
    });

    if (!userAdminUpdated) {
      return res.status(400).json({
        error: {
          message: 'User not updated',
          typeError: 'NOT_UPDATED',
        },
      });
    }

    return res.status(202).json({
      message: 'User updated successfully',
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

export const authDelete: AuthController['authDelete'] = async (req, res) => {
  try {
    const { id } = req.params;

    const userAdmin = await prisma.user.findUnique({
      where: {
        id,
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

    if (userAdmin.role?.name !== UserType.ADMIN) {
      return res.status(400).json({
        error: {
          message: 'User is not an admin',
          typeError: 'NOT_ADMIN',
        },
      });
    }

    const userAdminDeleted = await prisma.user.delete({
      where: {
        id,
      },
    });

    if (!userAdminDeleted) {
      return res.status(400).json({
        error: {
          message: 'User not deleted',
          typeError: 'NOT_DELETED',
        },
      });
    }

    return res.status(202).json({
      message: 'User deleted successfully',
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

export const authLogout: AuthController['authLogout'] = async (req, res) => {
  try {
    res.clearCookie('token__user');
    return res.status(200).json({ message: 'Logout successfully' });
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
