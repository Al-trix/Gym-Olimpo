import prisma from '../libs/prisma';
import { ExercisesController } from '../types/controllers.d';

export const viewAllExercises: ExercisesController['viewAllExercises'] = async (
  req,
  res
) => {
  try {
    const { limit, page, exerciseName } = req.query;

    const where: any = {};

    where['exerciseName'] = exerciseName ? String(exerciseName) : undefined;

    if (!where) {
      return res.status(400).json({
        error: {
          message: 'Where not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    const exercises = await prisma.exercise.findMany({
      where,
      skip: (Number(page) - 1) * Number(limit) || 0,
      take: Number(limit) || 10,
    });

    if (exercises.length === 0) {
      return res.status(203).json({
        error: {
          message: 'No exercises found',
          typeError: 'NOT_FOUND',
        },
      });
    }
    const exercisesBody = exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.exerciseName,
      description: exercise.description,
      sets: exercise.sets,
      reps: exercise.reps,
    }));

    res.status(200).json({
      body: exercisesBody,
      message: 'Subscriptions found successfully',
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      total: exercisesBody.length || 0,
      pages: Math.ceil(exercisesBody.length / Number(limit)) || 1,
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

export const viewOneExercise: ExercisesController['viewOneExercise'] = async (
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

    const exercise = await prisma.exercise.findUnique({
      where: {
        id,
      },
    });

    if (!exercise) {
      return res.status(400).json({
        error: {
          message: 'Exercise not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    res.status(200).json({
      body: {
        id: exercise.id,
        name: exercise.exerciseName,
        sets: exercise.sets,
        reps: exercise.reps,
        description: exercise.description,
      },
      message: 'Exercise found successfully',
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

export const createExercise: ExercisesController['createExercise'] = async (
  req,
  res
) => {
  try {
    const { sets, reps, exerciseName, description } = req.body;
    const { routineId } = req.params;

    if (!routineId) {
      return res.status(400).json({
        error: {
          message: 'Id of routine by not provider',
          typeError: 'NOT_PROVIDED',
        },
      });
    }

    const routineExist = await prisma.routine.findUnique({
      where: {
        id: routineId,
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

    const exerciseExist = await prisma.exercise.findFirst({
      where: {
        exerciseName,
      },
    });

    if (exerciseExist) {
      return res.status(400).json({
        error: {
          message: 'Exercise already exist',
          typeError: 'NOT_FOUND',
        },
      });
    }

    const exercise = await prisma.exercise.create({
      data: {
        exerciseName,
        sets,
        reps,
        description,
        routine: {
          connect: {
            id: routineId,
          },
        },
      },
    });

    if (!exercise) {
      return res.status(400).json({
        error: {
          message: 'Exercise not created',
          typeError: 'NOT_CREATED',
        },
      });
    }

    res.status(201).json({
      body: {
        id: exercise.id,
        name: exercise.exerciseName,
        sets: exercise.sets,
        reps: exercise.reps,
        description: exercise.description,
      },
      message: 'Exercise created successfully',
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

export const updateExercise: ExercisesController['updateExercise'] = async (
  req,
  res
) => {
  try {
    const { description, exerciseName, sets, reps } = req.body!;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: {
          message: 'Id not provider',
          typeError: 'NOT_PROVIDED',
        },
      });
    }

    const exerciseExist = await prisma.exercise.findUnique({
      where: {
        id,
      },
    });

    if (!exerciseExist) {
      return res.status(400).json({
        error: {
          message: 'Exercises not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    const exercise = await prisma.exercise.update({
      where: {
        id,
      },
      data: {
        description,
        exerciseName,
        sets,
        reps,
      },
    });

    if (!exercise) {
      return res.status(400).json({
        error: {
          message: 'Exercise not updated',
          typeError: 'NOT_UPDATED',
        },
      });
    }

    return res.status(201).json({
      body: {
        message: 'Exercise updated successfully',
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

export const deleteExercise: ExercisesController['deleteExercise'] = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: {
          message: 'Exercise not provider',
          typeError: 'NOT_PROVIDER',
        },
      });
    }

    const exerciseExist = await prisma.exercise.findUnique({
      where: {
        id,
      },
    });

    if (!exerciseExist) {
      return res.status(400).json({
        error: {
          message: 'Exercise not found',
          typeError: 'NOT_FOUND',
        },
      });
    }

    const exercise = await prisma.exercise.delete({
      where: {
        id,
      },
    });

    if (!exercise) {
      return res.status(400).json({
        error: {
          message: 'Exercise not deleted',
          typeError: 'NOT_DELETED',
        },
      });
    }

    res.status(202).json({
      message: 'Exercise deleted successfully',
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
