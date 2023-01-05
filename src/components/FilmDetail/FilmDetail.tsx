import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { FC, useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { AiFillHeart } from "react-icons/ai";
import { BsFillPlayFill, BsShareFill, BsThreeDots } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useCurrentViewportView } from "../../hooks/useCurrentViewportView";
import { db } from "../../shared/firebase";
import { DetailMovie, DetailTV, FilmInfo } from "../../shared/types";
import { resizeImage } from "../../shared/utils";
import { useAppSelector } from "../../store/hooks";
import RightbarFilms from "../Common/RightbarFilms";
import SearchBox from "../Common/SearchBox";
import Sidebar from "../Common/Sidebar";
import SidebarMini from "../Common/SidebarMini";
import Skeleton from "../Common/Skeleton";
import Title from "../Common/Title";
import FilmTabInfo from "./FilmTabInfo";
const FilmDetail: FC<FilmInfo> = ({ similar, videos, detail, ...others }) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { isMobile } = useCurrentViewportView();
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const unsubDoc = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
      setIsBookmarked(
        doc.data()?.bookmarks.some((item: any) => item.id === detail?.id)
      );
    });

    return () => unsubDoc();
  }, [currentUser, detail?.id]);

  const bookmarkedHandler = async () => {
    if (!detail) return;

    if (!currentUser) {
      toast.error("You need to sign in to bookmark films", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      return;
    }

    await updateDoc(doc(db, "users", currentUser.uid), {
      bookmarks: !isBookmarked
        ? arrayUnion({
            poster_path: detail?.poster_path,
            id: detail?.id,
            vote_average: detail?.vote_average,
            media_type: detail?.media_type,
            ...(detail?.media_type === "movie" && { title: detail?.title }),
            ...(detail?.media_type === "tv" && { name: detail?.name }),
          })
        : arrayRemove({
            poster_path: detail?.poster_path,
            id: detail?.id,
            vote_average: detail?.vote_average,
            media_type: detail?.media_type,
            ...(detail?.media_type === "movie" && { title: detail?.title }),
            ...(detail?.media_type === "tv" && { name: detail?.name }),
          }),
    });

    toast.success(
      `${
        !isBookmarked
          ? "This film is now bookmarked"
          : "This film is removed from your bookmarks"
      }`,
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  };

  return (
    <>
      {detail && (
        <Title
          value={`${
            (detail as DetailMovie).title || (detail as DetailTV).name
          } | TVFLIX`}
        />
      )}

      <div className="flex items-center justify-between px-5 my-3 md:hidden">
        <Link to="/" className="flex items-center gap-2">
          <LazyLoadImage
            src="/tvflix.png"
            className="object-cover w-10 h-10 rounded-full"
          />
          <p className="text-xl font-medium tracking-wider text-white uppercase">
            TV<span className="text-primary">flix</span>
          </p>
        </Link>
        <button onClick={() => setIsSidebarActive((prev) => !prev)}>
          <GiHamburgerMenu size={25} />
        </button>
      </div>

      <ToastContainer />

      <div className="flex flex-col md:flex-row">
        {!isMobile && <SidebarMini />}
        {isMobile && (
          <Sidebar
            setIsSidebarActive={setIsSidebarActive}
            isSidebarActive={isSidebarActive}
          />
        )}

        <div className="flex-grow min-h-screen">
          {!detail && (
            <Skeleton className="h-[400px] rounded-bl-2xl "></Skeleton>
          )}
          {detail && (
            <div
              style={{
                backgroundImage: `url(${resizeImage(detail.backdrop_path)})`,
              }}
              className="bg-cover bg-center bg-no-repeat md:h-[400px] h-[300px] rounded-bl-2xl relative"
            >
              <div className="h-full bg-gradient-to-br from-transparent to-black/70 rounded-bl-2xl">
                <div className="flex flex-col md:flex-row bottom-[-85%] md:bottom-[-20%]  items-start absolute left-1/2 -translate-x-1/2  w-full max-w-[1000px] ">
                  <div className="flex items-center gap-5">
                    <div className="shrink-0 w-[185px] ml-3 md:ml-0">
                      <LazyLoadImage
                        src={resizeImage(detail.poster_path, "w185")}
                        effect="opacity"
                        className="object-cover w-full h-full rounded-md"
                        alt="Poster"
                      />
                    </div>
                    {isMobile && (
                      <Link
                        to="watch"
                        className="flex items-center gap-6 py-3 pl-6 pr-12 mt-24 text-white transition duration-300 rounded-full bg-primary hover:bg-blue-600 "
                      >
                        <BsFillPlayFill size={25} />
                        <span className="text-lg font-medium">WATCH</span>
                      </Link>
                    )}
                  </div>

                  <div className="flex-grow mt-6 ml-6 md:ml-14 md:mt-0">
                    <div className="flex items-end md:h-28">
                      <h1 className=" text-white text-[45px] font-bold leading-tight ">
                        {(detail as DetailMovie).title ||
                          (detail as DetailTV).name}
                      </h1>
                    </div>
                    <ul className="flex flex-wrap gap-3 mt-3 md:mt-7">
                      {detail.genres.slice(0, 3).map((genre) => (
                        <li key={genre.id} className="mb-3">
                          <Link
                            to={`/explore?genre=${genre.id}`}
                            className="px-3 py-1 font-medium uppercase transition duration-300 border border-gray-300 rounded-full md:px-5 md:py-2 md:text-white hover:brightness-75"
                          >
                            {genre.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {!isMobile && (
                    <Link
                      to="watch"
                      className="flex items-center gap-6 py-3 pl-6 pr-12 mt-24 text-white transition duration-300 rounded-full bg-primary hover:bg-blue-600 "
                    >
                      <BsFillPlayFill size={25} />
                      <span className="text-lg font-medium">WATCH</span>
                    </Link>
                  )}
                </div>
                <div className="flex gap-3 absolute top-[5%] right-[3%]">
                  <button
                    onClick={bookmarkedHandler}
                    className={`tw-flex-center h-12 w-12 rounded-full border-[3px] border-white shadow-lg hover:border-primary transition duration-300 group ${
                      isBookmarked && "!border-primary"
                    }`}
                  >
                    <AiFillHeart
                      size={20}
                      className={`text-white group-hover:text-primary transition duration-300 ${
                        isBookmarked && "!text-primary"
                      }`}
                    />
                  </button>
                  {!isMobile && (
                    <>
                      {/* <button className="tw-flex-center h-12 w-12 rounded-full border-[3px] border-white shadow-lg hover:border-primary transition duration-300 group">
                        <BsShareFill
                          size={20}
                          className="text-white transition duration-300 group-hover:text-primary"
                        />
                      </button> */}
                      {/* <button className="tw-flex-center h-12 w-12 rounded-full border-[3px] border-white shadow-lg hover:border-primary transition duration-300 group">
                        <BsThreeDots
                          size={20}
                          className="text-white transition duration-300 group-hover:text-primary"
                        />
                      </button> */}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="relative z-20 flex flex-col mt-32 md:flex-row md:mt-0">
            {!isMobile && (
              <div className="shrink-0 md:max-w-[150px] w-full flex items-center md:flex-col justify-center flex-row gap-20 mt-20 md:border-r border-dark-lighten pt-16">
                <div className="flex flex-col items-center gap-6">
                  <p className="text-lg font-medium text-white">RATING</p>
                  {!isMobile && (
                    <div className="w-16">
                      {detail && (
                        <CircularProgressbar
                          value={detail.vote_average}
                          maxValue={10}
                          text={`${detail.vote_average.toFixed(1)}`}
                          styles={buildStyles({
                            textSize: "25px",
                            pathColor: `rgba(81, 121, 255, ${
                              (detail.vote_average * 10) / 100
                            })`,
                            textColor: "#fff",
                            trailColor: "transparent",
                            backgroundColor: "#5179ff",
                          })}
                        />
                      )}
                      {!detail && (
                        <Skeleton className="w-16 h-16 rounded-full" />
                      )}
                    </div>
                  )}
                  {isMobile && detail && (
                    <p className="-mt-3 text-2xl">
                      {detail.vote_average.toFixed(1)}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-center gap-3">
                  {detail && (
                    <>
                      <p className="text-lg font-medium text-white">
                        {detail.media_type === "movie"
                          ? "RUNTIME"
                          : "EP LENGTH"}
                      </p>
                      <div className="flex items-center gap-2">
                        {detail.media_type === "movie" && (
                          <p className="text-2xl">
                            {(detail as DetailMovie).runtime}
                          </p>
                        )}
                        {detail.media_type === "tv" && (
                          <p className="text-2xl">
                            {(detail as DetailTV).episode_run_time[0]}
                          </p>
                        )}
                        <span>min</span>
                      </div>
                    </>
                  )}
                  {!detail && (
                    <>
                      <p className="text-lg font-medium text-white">RUNTIME</p>
                      <Skeleton className="h-6 w-14" />
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex-grow min-h-[500px] md:border-r border-dark-lighten md:px-16 px-5 md:py-7 pt-40">
              {/* {!detail && <Skeleton className="w-full h-[500px]" />} */}
              <FilmTabInfo detail={detail} {...others} />
            </div>

            <div className="shrink-0 md:max-w-[300px] w-full px-6 pt-6">
              <p className="mb-5 text-lg font-medium text-white">MEDIA</p>
              <ul className="flex flex-col md:gap-[30px] gap-6">
                {videos &&
                  videos.slice(0, 2).map((video) => (
                    <li key={video.id}>
                      <div className="relative h-0 pb-[56.25%]">
                        {/* <YouTube
                          videoId={video.key}
                          opts={{ height: "100%", width: "100%" }}
                        /> */}
                        <iframe
                          frameBorder="0"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          title="Video trailer"
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${video.key}?enablejsapi=1&amp;origin=http%3A%2F%2Flocalhost%3A3000&amp;widgetid=1`}
                          id="widget2"
                          className="absolute top-0 left-0 !w-full !h-full"
                        ></iframe>
                      </div>
                      <p className="mt-3 overflow-hidden text-lg whitespace-nowrap text-ellipsis">
                        {video.name}
                      </p>
                    </li>
                  ))}
                {!videos &&
                  [...new Array(2)].map((_, index) => (
                    <li key={index}>
                      <div className="w-full h-0 pb-[56.25%] relative">
                        <Skeleton className="absolute w-full h-full" />
                      </div>
                      <Skeleton className="h-6 w-[70%] mt-3" />
                    </li>
                  ))}
              </ul>
            </div>

            {isMobile && (
              <div className="shrink-0 md:max-w-[150px] w-full flex items-center md:flex-col justify-center flex-row gap-20  md:border-r border-dark-lighten md:pt-16 pt-0 md:mt-20 mt-8">
                <div className="flex flex-col items-center gap-6">
                  <p className="text-lg font-medium text-white">RATING</p>
                  {!isMobile && (
                    <div className="w-16">
                      {detail && (
                        <CircularProgressbar
                          value={detail.vote_average}
                          maxValue={10}
                          text={`${detail.vote_average.toFixed(1)}`}
                          styles={buildStyles({
                            textSize: "25px",
                            pathColor: `rgba(81, 121, 255, ${
                              (detail.vote_average * 10) / 100
                            })`,
                            textColor: "#fff",
                            trailColor: "transparent",
                            backgroundColor: "#5179ff",
                          })}
                        />
                      )}
                      {!detail && (
                        <Skeleton className="w-16 h-16 rounded-full" />
                      )}
                    </div>
                  )}
                  {isMobile && detail && (
                    <p className="-mt-3 text-2xl">
                      {detail.vote_average.toFixed(1)}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-center gap-3">
                  {detail && (
                    <>
                      <p className="text-lg font-medium text-white">
                        {detail.media_type === "movie"
                          ? "RUNTIME"
                          : "EP LENGTH"}
                      </p>
                      <div className="flex items-center gap-2">
                        {detail.media_type === "movie" && (
                          <p className="text-2xl">
                            {(detail as DetailMovie).runtime}
                          </p>
                        )}
                        {detail.media_type === "tv" && (
                          <p className="text-2xl">
                            {(detail as DetailTV).episode_run_time[0]}
                          </p>
                        )}
                        <span>min</span>
                      </div>
                    </>
                  )}
                  {!detail && (
                    <>
                      <p className="text-lg font-medium text-white">RUNTIME</p>
                      <Skeleton className="h-6 w-14" />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 md:max-w-[310px] w-full relative px-6">
          {!isMobile && <SearchBox />}
          {/* <RecommendGenres /> */}
          <RightbarFilms
            name="Similar"
            films={similar?.filter((item) => item.id !== detail?.id)}
            limitNumber={4}
            isLoading={!similar}
            className="mt-12 md:mt-24"
          />
        </div>
      </div>
    </>
  );
};

export default FilmDetail;
