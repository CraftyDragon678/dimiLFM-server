import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { Losts, ILostPayload } from '../../models/boardModel';

const router = Router();

router.post('/', expressAsyncHandler(async (req, res) => {
  const { lostDate: [from, to], ...data }: ILostPayload = req.body;

  const result = await Losts.create({
    ...data,
    from,
    to,
    user: req.auth.oid,
  });
  return res.json({ _id: result._id });
}));

interface SearchPayload {
  option: {
    done: boolean;
    notdone: boolean;
    old: boolean;
    my: boolean;
  };
  tags: string[];
  dates: Date[];
  location: string[];
}

router.post('/search', expressAsyncHandler(async (req, res) => {
  const {
    option: {
      done, notdone, old, my,
    },
    tags,
    dates,
    location,
  }: SearchPayload = req.body;

  const parsedDates = dates.map((e) => new Date(e));

  const result = await Losts.find({
    $and: [
      {
        $or: [
          { done },
          { done: !notdone },
        ],
      },
      {
        tag: { $in: tags },
        ...location.length && { foundLocation: { $in: location } },
        ...my && { user: req.auth.oid },
        $or: [
          { createdAt: { $gte: parsedDates[0], $lte: parsedDates[1] } },
          { from: { $lte: parsedDates[1] } },
          { to: { $gte: parsedDates[0] } },
        ],
      },
    ],
  }).sort({ createdAt: old ? -1 : 1 })
    .select('title user done createdAt')
    .populate('user', '-_id serial name');

  return res.json({ data: result });
}));

export default router;
