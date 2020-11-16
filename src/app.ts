import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes';
import { IError } from './types/error';

const app = express();

morgan.token(
  'remote-addr',
  (req) => (
    (req.headers['x-real-ip'] as string)
    || (req.headers['x-forwarded-for'] as string)
    || (req.connection.remoteAddress as string)
  ),
);
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'));
app.use(cors({
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use('/', router);

app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
  if (err.type === 'entity.parse.failed') {
    res.send({ success: false, code: 400, msg: 'Invalid json type' });
  } else {
    // eslint-disable-next-line no-console
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.data,
    });
  }
});

export default app;
