import { useAutoAnimate } from "@formkit/auto-animate/react";
import { FunctionComponent, useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link, useSearchParams } from "react-router-dom";
import SearchBox from "../components/Common/SearchBox";
import Sidebar from "../components/Common/Sidebar";
import Title from "../components/Common/Title";
import SearchResult from "../components/Search/SearchResult";
import { useCurrentViewportView } from "../hooks/useCurrentViewportView";

interface SearchProps {}
// https://raw.githubusercontent.com/fuocy/video/master/Studio%20Project%20%E2%80%94%20Kapwing.mp4
const Search: FunctionComponent<SearchProps> = () => {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const { isMobile } = useCurrentViewportView();
  const [searchParams, setSearchParams] = useSearchParams();
  const [openSearchFilter, setOpenSearchFilter] = useState(true);
  const [parent] = useAutoAnimate();
  const query = searchParams.get("query");
  const page = searchParams.get("page") || 1;
  const [currentTab, setCurrentTab] = useState("multi");
  return (
    <>
      {!query && <Title value="Search | Moonlight" />}
      {query && <Title value={`Search: ${query} | Moonlight`} />}

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

      {/* <div className="z-10 pb-5 bg-black/90"> */}
      <div className="flex flex-col-reverse min-h-screen md:flex-row">
        {/* <SidebarMini /> */}
        <Sidebar
          setIsSidebarActive={setIsSidebarActive}
          isSidebarActive={isSidebarActive}
        />
        <div className="flex-grow">
          <div
            className={`relative z-30 md:max-w-[50vw] w-full mx-auto translate-y-[120px] transition duration-300 text-xl ${
              query && "!translate-y-0"
            }`}>
            <h1
              className={`text-white text-[25px] font-medium text-center absolute md:-top-6 -top-14 left-0 right-0  ${
                query ? "opacity-0 invisible" : "opacity-100 visible"
              } transition duration-500`}>
              Find your favourite movies, TV shows, people and more
            </h1>
            <SearchBox autoFocus />
          </div>

          {!query && (
            <div className="mt-[250px] flex justify-center">
              <LazyLoadImage
                src="/girl.png"
                alt=""
                effect="opacity"
                className="max-w-[700px] w-[80vw] object-cover rounded-xl "
              />
            </div>
          )}
          {isMobile && query && (
            <div className="shrink-0 md:max-w-[310px] w-full md:pt-32 pt-[104px] px-3">
              <div
                // @ts-ignore
                ref={parent}
                className="px-4 pt-3 rounded-md shadow-md bg-dark-lighten">
                <div className="flex items-center justify-between pb-3 text-white">
                  <p className="text-lg ">Search Results</p>
                  <button onClick={() => setOpenSearchFilter((prev) => !prev)}>
                    {openSearchFilter && <FiChevronDown size={20} />}
                    {!openSearchFilter && <FiChevronRight size={20} />}
                  </button>
                </div>
                {openSearchFilter && (
                  <div className="flex flex-row gap-3 py-2 text-lg text-white border-t md:py-6 border-dark-darken md:flex-col">
                    <button
                      onClick={() => {
                        setSearchParams({ query: query || "", page: "1" });
                        setCurrentTab("multi");
                      }}
                      className={`w-full hover:bg-dark-lighten-2  py-1 rounded-md transition duration-300 ${
                        currentTab === "multi" && "bg-dark-lighten-2"
                      }`}>
                      <span>All</span>
                    </button>
                    <button
                      onClick={() => {
                        setSearchParams({ query: query || "", page: "1" });
                        setCurrentTab("movie");
                      }}
                      className={`w-full hover:bg-dark-lighten-2  py-1 rounded-md transition duration-300 ${
                        currentTab === "movie" && "bg-dark-lighten-2"
                      }`}>
                      <span>Movie</span>
                    </button>
                    <button
                      onClick={() => {
                        setSearchParams({ query: query || "", page: "1" });
                        setCurrentTab("tv");
                      }}
                      className={`w-full hover:bg-dark-lighten-2  py-1 rounded-md transition duration-300 ${
                        currentTab === "tv" && "bg-dark-lighten-2"
                      }`}>
                      <span>TV Show</span>
                    </button>
                    <button
                      onClick={() => {
                        setSearchParams({ query: query || "", page: "1" });
                        setCurrentTab("person");
                      }}
                      className={`w-full hover:bg-dark-lighten-2  py-1 rounded-md transition duration-300 ${
                        currentTab === "person" && "bg-dark-lighten-2"
                      }`}>
                      <span>People</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          {query && (
            <SearchResult
              currentTab={currentTab}
              query={query}
              page={Number(page)}
            />
          )}
        </div>
        {!isMobile && (
          <div className="shrink-0 md:max-w-[310px] w-full md:pt-32 pt-4 px-3">
            <div
              // @ts-ignore
              ref={parent}
              className="px-4 pt-3 rounded-md shadow-md bg-dark-lighten">
              <div className="flex items-center justify-between pb-3 text-white">
                <p className="text-lg ">Search Results</p>
                <button onClick={() => setOpenSearchFilter((prev) => !prev)}>
                  {openSearchFilter && <FiChevronDown size={20} />}
                  {!openSearchFilter && <FiChevronRight size={20} />}
                </button>
              </div>
              {openSearchFilter && (
                <div className="flex flex-row gap-3 py-2 text-lg text-white border-t md:py-6 border-dark-darken md:flex-col">
                  <button
                    onClick={() => {
                      setSearchParams({ query: query || "", page: "1" });
                      setCurrentTab("multi");
                    }}
                    className={`w-full hover:bg-dark-lighten-2  py-1 rounded-md transition duration-300 ${
                      currentTab === "multi" && "bg-dark-lighten-2"
                    }`}>
                    <span>All</span>
                  </button>
                  <button
                    onClick={() => {
                      setSearchParams({ query: query || "", page: "1" });
                      setCurrentTab("movie");
                    }}
                    className={`w-full hover:bg-dark-lighten-2  py-1 rounded-md transition duration-300 ${
                      currentTab === "movie" && "bg-dark-lighten-2"
                    }`}>
                    <span>Movie</span>
                  </button>
                  <button
                    onClick={() => {
                      setSearchParams({ query: query || "", page: "1" });
                      setCurrentTab("tv");
                    }}
                    className={`w-full hover:bg-dark-lighten-2  py-1 rounded-md transition duration-300 ${
                      currentTab === "tv" && "bg-dark-lighten-2"
                    }`}>
                    <span>TV Show</span>
                  </button>
                  <button
                    onClick={() => {
                      setSearchParams({ query: query || "", page: "1" });
                      setCurrentTab("person");
                    }}
                    className={`w-full hover:bg-dark-lighten-2  py-1 rounded-md transition duration-300 ${
                      currentTab === "person" && "bg-dark-lighten-2"
                    }`}>
                    <span>People</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* </div> */}
    </>
  );
};

export default Search;
