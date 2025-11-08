import { Router } from 'express';
import {
  adminLogin,
  adminRegister,
  adminUpdate,
  adminDelete,
  adminLogout,
} from '../../controllers/auth/admin.controllers';

//* Routers
const routerAdmin = Router();
const pathRoot = '/api/auth/admin';

//? route and controller for admin login
routerAdmin.get(`${pathRoot}/login`, adminLogin);

//? route and controller for admin register
routerAdmin.post(`${pathRoot}/register`, adminRegister);

//? route and controller for admin update
routerAdmin.put(`${pathRoot}/profile`, adminUpdate);

//? route and controller for admin delete
routerAdmin.delete(`${pathRoot}/delete`, adminDelete);

//? route and controller for admin logout
routerAdmin.get(`${pathRoot}/logout`, adminLogout);

export default routerAdmin;
