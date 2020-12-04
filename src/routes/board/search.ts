import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
  Founds, IFoundPopulated,
  Losts, ILostPopulated,
  Markets, IMarketPopulated,
  Books, IBookPopulated,
} from '../../models/boardModel';

const router = Router();

router.get('/', expressAsyncHandler(async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: 'give me the query' });
  if (typeof query !== 'string') return res.status(400).json({ message: 'query must be string' });

  const aggregate = (board: string) => [
    {
      $lookup: {
        from: 'users',
        let: { id: '$user' },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$id'] } } },
          {
            $project: {
              _id: 0, name: 1, serial: 1, type: 1,
            },
          },
        ],
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        done: 1,
        title: 1,
        content: 1,
        tag: 1,
        user: 1,
        createdAt: 1,
        board,
      },
    },
  ];

  return res.json(
    [
      ...await Founds.aggregate(aggregate('found')) as IFoundPopulated[],
      ...await Losts.aggregate(aggregate('lost')) as ILostPopulated[],
      ...await Markets.aggregate(aggregate('market')) as IMarketPopulated[],
      ...await Books.aggregate(aggregate('book')) as IBookPopulated[],
    ].map((e) => ({
      ...e,
      image: e.content.match(/src="(.*?)"/)?.[1],
      content: e.content.replace(/<[^>]*>/g, ''),
    })).filter((e) => (
      e.title.includes(query)
        || e.content.includes(query)
        || e.tag.includes(query)
        || e.user.name.includes(query)
    )).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
  );
}));

export default router;
