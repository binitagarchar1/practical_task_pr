import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || 'jwtsecret', (err: any) => {
    if (err) {
      res.sendStatus(403);
    } else {
      next();
    }
  });
};

export const authorizeRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.sendStatus(401);
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET || 'jwtsecret', (err: any, decoded: any) => {
      if (err) {
        res.sendStatus(403);
      } else {
        if (roles.length && !roles.includes(decoded.role)) {
          res.sendStatus(403);
        } else {
          next();
        }
      }
    });
  };
};
