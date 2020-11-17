import { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { jwtSecret } from '../../config.json';

const needAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (req.cookies.token) {
    try {
      req.auth = jwt.verify(req.cookies.token, jwtSecret) as never;
    } catch (e) {
      if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError ) {
        res.status(401).send();
      }
    }
    next();
  } else {
    res.status(401).send();
  }
};

export default needAuth;
