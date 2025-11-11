import prisma from '../libs/prisma';
import type { SubscriptionController } from '../types/controllers.d';
import { UserType } from '@prisma/client';
import endDate from '@/libs/endDate';
import { hash } from 'bcryptjs';

export const viewSubscriptions: SubscriptionController['viewSubscriptions'] =
  async (req, res) => {
    try {
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: {
          message: 'Internal server error',
          typeError: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  };

export const viewOneSubscription: SubscriptionController['viewOneSubscription'] =
  async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: {
          message: 'Id not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    const subscription = await prisma.subscriptions.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        createdBy: true,
      },
    });

    if (!subscription) {
      return res.status(400).json({
        error: {
          message: 'Subscription not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    res.status(200).json({
      body: {
        id: subscription.id,
        type: subscription.type,
        active: subscription.active,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        user: {
          id: subscription.user.id,
          document: subscription.user.document,
          fullName: subscription.user.fullName,
        },
        createdBy: {
          id: subscription.createdBy.id,
          document: subscription.createdBy.document,
          fullName: subscription.createdBy.fullName,
        },
      },
    });

    try {
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: {
          message: 'Internal server error',
          typeError: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  };

export const createSubscription: SubscriptionController['createSubscription'] =
  async (req, res) => {
    try {
      const { type, active, document, fullName } = req.body;
      const { idCreatedBy } = req.params;

      if (!idCreatedBy) {
        return res.status(400).json({
          error: {
            message: 'Creator role not found',
            typeError: 'NOT_FOUND',
          },
        });
      }

      const userExist = await prisma.user.findUnique({
        where: {
          document,
        },
      });

      if (userExist) {
        return res.status(400).json({
          error: {
            message: 'User already exists',
            typeError: 'ALREADY_EXISTS',
          },
        });
      }

      const roleExists = await prisma.roles.findUnique({
        where: {
          name: UserType.USER,
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

      const hashedPassword = await hash(`${document}**`, 10);

      const userSubscription = await prisma.user.create({
        data: {
          fullName,
          password: hashedPassword,
          role: {
            connect: {
              id: roleExists?.id,
            },
          },
          document,
        },
      });

      if (!userSubscription) {
        return res.status(400).json({
          error: {
            message: 'User not created for subscription',
            typeError: 'NOT_CREATED',
          },
        });
      }

      const { start, end } = endDate(type);

      const subscription = await prisma.subscriptions.create({
        data: {
          type,
          active,
          startDate: start,
          endDate: end,
          createdBy: {
            connect: {
              id: idCreatedBy,
            },
          },
          user: {
            connect: {
              id: userSubscription.id,
            },
          },
        },
        include: {
          user: true,
          createdBy: true,
        },
      });

      if (!subscription) {
        return res.status(400).json({
          error: {
            message: 'Subscription not created',
            typeError: 'NOT_CREATED',
          },
        });
      }

      return res.status(200).json({
        body: {
          id: subscription.id,
          type: subscription.type,
          active: subscription.active,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          fullName: subscription.user.fullName,
          document: subscription.user.document,
          createdBy: {
            id: subscription.createdBy.id,
            fullName: subscription.createdBy.fullName,
            document: subscription.createdBy.document,
          },
          message: 'Subscription created successfully',
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: {
          message: 'Internal server error',
          typeError: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  };

export const updateSubscription: SubscriptionController['updateSubscription'] =
  async (req, res) => {
    try {
      const { type, active } = req.body;
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          error: {
            message: 'Subscription not found',
            typeError: 'NOT_FOUND',
          },
        });
      }

      const subscriptionExists = await prisma.subscriptions.findUnique({
        where: {
          id,
        },
      });

      if (!subscriptionExists) {
        return res.status(400).json({
          error: {
            message: 'Subscription not found',
            typeError: 'NOT_FOUND',
          },
        });
      }

      const { start, end } = endDate(type!);

      const subscription = await prisma.subscriptions.update({
        where: {
          id,
        },
        data: {
          type,
          active,
          startDate: start,
          endDate: end,
        },
        include: {
          user: true,
          createdBy: true,
        },
      });

      if (!subscription) {
        return res.status(400).json({
          error: {
            message: 'Subscription not updated',
            typeError: 'NOT_UPDATED',
          },
        });
      }

      return res.status(201).json({
        body: {
          message: 'Subscription updated successfully',
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: {
          message: 'Internal server error',
          typeError: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  };

export const deleteSubscription: SubscriptionController['deleteSubscription'] =
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          error: {
            message: 'Subscription not found',
            typeError: 'NOT_FOUND',
          },
        });
      }

      const subscriptionExists = await prisma.subscriptions.findUnique({
        where: {
          id,
        },
      });

      if (!subscriptionExists) {
        return res.status(400).json({
          error: {
            message: 'Subscription not found',
            typeError: 'NOT_FOUND',
          },
        });
      }

      const subscription = await prisma.subscriptions.delete({
        where: {
          id,
        },
      });

      if (!subscription) {
        return res.status(400).json({
          error: {
            message: 'Subscription not deleted',
            typeError: 'NOT_DELETED',
          },
        });
      }

      return res.status(201).json({
        body: {
          message: 'Subscription deleted successfully',
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: {
          message: 'Internal server error',
          typeError: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  };
