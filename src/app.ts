import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes';
import { IError } from './types/error';
import morgan from './middleware/morgan';

const app = express();

app.use(morgan);
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://cragon.kro.kr:3000',
  ],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use('/', router);

app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
  if (err.type === 'entity.parse.failed') {
    res.json({ success: false, code: 400, msg: 'Invalid json type' });
  } else {
    // eslint-disable-next-line no-console
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.data,
    });
  }
});

export default app;
