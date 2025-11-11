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

//? route and controller for views subscriptions
routerSubscriptions.get(
  `${pathRoot}/views`,
  verifyToken,
  allowRoles([UserType.COACH, UserType.RECEPTIONIST, UserType.LEADER_COACHS]),
  viewSubscriptions
);

//? route and controller for view one subscription
routerSubscriptions.get(
  `${pathRoot}/view/:id`,
  verifyToken,
  allowRoles([UserType.COACH, UserType.RECEPTIONIST, UserType.LEADER_COACHS]),
  viewOneSubscription
);

//? route and controller for create subscription
routerSubscriptions.post(
  `${pathRoot}/create/:idCreatedBy`,
  verifyToken,
  allowRoles([UserType.COACH, UserType.RECEPTIONIST, UserType.LEADER_COACHS]),
  createSubscription
);

//? route and controller for update subsription
routerSubscriptions.put(
  `${pathRoot}/update/:id`,
  verifyToken,
  allowRoles([UserType.COACH, UserType.RECEPTIONIST, UserType.LEADER_COACHS]),
  updateSubscription
);

//? route and controller for delete subscription
routerSubscriptions.delete(
  `${pathRoot}/delete/:id`,
  verifyToken,
  allowRoles([UserType.COACH, UserType.RECEPTIONIST, UserType.LEADER_COACHS]),
  deleteSubscription
);

export default routerSubscriptions;
