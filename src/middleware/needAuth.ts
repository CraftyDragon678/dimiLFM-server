import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../../config.json';

const needAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (req.cookies.token) {
    req.auth = jwt.verify(req.cookies.token, jwtSecret) as never;
    next();
  } else {
    res.status(401).send();
  }
};

export default needAuth;
