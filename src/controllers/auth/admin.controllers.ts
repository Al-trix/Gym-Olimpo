import prisma from '../../libs/prisma';
import { AdminController, adminBodys } from '../../types/controllers.d';

export const adminLogin: AdminController['adminLogin'] = (req, res) => {};

export const adminRegister: AdminController['adminRegister'] = (req, res) => {
  try {
    const { fullName, email, password, role, document }: adminBodys = req.body;

    
  } catch (err) {}
};

export const adminUpdate: AdminController['adminUpdate'] = (req, res) => {};

export const adminDelete: AdminController['adminDelete'] = (req, res) => {};

export const adminLogout: AdminController['adminLogout'] = (req, res) => {};

