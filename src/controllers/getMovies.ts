import { Request, Response } from 'express';
import { prisma } from '../services';
import { logger, getCommentsCountGroup, swapiService } from '../utils';

export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const dataArray = [];

    const movies = await swapiService('films');

    for (const movie in movies.data.results) {
      const data: any = {};
      data['title'] = movies.data.results[movie].title;
      data['opening_crawl'] = movies.data.results[movie].opening_crawl;
      data['release_date'] = movies.data.results[movie].release_date;
      data['episode_id'] = movies.data.results[movie].episode_id;
      data['counts_of_comments'] = await getCommentsCountGroup(
        movies.data.results[movie].episode_id
      );

      dataArray.push(data);
    }

    const sortedActivities = dataArray.sort(
      (a: { release_date: number }, b: { release_date: number }) =>
        b.release_date - a.release_date
    );

    res.status(200);
    res.json({ success: true, sortedActivities });
  } catch (err) {
    logger.error('GET /movies/ prisma error');
    res.status(500);
    res.json({ success: false, msg: err.message, err });
  } finally {
    await prisma.$disconnect();
  }
};

export default getMovies;
