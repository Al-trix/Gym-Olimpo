import { RequestHandler } from 'express';
import type {
  UserType,
  SubscriptionType,
  Prisma,
  InventoryType,
  Status,
  Level,
  RoutineType,
} from '@prisma/client';

export type AuthBody = {
  fullName?: string;
  email?: string;
  password: string;
  role: UserType;
  document: string;
};

export type SubscriptionBody = {
  type: SubscriptionType;
  document: string;
  fullName?: string;
  active: boolean;
};

type Params = {
  id: string;
};

type paramsExercises = {
  routineId: string;
}

type Creator = {
  creator: UserType;
};

export type InventoryBody = {
  name: string;
  type: InventoryType;
  quantity: number;
  status: Status;
};

export type RoutinesBody = {
  name: string;
  level: Level;
  type: RoutineType;
  duration: number;
  objectives: string;
};

type InventoryBodyPartial = Partial<InventoryBody & { updatedBy?: string }>;

type ExercisesBody = {
  exerciseName: string;
  description: string;
  sets: Int;
  reps: Int;
};

type filtersQuery = {
  type?: SubscriptionType;
  active?: boolean;
  document?: string;
  fullName?: string;
  creator?: UserType;
  page?: number;
  limit?: number;
};

type filtersQueryInventory = {
  name?: string;
  type?: InventoryType;
  page?: number;
  limit?: number;
  quantity?: number;
  status?: boolean;
  lowStockAlert?: number;
};

export const SubscriptionSelect = {
  user: {
    select: {
      id: true,
      document: true,
      fullName: true,
    },
  },
  createdBy: {
    select: {
      id: true,
      document: true,
      fullName: true,
    },
  },
};

export type Subscription = Prisma.subscriptionsGetPayload<{
  include: {
    user: SubscriptionSelect['user'];
    createdBy: SubscriptionSelect['createdBy'];
  };
}>;

export type AuthController = {
  authLogin: RequestHandler<
    {},
    unknown,
    Pick<AuthBody, 'email' | 'password' | 'document' | 'role'>,
    Creator
  >;

  authRegister: RequestHandler<{}, unknown, AuthBody, Creator>;

  authUpdate: RequestHandler<Params, unknown, Partial<AuthBody>>;

  authDelete: RequestHandler<Params>;

  authLogout: RequestHandler<Params>;

  authValidteCookie: RequestHandler;
};

export type SubscriptionController = {
  viewSubscriptions: RequestHandler<unknown, unknown, unknown, filtersQuery>;
  viewOneSubscription: RequestHandler<Params, unknown>;
  createSubscription: RequestHandler<
    { idCreatedBy: string },
    unknown,
    SubscriptionBody
  >;
  updateSubscription: RequestHandler<
    Params,
    unknown,
    Partial<SubscriptionBody>
  >;
  deleteSubscription: RequestHandler<Params, unknown>;
};

export type InventoryCotroller = {
  viewAllItems: RequestHandler<
    unknown,
    unknown,
    unknown,
    filtersQueryInventory
  >;
  viewOneItem: RequestHandler<Params, unknown>;
  createItem: RequestHandler<{ idCreatedBy: string }, unknown, InventoryBody>;
  updateItem: RequestHandler<Params, unknown, InventoryBodyPartial>;
  deleteItem: RequestHandler<Params, unknown>;
};
export type RoutinesController = {
  viewAllRoutines: RequestHandler<
    unknown,
    unknown,
    unknown,
    Partial<Omit<RoutinesBody, 'objectives'> & { limit: number; page: number }>
  >;
  viewOneRoutine: RequestHandler<Params, unknown>;
  createRoutine: RequestHandler<Params, unknown, RoutinesBody>;
  updateRoutine: RequestHandler<Params, unknown, Partial<RoutinesBody>>;
  deleteRoutine: RequestHandler<Params, unknown>;
};


export type ExercisesController = {
  viewAllExercises: RequestHandler<
    unknown,
    unknown,
    unknown,
    Partial<
      Pick<ExercisesBody, 'exerciseName'> & { limit: number; page: number }
    >
  >;
  viewOneExercise: RequestHandler<Params, unknown>;
  createExercise: RequestHandler<paramsExercises, unknown, ExercisesBody>;
  updateExercise: RequestHandler<Params, unknown, Partial<ExercisesBody>>;
  deleteExercise: RequestHandler<params, unknown>;
};
