import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import Users from '../../models/userModel';
import loginAsDimigoIn from '../../utils/dimigoinLogin';
import { jwtSecret } from '../../../config.json';

const router = Router();

interface ILoginPayload {
  id: string;
  password: string;
}

router.post('/', expressAsyncHandler(async (req, res) => {
  const { id, password }: ILoginPayload = req.body;

  const user = await Users.findOne({ uid: id });

  if (user) {
    if (user.verifyPassword(password)) {
      const token = jwt.sign({ oid: user.oid }, jwtSecret);
      return res.json({ token });
    }
    return res.status(401).json({
      message: '아이디 또는 패스워드가 잘못되었습니다.',
    });
  }

  const identity = await loginAsDimigoIn(id, password);
  if (!identity) {
    return res.status(401).json({
      message: '아이디 또는 패스워드가 잘못되었습니다.',
    });
  }

  const {
    // eslint-disable-next-line camelcase
    email, name, serial, user_type: type, idx: oid,
  } = identity;

  Users.createUser({
    email, name, serial, type, oid, password, uid: id,
  });
  const token = jwt.sign({ oid }, jwtSecret);

  return res.json({ token });
}));

export default router;
