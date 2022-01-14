const getMovieEpisodeIds = (
  movies: Array<{
    release_date: string | number | Date;
    title: string;
    opening_crawl: string;
    episode_id: number;
  }>
): number[] => {
  return movies.map(({ episode_id }) => episode_id);
};

export default getMovieEpisodeIds;
