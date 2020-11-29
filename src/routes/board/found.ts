import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { Founds, IFoundPayload } from '../../models/boardModel';

const router = Router();

router.post('/', expressAsyncHandler(async (req, res) => {
  const { foundDate: [from, to], radioIndex, ...data }: IFoundPayload = req.body;
  if (!(radioIndex >= 0 && radioIndex <= 2 && Number.isInteger(radioIndex))) {
    return res.status(400).json({
      message: 'radioIndex must be integer and greater than or 0 to zero and less than or equal to 2',
    });
  }

  const result = await Founds.create({
    ...data,
    from,
    to,
    radioIndex,
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

  const result = await Founds.find({
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
  }).sort({ createdAt: old ? 1 : -1 })
    .select('title user done createdAt content')
    .populate('user', '-_id serial name')
    .lean();

  return res.json({
    data: result.map(({ content, ...e }) => ({
      ...e,
      image: content.match(/src="(.*?)"/)?.[1],
    })),
  });
}));

export default router;
