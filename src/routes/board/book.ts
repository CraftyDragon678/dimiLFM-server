import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { Books, IBookPayload, IBookPopulated } from '../../models/boardModel';
import { Chats } from '../../models/chatModel';

const router = Router();

router.post('/', expressAsyncHandler(async (req, res) => {
  const {
    grades, beforePrice, afterPrice, ...data
  }: IBookPayload = req.body;

  if (!grades.every((e) => e >= 0 && e <= 3 && Number.isInteger(e))) {
    return res.status(400).json({
      message: 'grades element must be integer and greater than or equal to zero and less than or equal to 3',
    });
  }

  if (!Number.isSafeInteger(beforePrice) || beforePrice < 0) {
    return res.status(400).json({
      message: 'beforePrice must be safe integer and positive',
    });
  }

  if (!Number.isSafeInteger(afterPrice) || afterPrice < 0) {
    return res.status(400).json({
      message: 'beforePrice must be safe integer and positive',
    });
  }

  const result = await Books.create({
    ...data,
    grades,
    beforePrice,
    afterPrice,
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
  grades: number[];
  subject: string;
  dates: Date[];
}

router.post('/search', expressAsyncHandler(async (req, res) => {
  const {
    option: {
      done, notdone, old, my,
    },
    tags,
    grades,
    subject,
    dates,
  }: SearchPayload = req.body;

  const isWithSubject = subject !== '전체' && subject !== '기타';

  const parsedDates = dates.map((e) => new Date(e));

  const result = await Books.find({
    $and: [
      {
        $or: [
          { done },
          { done: !notdone },
        ],
      },
      {
        tag: { $in: tags },
        ...isWithSubject && { subject },
        ...grades[0] !== 0 && { grades: { $in: grades }},
        ...my && { user: req.auth.oid },
        createdAt: { $gte: parsedDates[0], $lte: parsedDates[1] },
      },
    ],
  }).sort({ createdAt: old ? 1 : -1 })
    .select('title user done grades tag afterPrice createdAt content')
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
  const result: IBookPopulated | null = await Books.findById(req.params.id)
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
  const target = await Books.findById(id);
  if (!target) return res.status(404).json({ message: 'Not Found' });

  await Books.updateOne({ _id: id }, {
    $set: {
      done: !target.done,
    },
  });

  return res.json({ done: !target.done });
}));

export default router;
