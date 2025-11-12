import prisma from '../libs/prisma';
import type { ComprobateActive } from '@/types/libs';
import getColombiaDate from './getColombiaTime';

const comprobateActive: ComprobateActive = async (
  limit = 10,
  page = 1,
  res
) => {
  const subscriptions = await prisma.subscriptions.findMany({
    take: limit || 10,
    skip: (page - 1) * limit || 0,
    include: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  subscriptions.forEach(async (subscription) => {
    const isActive =
      getColombiaDate().getTime() >= subscription.endDate.getTime()
        ? false
        : true;

    await prisma.subscriptions.update({
      where: {
        id: subscription.id,
      },
      data: {
        active: isActive,
      },
    });

  });
};

export default comprobateActive;
