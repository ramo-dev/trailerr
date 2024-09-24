import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, Calendar, Info, User } from "lucide-react";
import { Link } from "react-router-dom";
import noPhoto from "../assets/nophoto.webp";
import ErrorBoundary from "./Error";
import Loader from "./Loading";
import useThemeStore from "../store/ThemeStore";

const fetchMovies = async () => {
  const api = `${import.meta.env.VITE_MOVIEDB_ENDPOINT}`;
  const key = import.meta.env.VITE_MOVIEDB_API_KEY;

  const resp = await fetch(api, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${key}`
    },
  });

  if (!resp.ok) {
    throw new Error("Network response was not okay!");
  }

  const data = await resp.json();
  return data.results;
};

async function getMovieTrailer(id) {
  const trailerApi = `${import.meta.env.VITE_MOVIEDB_VIDEOS}${id}/videos`;
  const key = import.meta.env.VITE_MOVIEDB_API_KEY;

  try {
    const resp = await fetch(trailerApi, {
      headers: {
        Authorization: `Bearer ${key}`,
      },
    });
    const data = await resp.json();
    return data.results.find((video) => video.type === 'Trailer');
  } catch (err) {
    console.log(err);
    return null;
  }
}

export default function MovieList() {
  const [randomMovie, setRandomMovie] = useState(null);
  const [randomMovieTrailer, setRandomMovieTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark } = useThemeStore();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["movies"],
    queryFn: fetchMovies,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const random = Math.floor(Math.random() * data.length);
      setRandomMovie(data[random]);

      const fetchTrailer = async () => {
        const trailer = await getMovieTrailer(data[random].id);
        setRandomMovieTrailer(trailer);
      };
      fetchTrailer();
    }
  }, [data]);



  useEffect(() => {
    function detectScreenScroll() {
      if (window.scrollY > 15) {
        setScrolled(true);
      }
      else {
        setScrolled(false);
      }
    }
    window.addEventListener("scroll", detectScreenScroll);

    return () => window.removeEventListener("scroll", detectScreenScroll)
  }, [])




  useEffect(() => {
    let timer;
    if (randomMovie) {
      timer = setTimeout(() => {
        setShowTrailer(true);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [randomMovie]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorBoundary />;
  }

  return (
    <div>
      {randomMovie && (
        <div className="w-full">
          {/* Hero Section */}
          <div className="relative h-screen">
            {showTrailer && randomMovieTrailer ? (
              <iframe
                src={`https://www.youtube.com/embed/${randomMovieTrailer.key}`}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                aria-controls="hidden"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={
                  randomMovie.backdrop_path
                    ? `${import.meta.env.VITE_MOVIEDB_BACKDROP}${randomMovie.backdrop_path}`
                    : noPhoto
                }
                alt={randomMovie.title || "No Title Available"}
                className="w-full h-full object-cover"
              />
            )}
            <div className={`absolute md:bottom-14 bottom-28 left-0 p-8 w-full w-full rounded-lg bg-gradient-to-t from-black to-transparent transition-all duration-500 ease-in-out  ${scrolled ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
              <h1 className="text-5xl font-bold mb-4 text-white">{randomMovie.title}</h1>
              <p className="text-xl mb-6 text-white text-ellipse">{randomMovie.overview}</p>
              <div className="flex space-x-4 mb-6">
                <button className="bg-white text-black py-2 px-6 rounded flex items-center hover:bg-opacity-80 transition">
                  <Bookmark className="mr-2" /> Save
                </button>
                <Link to={`/${randomMovie.id}`}>
                  <button className="bg-gray-500 bg-opacity-50 text-white py-2 px-6 rounded flex items-center hover:bg-opacity-70 transition">
                    <Info className="mr-2" /> More Info
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={`${isDark ? "bg-black py-10 text-white" : "bg-white py-10"}`} >
        <h1 className="text-4xl my-8 md:ms-10 ms-2 font-bold">People are also watching</h1>
        <div className="md:px-10 px-2 mx-auto flex flex-wrap gap-6 w-full">

          {data ? data.map((item) => (
            <Link to={`/${item.id}`} key={item.id}>
              <div className={`${isDark ? "bg-black border-neutral-800" : "bg-white border-gray-300"} border p-4 hover:shadow-md md:max-w-[400px] h-full`}>
                <img
                  loading="lazy"
                  src={`${import.meta.env.VITE_MOVIEDB_IMAGES}${item.poster_path}`}
                  alt={item.title}
                  className="rounded-lg object-cover h-60 w-full mb-4"
                />
                <h2 className={`text-lg font-semibold mb-1 ${isDark ? "text-gray-200" : "text-gray-800"}`}>{item.title}</h2>
                <p className={`${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}>{item.overview}</p>
                <div className={`flex items-center text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}>
                  <User className="mr-1" />
                  <span>{item.original_language}</span>
                  <span className="mx-2">|</span>
                  <Calendar className="mr-1" />
                  <span>{item.release_date}</span>
                </div>
              </div>
            </Link>
          )) : "No movies available"}
        </div>
      </div>
    </div>
  );
}
