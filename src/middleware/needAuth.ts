import { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { jwtSecret } from '../../config.json';

const needAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (req.cookies.token) {
    try {
      req.auth = jwt.verify(req.cookies.token, jwtSecret) as never;
      next();
    } catch (e) {
      if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError ) {
        res.status(401).json({ message: 'token error' });
      }
    }
  } else {
    res.status(401).json({ message: 'need auth' });
  }
};

export default needAuth;
