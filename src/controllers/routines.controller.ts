import prisma from '../libs/prisma';
import { RoutinesController } from '../types/controllers.d';
import { Level, RoutineType } from '@prisma/client';

export const viewAllRoutines: RoutinesController['viewAllRoutines'] = async (
  req,
  res
) => {
  try {
    const { level, type, duration, name, page, limit } = req.query;

    const where: any = {};

    where['type'] = type ? (String(type) as RoutineType) : undefined;

    where['Level'] = level ? (String(level) as Level) : undefined;

    where['name'] = name ? String(name) : undefined;

    where['duration'] = duration ? Number(duration) : undefined;

    if (!where) {
      return res.status(400).json({
        error: {
          message: 'Where not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    const routines = await prisma.routine.findMany({
      where,
      skip: (Number(page) - 1) * Number(limit) || 0,
      take: Number(limit) || 10,
      include: {
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
        exercises:{
          select: {
            exerciseName: true,
            reps: true,
            sets: true

          }
        }
      },
    });

    if (routines.length === 0) {
      return res.status(203).json({
        error: {
          message: 'No items found',
          typeError: 'NOT_FOUND',
        },
      });
    }
    const routinesBody = routines.map((routine) => ({
      id: routine.id,
      name: routine.name,
      type: routine.type,
      level: routine.level,
      duration: routine.duration,
      objectives: routine.objectives,
      createdAt: routine.createdAt,
      coach: routine.coach,
      exercises: routine.exercises,
    }));

    res.status(200).json({
      body: routinesBody,
      message: 'Subscriptions found successfully',
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      total: routinesBody.length || 0,
      pages: Math.ceil(routinesBody.length / Number(limit)) || 1,
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

export const viewOneRoutine: RoutinesController['viewOneRoutine'] = async (
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

    const routine = await prisma.routine.findUnique({
      where: {
        id,
      },
      include: {
        coach: {
          select: {
            id: true,
            document: true,
            fullName: true,
            role: {
              select: {
                name: true,
              },
            }
          },
        },
        exercises: {
          select: {
            exerciseName: true,
            reps: true,
            sets: true
          }
        }
      },
    });

    if (!routine) {
      return res.status(400).json({
        error: {
          message: 'Routine not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    res.status(200).json({
      body: routine,
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

export const createRoutine: RoutinesController['createRoutine'] = async (
  req,
  res
) => {
  try {
    const { type, name, level, duration, objectives } = req.body;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: {
          message: 'Id of coach by not provider',
          typeError: 'NOT_PROVIDED',
        },
      });
    }

    const creatorCoach = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!creatorCoach) {
      return res.status(400).json({
        error: {
          message: 'Coach not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    const routineExist = await prisma.routine.findFirst({
      where: {
        name,
      },
    });

    if (routineExist) {
      return res.status(400).json({
        error: {
          message: 'Routine already exist',
          typeError: 'NOT_FOUND',
        },
      });
    }

    const routine = await prisma.routine.create({
      data: {
        name,
        type,
        level,
        duration,
        objectives,
        coach: {
          connect: {
            id: creatorCoach.id,
          },
        },

      },
      include: {
        coach: {
          select: {
            id: true,
            role: {
              select: {
                name: true,
              },
            },
            document: true,
            fullName: true,
          },
        },
        exercises: {
          select: {
            exerciseName: true,
            reps: true,
            sets: true
          }
        },
      },
    });

    if (!routine) {
      return res.status(400).json({
        error: {
          message: 'Routine not created',
          typeError: 'NOT_CREATED',
        },
      });
    }

    res.status(201).json({
      body: {
        id: routine.id,
        name: routine.name,
        type: routine.type,
        level: routine.level,
        duration: routine.duration,
        objectives: routine.objectives,
        createdAt: routine.createdAt,
        coach: routine.coach,
        exercises: routine.exercises
      },
      message: 'Routine created successfully',
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

export const updateRoutine: RoutinesController['updateRoutine'] = async (
  req,
  res
) => {
  try {
    const { name, type, duration, level, objectives } = req.body!;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: {
          message: 'Id not provider',
          typeError: 'NOT_PROVIDED',
        },
      });
    }

    const routineExist = await prisma.routine.findUnique({
      where: {
        id,
      },
    });

    if (!routineExist) {
      return res.status(400).json({
        error: {
          message: 'Routine not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    const routine = await prisma.routine.update({
      where: {
        id,
      },
      data: {
        name,
        level,
        duration,
        objectives,
        type,
      },
      include: {
        coach: {
          select: {
            id: true,
            role: true,
            fullName: true,
          },
        },
      },
    });

    if (!routine) {
      return res.status(400).json({
        error: {
          message: 'Routine not updated',
          typeError: 'NOT_UPDATED',
        },
      });
    }

    return res.status(201).json({
      body: {
        message: 'Routine updated successfully',
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

export const deleteRoutine: RoutinesController['deleteRoutine'] = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: {
          message: 'Id not provider',
          typeError: 'NOT_PROVIDER',
        },
      });
    }

    const routineExist = await prisma.routine.findUnique({
      where: {
        id,
      },
    });

    if (!routineExist) {
      return res.status(400).json({
        error: {
          message: 'Routine not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    const routine = await prisma.routine.delete({
      where: {
        id,
      },
    });

    if (!routine) {
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
