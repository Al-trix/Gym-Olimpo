import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { CreateToken, BodyToken } from '../types/libs.d'

const createToken: CreateToken = (payload, role, nameCookie, res) => {
  try {

    const payloadToken = jwt.sign(payload, process.env.TOKEN_SECRET!, { expiresIn: '3d' })
    
    const body: BodyToken = {
      data: payloadToken,
      role: role,
    }
    
    res.cookie(nameCookie, body, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    
  } catch (err) {
    console.log(err)
    throw new Error('Error creating token')
  
  }
}

export default createToken