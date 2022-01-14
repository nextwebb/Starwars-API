import { Request, Response } from 'express';
import { prisma } from '../services';
import { logger, truncateString } from '../utils';
import ip from 'ip';

const postComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { comment, movie_title, episode_id } = req.body as {
      comment: string;
      movie_title: string;
      episode_id: number;
    };

    const movieComment = await prisma.comment.create({
      data: {
        episodeId: episode_id,
        content: truncateString(comment, 500),
        movie: movie_title,
        ip: ip.address(),
      },
    });

    res.status(200);
    res.json({ success: true, movieComment });
  } catch (err) {
    logger.error('POST /comments prisma error');
    res.status(500);
    res.json({ success: false, msg: err.message, err });
  } finally {
    await prisma.$disconnect();
  }
};

export default postComment;
