import { Router } from 'express';
import {
  viewAllItems,
  viewOneItem,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/inventory.controller';
import { UserType } from '@prisma/client';
import verifyToken from '../middlewares/verifyToken';
import allowRoles from '@/middlewares/allowRoles';

//* Routers
const routerExercises = Router();
const pathRoot = '/api/exercises';

//! Autorization
const acctionsExercises: UserType[] = [
  UserType.COACH,
  UserType.RECEPTIONIST,
  UserType.LEADER_COACHS,
];

//? route and controller for views items to inventory
routerExercises.get(
  `${pathRoot}/views`,
  verifyToken,
  allowRoles(acctionsExercises),
  viewAllItems
);

//? route and controller for view one item to inventory
routerExercises.get(
  `${pathRoot}/view/:id`,
  verifyToken,
  allowRoles(acctionsExercises),
  viewOneItem
);

//? route and controller for create one item to inventory
routerExercises.post(
  `${pathRoot}/create/:routineId`,
  verifyToken,
  allowRoles(acctionsExercises),
  createItem
);

//? route and controller for update one item to inventory
routerExercises.put(
  `${pathRoot}/update/:id`,
  verifyToken,
  allowRoles(acctionsExercises),
  updateItem
);

//? route and controller for delete one item to inventory
routerExercises.delete(
  `${pathRoot}/delete/:id`,
  verifyToken,
  allowRoles(acctionsExercises),
  deleteItem
);

export default routerExercises;
