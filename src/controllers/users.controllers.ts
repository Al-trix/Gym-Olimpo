import prisma from '../libs/prisma';
import createToken from '../libs/createToken';
import { hash, compare } from 'bcryptjs';
import { comprobateRole } from '@/libs/comprobateRole';
import { AuthController } from '../types/controllers';
import { UserType } from '@prisma/client';
import e from 'express';

export const authLogin: AuthController['authLogin'] = async (req, res) => {
  try {
    const { email, password, document } = req.body;

    // comprobateRole(res, role, email, document);

    const userExist = await prisma.user.findUnique({
      where: {
        email: email ? email : document,
      },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    const includeUser: any = {
      role: {
        select: {
          name: true,
        },
      },
    };

    if (userExist?.role.name === UserType.USER) {
      includeUser['subscription'] = {
        select: {
          id: true,
          type: true,
          startDate: true,
          endDate: true,
          active: true,
          createdAt: true,
          updatedAt: true,
          createdBy: {
            select: {
              id: true,
              document: true,
              fullName: true,
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      };
    }

    if (userExist?.role.name === UserType.COACH || userExist?.role.name === UserType.LEADER_COACHS) {
      includeUser['routine'] = {
        select: {
          id: true,
          name: true,
          type: true,
          level: true,
          duration: true,
          objectives: true,
          coach: {
            select: {
              id: true,
              document: true,
              fullName: true,
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
          exercises: {
            select: {
              id: true,
              exerciseName: true,
              sets: true,
              reps: true,
            },
          }
        },
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email ? email : document,
      },
      include: includeUser,
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

    createToken({ id: user.id }, user.role?.name, 'token__user', res);

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
        subscriptionUser: user.subscriptionUser,
        coachRoutines: user.coachRoutines,
      },
      message: 'Login successful',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: {
        message: 'Server error',
        typeError: 'SERVER_ERROR',
      },
    });
  }
};

export const authRegister: AuthController['authRegister'] = async (
  req,
  res
) => {
  try {
    const { fullName, email, password, role, document } = req.body;
    const { creator } = req.query;

    if (!creator) {
      return res.status(400).json({
        error: {
          message: 'Creator role not found',
          typeError: 'NOT_FOUND',
        },
      });
    }
    if (creator !== UserType.ADMIN && creator !== UserType.LEADER_COACHS) {
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
          typeError: 'NOT_CREATED_USER',
        },
      });
    }

    const hashedPassword = await hash(password, 10);

    const roleExists = await prisma.role.findFirst({
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

    const roleExists = await prisma.role.findFirst({
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

export const authValidteCookie: AuthController['authValidteCookie'] = async (
  req,
  res
) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: 'Not authorized', typeError: 'UNAUTHORIZED' });
    }
    const { data, role } = req.user;
    const includeUser: any = {};

    if (role === UserType.USER) {
      includeUser['subscriptions'] = {
        select: {
          id: true,
          type: true,
          startDate: true,
          endDate: true,
          active: true,
          createdAt: true,
          updatedAt: true,
          createdBy: {
            select: {
              id: true,
              document: true,
              fullName: true,
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      };
    }

    if (role === UserType.COACH || role === UserType.LEADER_COACHS) {
      includeUser['routine'] = {
        select: {
          id: true,
          type: true,
          name: true,
          level: true,
          duration: true,
          objectives: true,
          createdAt: true,
          updatedAt: true,
          createdBy: {
            select: {
              id: true,
              document: true,
              fullName: true,
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      };
    }
    const user = await prisma.user.findUnique({
      where: {
        id: data.id,
      },
      include: {
        role: true,
        subscriptionUser: includeUser['subscriptions'] || false,
        coachRoutines: includeUser['routine'] || false,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Not found user', typeError: 'NOT_FOUND' });
    }

    let dataUser: any = {};
    if (includeUser.includes('subscriptions')) {
      dataUser['subscriptions'] = user.subscriptionUser.map(
        (subscription: any) => ({
          id: subscription.id,
          type: subscription.type,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          active: subscription.active,
          createdAt: subscription.createdAt,
          updatedAt: subscription.updatedAt,
          createdBy: {
            id: subscription.createdBy.id,
            document: subscription.createdBy.document,
            fullName: subscription.createdBy.fullName,
            role: {
              name: subscription.createdBy.role.name,
            },
          },
        })
      );
    }

    if (includeUser.includes('routine')) {
      dataUser['routine'] = user.coachRoutines.map((routine: any) => ({
        id: routine.id,
        type: routine.type,
        name: routine.name,
        level: routine.level,
        duration: routine.duration,
        objectives: routine.objectives,
        createdAt: routine.createdAt,
        updatedAt: routine.updatedAt,
        createdBy: {
          id: routine.createdBy.id,
          document: routine.createdBy.document,
          fullName: routine.createdBy.fullName,
          role: {
            name: routine.createdBy.role.name,
          },
        },
      }));
    }

    return res.status(200).json({
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        document: user.document,
        role: user.role?.name,
        active: user.active,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        ...dataUser,
      },
      message: 'User validated successfully',
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
