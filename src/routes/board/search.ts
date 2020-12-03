import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { Founds, Losts, Markets } from '../../models/boardModel';

const router = Router();

router.get('/', expressAsyncHandler(async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: 'give me the query' });

  const regex = new RegExp(query.toString());

  const aggregate = (board: string) => [
    {
      $lookup: {
        from: 'users',
        let: { id: '$user' },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$id'] } } },
          { $project: { _id: 0, name: 1, serial: 1, type: 1 } },
        ],
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $match: {
        $or: [
          { title: regex },
          { content: regex },
          { tag: regex },
          { 'user.name': regex },
        ],
      },
    },
    {
      $project: {
        done: 1,
        title: 1,
        content: 1,
        tag: 1,
        user: 1,
        board,
      },
    },
  ];

  return res.json([
    ...await Founds.aggregate(aggregate('found')),
    ...await Losts.aggregate(aggregate('lost')),
    ...await Markets.aggregate(aggregate('market')),
  ]);
}));

export default router;
