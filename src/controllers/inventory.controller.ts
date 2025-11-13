import prisma from '../libs/prisma';
import { InventoryCotroller } from '../types/controllers.d';
import { SubscriptionType } from '@prisma/client';

export const viewAllItems: InventoryCotroller['viewAllItems'] = async (
  req,
  res
) => {
  try {
    const { limit, page, type, name, status } = req.query;

    const where: any = {};

    where['type'] = type ? (String(type) as SubscriptionType) : undefined;

    where['status'] = status ? Boolean(status) : undefined;

    where['name'] = name ? String(name) : undefined;

    if (!where) {
      return res.status(400).json({
        error: {
          message: 'Where not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    const items = await prisma.inventory.findMany({
      where,
      skip: (Number(page) - 1) * Number(limit) || 0,
      take: Number(limit) || 10,
      include: {
        creator: {
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
        updater: {
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
    });

    if (items.length === 0) {
      return res.status(203).json({
        error: {
          message: 'No items found',
          typeError: 'NOT_FOUND',
        },
      });
    }
    const itemsBody = items.map((item) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      quantity: item.quantity,
      status: item.status,
      createdBy: item.creator,
      updatedBy: item.updater ? item.updater : null,
    }));

    res.status(200).json({
      body: itemsBody,
      message: 'Subscriptions found successfully',
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      total: items.length || 0,
      pages: Math.ceil(items.length / Number(limit)) || 1,
      nextPage: Number(page) + 1 || 1,
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

export const viewOneItem: InventoryCotroller['viewOneItem'] = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: {
          message: 'Id not provider',
          typeError: 'NOT_PROVIDED',
        },
      });
    }

    const item = await prisma.inventory.findUnique({
      where: {
        id,
      },
      include: {
        creator: {
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
        updater: {
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
    });

    if (!item) {
      return res.status(400).json({
        error: {
          message: 'Item not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    res.status(200).json({
      body: {
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        status: item.status,
        type: item.type,
        createdBy: item.creator,
        updatedBy: item.updater ? item.updater : null,
      },
      message: 'Item found successfully',
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

export const createItem: InventoryCotroller['createItem'] = async (
  req,
  res
) => {
  try {
    const { type, name, quantity, status } = req.body;
    const { idCreatedBy } = req.params;

    if (!idCreatedBy) {
      return res.status(400).json({
        error: {
          message: 'Id of created by not provider',
          typeError: 'NOT_PROVIDED',
        },
      });
    }

    const creator = await prisma.user.findUnique({
      where: {
        id: idCreatedBy,
      },
    });

    if (!creator) {
      return res.status(400).json({
        error: {
          message: 'Creator not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    const itemExist = await prisma.inventory.findFirst({
      where: {
        name,
      },
    });

    if (itemExist) {
      return res.status(400).json({
        error: {
          message: 'Item already exist',
          typeError: 'NOT_FOUND',
        },
      });
    }

    const item = await prisma.inventory.create({
      data: {
        name,
        quantity,
        status,
        type,
        creator: {
          connect: {
            id: creator.id,
          },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            role: {
              select: {
                name: true,
              },
            },
            fullName: true,
          },
        },
      },
    });

    if (!item) {
      return res.status(400).json({
        error: {
          message: 'Item not created',
          typeError: 'NOT_CREATED',
        },
      });
    }

    res.status(201).json({
      body: {
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        status: item.status,
        type: item.type,
        createdBy: item.creator,
      },
      message: 'Item created successfully',
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

export const updateItem: InventoryCotroller['updateItem'] = async (
  req,
  res
) => {
  try {
    const { name, quantity, updatedBy, type, status } = req.body!;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: {
          message: 'Id not provider',
          typeError: 'NOT_PROVIDED',
        },
      });
    }

    const itemExist = await prisma.inventory.findUnique({
      where: {
        id,
      },
    });

    if (!itemExist) {
      return res.status(400).json({
        error: {
          message: 'Item not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    const item = await prisma.inventory.update({
      where: {
        id,
      },
      data: {
        name,
        quantity,
        updater: {
          connect: {
            id: updatedBy,
          },
        },
        type,
        status,
      },
    });

    if (!item) {
      return res.status(400).json({
        error: {
          message: 'Item not updated',
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

export const deleteItem: InventoryCotroller['deleteItem'] = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: {
          message: 'Item not provider',
          typeError: 'NOT_PROVIDER',
        },
      });
    }

    const itemExist = await prisma.inventory.findUnique({
      where: {
        id,
      },
    });

    if (!itemExist) {
      return res.status(400).json({
        error: {
          message: 'Item not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    const item = await prisma.inventory.delete({
      where: {
        id,
      },
    });

    if (!item) {
      return res.status(400).json({
        error: {
          message: 'Item not deleted',
          typeError: 'NOT_DELETED',
        },
      });
    }

    res.status(202).json({
      message: 'Item deleted successfully',
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
