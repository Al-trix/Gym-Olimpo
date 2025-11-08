import type { Request, Response } from "express";
export type AdminController = {
  adminLogin: (req: Request, res: Response) => void;
  adminRegister: (req: Request, res: Response) => void;
  adminUpdate: (req: Request, res: Response) => void;
  adminDelete: (req: Request, res: Response) => void;
  adminLogout: (req: Request, res: Response) => void;
};

export type adminBodys = {
  fullName: string;
  email: string;
  password: string;
  role: string;
  document: string;
}

