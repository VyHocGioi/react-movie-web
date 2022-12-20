import { useQuery } from "@tanstack/react-query";
import { FC, useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import SearchBox from "../components/Common/SearchBox";
import Sidebar from "../components/Common/Sidebar";
import Title from "../components/Common/Title";
import MainHomeFilms from "../components/Home/MainHomeFilm";
import RecommendGenres from "../components/Home/RecommendGenres";
import TrendingNow from "../components/Home/TrendingNow";
import {
  getHomeMovies,
  getHomeTVs,
  getMovieBannerInfo,
  getTVBannerInfo,
} from "../services/home";
import { HomeFilms, Item } from "../shared/types";
import { getRandomAvatar } from "../shared/utils";
import { useAppSelector } from "../store/hooks";
const Home: FC = () => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [currentTab, setCurrentTab] = useState(
    localStorage.getItem("currentTab") || "tv"
  );
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const {
    data: dataMovie,
    isLoading: isLoadingMovie,
    isError: isErrorMovie,
    error: errorMovie,
  } = useQuery<HomeFilms, Error>(["home-movies"], getHomeMovies);

  const {
    data: dataMovieDetail,
    isLoading: isLoadingMovieDetail,
    isError: isErrorMovieDetail,
    error: errorMovieDetail,
  } = useQuery<any, Error>(
    ["detailMovies", dataMovie?.Trending],
    () => getMovieBannerInfo(dataMovie?.Trending as Item[]),
    { enabled: !!dataMovie?.Trending }
  );

  const {
    data: dataTV,
    isLoading: isLoadingTV,
    isError: isErrorTV,
    error: errorTV,
  } = useQuery<HomeFilms, Error>(["home-tvs"], getHomeTVs);

  const {
    data: dataTVDetail,
    isLoading: isLoadingTVDetail,
    isError: isErrorTVDetail,
    error: errorTVDetail,
  } = useQuery<any, Error>(
    ["detailTvs", dataTV?.Trending],
    () => getTVBannerInfo(dataTV?.Trending as Item[]),
    { enabled: !!dataTV?.Trending }
  );

  useEffect(() => {
    console.log(getRandomAvatar());
  });

  if (isErrorMovie) return <p>ERROR: {errorMovie.message}</p>;

  if (isErrorMovieDetail) return <p>ERROR: {errorMovieDetail.message}</p>;

  if (isErrorTV) return <p>ERROR: {errorTV.message}</p>;

  if (isErrorTVDetail) return <p>ERROR: {errorTVDetail.message}</p>;

  return (
    <>
      <Title value="Moonlight | Watching Website" />

      <div className="flex items-center justify-between px-5 my-5 md:hidden">
        <Link
          to="/"
          className="flex items-center gap-2">
          <LazyLoadImage
            src="/logo.png"
            className="object-cover w-10 h-10 rounded-full"
          />
          <p className="text-xl font-medium tracking-wider text-white uppercase">
            Moon<span className="text-primary">light</span>
          </p>
        </Link>
        <button onClick={() => setIsSidebarActive((prev) => !prev)}>
          <GiHamburgerMenu size={25} />
        </button>
      </div>

      <div className="flex items-start">
        <Sidebar
          setIsSidebarActive={setIsSidebarActive}
          isSidebarActive={isSidebarActive}
        />

        <div className="flex-grow md:pt-7 pt-0 pb-7 border-x md:px-[2vw] px-[4vw] border-gray-darken min-h-screen">
          <div className="flex items-center justify-between md:items-end">
            <div className="inline-flex gap-[40px] pb-[14px] border-b border-gray-darken relative">
              <button
                onClick={() => {
                  setCurrentTab("tv");
                  localStorage.setItem("currentTab", "tv");
                }}
                className={`${
                  currentTab === "tv" &&
                  "text-white font-medium after:absolute after:bottom-0 after:left-[13%] after:bg-white after:h-[3px] after:w-5"
                } transition duration-300 hover:text-white`}>
                TV Show
              </button>
              <button
                onClick={() => {
                  setCurrentTab("movie");
                  localStorage.setItem("currentTab", "movie");
                }}
                className={`${
                  currentTab === "movie" &&
                  "text-white font-medium after:absolute after:bottom-0 after:right-[9%] after:bg-white after:h-[3px] after:w-5"
                } transition duration-300 hover:text-white`}>
                Movie
              </button>
            </div>
            <div className="flex items-center gap-6">
              {/* <div className="w-6 h-6 border rounded-full cursor-pointer border-gray-lighten tw-flex-center">
                <IoMdNotificationsOutline size={17} />
              </div> */}
              <p>{currentUser?.displayName || "Anonymous"}</p>
              <LazyLoadImage
                src={
                  currentUser
                    ? (currentUser.photoURL as string)
                    : "/defaultAvatar.jpg"
                }
                alt="User avatar"
                className="object-cover rounded-full w-7 h-7"
                effect="opacity"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {currentTab === "movie" && (
            <MainHomeFilms
              data={dataMovie}
              dataDetail={dataMovieDetail}
              isLoadingBanner={isLoadingMovieDetail}
              isLoadingSection={isLoadingMovie}
            />
          )}
          {currentTab === "tv" && (
            <MainHomeFilms
              data={dataTV}
              dataDetail={dataTVDetail}
              isLoadingBanner={isLoadingTVDetail}
              isLoadingSection={isLoadingTV}
            />
          )}
        </div>

        <div className="shrink-0 max-w-[310px] w-full hidden lg:block px-6 top-0 sticky ">
          <SearchBox />
          <RecommendGenres currentTab={currentTab} />
          <TrendingNow />
        </div>
      </div>
    </>
  );
};

export default Home;
