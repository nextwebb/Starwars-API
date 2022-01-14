import { prisma } from '../services';

const getCommentsCountGroup = (episodeId: number) => {
  return prisma.comment.count({
    where: {
      episodeId,
    },
  });
};

export default getCommentsCountGroup;
