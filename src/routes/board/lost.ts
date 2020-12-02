import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { Losts, ILostPayload, ILostPopulated } from '../../models/boardModel';
import { Chats } from '../../models/chatModel';

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
  }).sort({ createdAt: old ? 1 : -1 })
    .select('title user done createdAt content')
    .populate('user', '-_id serial name type')
    .lean();

  return res.json({
    data: result.map(({ content, ...e }) => ({
      ...e,
      image: content.match(/src="(.*?)"/)?.[1],
    })),
  });
}));

router.get('/:id', expressAsyncHandler(async (req, res) => {
  const result: ILostPopulated | null = await Losts.findById(req.params.id)
    .populate('user', 'name serial type profileimage').lean();
  if (!result) return res.status(404).json({ message: 'Not Found' });

  return res.json({
    ...result,
    user: {
      ...result.user,
      _id: undefined,
    },
    chatRoomExist: !!await Chats.findOne({
      $or: [
        { from: req.auth.oid },
        { to: req.auth.oid },
      ],
      ref: req.params.id,
    }),
    mine: req.auth.oid === result.user._id,
  });
}));

router.put('/:id/done', expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const target = await Losts.findById(id);
  if (!target) return res.status(404).json({ message: 'Not Found' });

  await Losts.updateOne({ _id: id }, {
    $set: {
      done: !target.done,
    },
  });

  return res.json({ done: !target.done });
}));

export default router;
