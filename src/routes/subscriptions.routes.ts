import { Router } from 'express';
import {
  viewOneSubscription,
  viewSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from '../controllers/subscriptions.controllers';
import { UserType } from '@prisma/client';
import verifyToken from '../middlewares/verifyToken';
import allowRoles from '@/middlewares/allowRoles';

//* Routers
const routerSubscriptions = Router();
const pathRoot = '/api/subs';

//! Autorization
const acctionsSubscriptions: UserType[] = [
  UserType.COACH,
  UserType.RECEPTIONIST,
  UserType.LEADER_COACHS,
];

//? route and controller for views subscriptions
routerSubscriptions.get(
  `${pathRoot}/views`,
  verifyToken,
  allowRoles(acctionsSubscriptions),
  viewSubscriptions
);

//? route and controller for view one subscription
routerSubscriptions.get(
  `${pathRoot}/view/:id`,
  verifyToken,
  allowRoles(acctionsSubscriptions),
  viewOneSubscription
);

//? route and controller for create subscription
routerSubscriptions.post(
  `${pathRoot}/create/:idCreatedBy`,
  verifyToken,
  allowRoles(acctionsSubscriptions),
  createSubscription
);

//? route and controller for update subsription
routerSubscriptions.put(
  `${pathRoot}/update/:id`,
  verifyToken,
  allowRoles(acctionsSubscriptions),
  updateSubscription
);

//? route and controller for delete subscription
routerSubscriptions.delete(
  `${pathRoot}/delete/:id`,
  verifyToken,
  allowRoles(acctionsSubscriptions),
  deleteSubscription
);

export default routerSubscriptions;
