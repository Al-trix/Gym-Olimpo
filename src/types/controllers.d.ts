import type { Request, Response } from "express";
import type { UserType } from "./libs";
export type AdminController = {
  adminLogin: (req: Request, res: Response) => void;
  adminRegister: (req: Request, res: Response) => void;
  adminUpdate: (req: Request, res: Response) => void;
  adminDelete: (req: Request, res: Response) => void;
  adminLogout: (req: Request, res: Response) => void;
};

export type AdminBody = {
  fullName: string;
  email: string;
  password: string;
  role: UserType;
  document: string;
}

export type AdminLoginBody = {
  email: string;
  password: string;
}

