import { Request, Response } from 'express';
import { prisma } from '../services';
import { logger } from '../utils';

export const getComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const movieComment = await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.status(200);
    res.json({ success: true, movieComment });
  } catch (err) {
    logger.error('GET /comments prisma error');
    res.status(500);
    res.json({ success: false, msg: err.message, err });
  } finally {
    await prisma.$disconnect();
  }
};

export default getComments;
