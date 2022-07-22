import axios from "../shared/axios";

export const getSearchKeyword = async (query: string): Promise<string[]> => {
  return (
    await axios.get("/search/keyword", {
      params: {
        query,
      },
    })
  ).data.results
    .map((item: any) => item.name)
    .filter((_: any, index: number) => index < 5);
};

export const getRecommendGenres = async (): Promise<
  { id: number; name: string }[]
> => {
  const movieGenres = (await axios.get("/genre/movie/list")).data.genres;
  const tvGenres = (await axios.get("/genre/tv/list")).data.genres;

  return movieGenres.concat(tvGenres);
};