const getCommentsCount = (countGroup: any[], episodeId: any) => {
  const commentsCount = countGroup.find(
    (item: { episodeId: any }) => item.episodeId === episodeId
  );
  return commentsCount ? Number(commentsCount.count) : 0;
};

export default getCommentsCount;
