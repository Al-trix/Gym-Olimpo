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
const routerInventory = Router();
const pathRoot = '/api/inventory';

//! Autorization
const acctionsInventory: UserType[] = [
  UserType.COACH,
  UserType.RECEPTIONIST,
  UserType.LEADER_COACHS,
];

//? route and controller for views items to inventory
routerInventory.get(
  `${pathRoot}/views`,
  verifyToken,
  allowRoles(acctionsInventory),
  viewAllItems
);

//? route and controller for view one item to inventory
routerInventory.get(
  `${pathRoot}/view/:id`,
  verifyToken,
  allowRoles(acctionsInventory),
  viewOneItem
);

//? route and controller for create one item to inventory
routerInventory.post(
  `${pathRoot}/create/:idCreatedBy`,
  verifyToken,
  allowRoles(acctionsInventory),
  createItem
);

//? route and controller for update one item to inventory
routerInventory.put(
  `${pathRoot}/update/:id`,
  verifyToken,
  allowRoles(acctionsInventory),
  updateItem
);

//? route and controller for delete one item to inventory
routerInventory.delete(
  `${pathRoot}/delete/:id`,
  verifyToken,
  allowRoles(acctionsInventory),
  deleteItem
);

export default routerInventory;
