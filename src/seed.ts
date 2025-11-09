import prisma from './libs/prisma';
import { UserType } from '@prisma/client';

const seed = async () => {
  const roles = [
    UserType.ADMIN,
    UserType.COACH,
    UserType.USER,
    UserType.RECEPTIONIST,
    UserType.LEADER_COACHS,
  ];

  for (const role of roles) {
    await prisma.roles.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });
  }

  console.log('Seed ejecutada correctamente');
};

export default seed;
