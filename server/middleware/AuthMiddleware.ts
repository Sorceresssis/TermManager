import type{ NextFunction, Request, Response } from 'express';

import { AuthService } from '@/service/AuthService';


export const authMiddleware = (req: Request<any>, res: Response, next: NextFunction) => {
  const token = req.header('Authorization') ?? req.cookies['jwt'];

  if (!token) {
    return res.status(401).send({msg: 'No token provided'});
  }

  try {
    AuthService.verifyToken(token.replace('Bearer ', ''));
    next();
  } catch {
    return res.status(401).send({msg: 'Invalid token'});
  }
};
