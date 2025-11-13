import { Router } from 'express';
import {
  viewAllRoutines,
  viewOneRoutine,
  createRoutine,
  updateRoutine,
  deleteRoutine,
} from '../controllers/routines.controller';
import { UserType } from '@prisma/client';
import verifyToken from '../middlewares/verifyToken';
import allowRoles from '@/middlewares/allowRoles';

//* Routers
const routerRoutines = Router();
const pathRoot = '/api/routines';

//! Autorization
const viewsRoutines: UserType[] = [
  UserType.COACH,
  UserType.RECEPTIONIST,
  UserType.LEADER_COACHS,
  UserType.USER,
  UserType.ADMIN,
];

//? route and controller for views all the routines
routerRoutines.get(
  `${pathRoot}/views`,
  verifyToken,
  allowRoles(viewsRoutines),
  viewAllRoutines
);

//? route and controller for view one routine
routerRoutines.get(
  `${pathRoot}/view/:id`,
  verifyToken,
  allowRoles(viewsRoutines),
  viewOneRoutine
);

//? route and controller for create one routine
routerRoutines.post(
  `${pathRoot}/create/:id`,
  verifyToken,
  allowRoles([UserType.COACH, UserType.LEADER_COACHS]),
  createRoutine
);

//? route and controller for update one routine
routerRoutines.put(
  `${pathRoot}/update/:id`,
  verifyToken,
  allowRoles([UserType.COACH, UserType.LEADER_COACHS]),
  updateRoutine
);

//? route and controller for delete one routine
routerRoutines.delete(
  `${pathRoot}/delete/:id`,
  verifyToken,
  allowRoles([UserType.COACH, UserType.ADMIN]),
  deleteRoutine
);

export default routerRoutines;
