import type { Request, Response, NextFunction } from 'express'
import type { UserType } from '@prisma/client'

//? Types of createToken
export type CreateToken = (payload: { id: string}, role: UserType, nameCookie: string, res: Response) => void

//? Types of verifyToken
export type Middleware = (req: Request<BodyToken>, res: Response, next: NextFunction) => void
export type BodyToken = {
  data: string,
  role: UserType,
}

