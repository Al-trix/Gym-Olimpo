import { Router } from 'express';
import {
  authLogin,
  authRegister,
  authUpdate,
  authDelete,
  authLogout,
} from '../controllers/users.controllers';
import verifyToken from '../middlewares/verifyToken';

//* Routers
const routerAuth = Router();
const pathRoot = '/api/auth/';

//? route and controller for users login
routerAuth.get(`${pathRoot}/login`, authLogin);

//? route and controller for users register
routerAuth.post(`${pathRoot}/register`, authRegister);

//? route and controller for users update
routerAuth.put(`${pathRoot}/update/:id`, verifyToken, authUpdate);

//? route and controller for users delete
routerAuth.delete(`${pathRoot}/delete/:id`, verifyToken, authDelete);

//? route and controller for users logout
routerAuth.get(`${pathRoot}/logout/:id`, verifyToken, authLogout);

export default routerAuth;
