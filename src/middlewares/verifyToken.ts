import {  Middleware } from "@/types/libs"
import { UserType } from "@prisma/client";
import jwt from 'jsonwebtoken';

const verifyToken: Middleware = (req, res, next) => {
  try {
    const { token__user } = req.cookies
   

    if (!token__user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if(!token__user.data) {
      return res.status(401).json({ message: 'Unauthorized its not have token' })
    }

    if(!token__user.role) {
      return res.status(401).json({ message: 'Unauthorized its not have role' })
    }

    if(token__user){
      const decoded = jwt.verify(token__user?.data, process.env.TOKEN_SECRET!);
      if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized' })
      }
    }

    if (token__user.role === UserType.ADMIN  && token__user) {
      const decoded = jwt.verify(token__user?.data, process.env.TOKEN_SECRET!);
      req.user = decoded 
      next()
    }

  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: 'Unauthorized' })
  }
  
}

export default verifyToken