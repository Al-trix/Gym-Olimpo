import prisma from '../libs/prisma';
import comprobateActive from '@/libs/comprobateActive';
import {
  SubscriptionController,
  SubscriptionSelect,
} from '../types/controllers.d';
import { UserType, SubscriptionType } from '@prisma/client';
import endDate from '@/libs/timeSubscription';
import { hash } from 'bcryptjs';

import timeSubscription from '@/libs/timeSubscription';

export const viewSubscriptions: SubscriptionController['viewSubscriptions'] =
  async (req, res) => {
    const { limit, page, type, document, fullName, creator, active } =
      req.query;

    const where: any = {};

    if (type) {
      where['type'] = type ? (String(type) as SubscriptionType) : undefined;
    }

    if (active) {
      where['active'] = active ? Boolean(active) : undefined;
    }

    if (document || fullName || creator)
      where['user'] = {
        document: {
          contains: document ? String(document) : undefined,
          mode: 'insensitive',
        },
        fullName: {
          contains: fullName ? String(fullName) : undefined,
          mode: 'insensitive',
        },
      };
    where['createdBy'] = {
      fullName: {
        contains: creator ? String(creator) : undefined,
        mode: 'insensitive',
      },
    };

    comprobateActive(limit, page, res);

    if (!where) {
      return res.status(400).json({
        error: {
          message: 'Where not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    const subscriptions = await prisma.subscriptions.findMany({
      where,
      include: {
        user: SubscriptionSelect['user'],
        createdBy: SubscriptionSelect['createdBy'],
      },
      take: Number(limit) || 10,
      skip: (Number(page) - 1) * Number(limit) || 0,
    });

    if (!subscriptions) {
      return res.status(400).json({
        error: {
          message: 'Subscriptions not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    if (subscriptions.length === 0) {
      return res.status(400).json({
        error: {
          message: 'Subscriptions not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    const bodySubscriptions = subscriptions.map((subscription) => ({
      id: subscription.id,
      type: subscription.type,
      active: subscription.active,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      user: subscription.user,
      createdBy: subscription.createdBy,
    }));

    res.status(200).json({
      body: bodySubscriptions,
      message: 'Subscriptions found successfully',
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      total: subscriptions.length || 0,
      pages: Math.ceil(subscriptions.length / Number(limit)) || 1,
      nextPage: Number(page) + 1 || 1,
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

    comprobateActive(10, 1, res);

    const subscription = await prisma.subscriptions.findUnique({
      where: {
        id,
      },
      include: {
        user: SubscriptionSelect['user'],
        createdBy: SubscriptionSelect['createdBy'],
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
        user: subscription.user,
        createdBy: subscription.createdBy,
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

      const { start, end } = timeSubscription(type);

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
          user: SubscriptionSelect['user'],
          createdBy: SubscriptionSelect['createdBy'],
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
          user: subscription.user,
          createdBy: subscription.createdBy,
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
