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

export default function MovieList() {
  const [randomMovie, setRandomMovie] = useState(null);
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
      setRandomMovie(random);
    }
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorBoundary />;
  }

  return (
    <div>
      {data && randomMovie !== null && ( // Ensure randomMovie is set
        <div className="w-full">
          {/* Hero Section */}
          <div className="relative h-screen">
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
            <img
              src={
                data[randomMovie]?.backdrop_path
                  ? `${import.meta.env.VITE_MOVIEDB_BACKDROP}${data[randomMovie].backdrop_path}`
                  : noPhoto
              }
              alt={data[randomMovie]?.title || "No Title Available"}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-14 left-0 p-8 w-full md:w-2/3">
              <h1 className="text-5xl font-bold mb-4 text-white">{data[randomMovie]?.title}</h1>
              <p className="text-xl mb-6 text-white">{data[randomMovie]?.overview}</p>
              <div className="flex space-x-4 mb-6">
                <button className="bg-white text-black py-2 px-6 rounded flex items-center hover:bg-opacity-80 transition">
                  <Bookmark className="mr-2" /> Play
                </button>
                <Link to={`/${data[randomMovie]?.id}`}>
                  <button className="bg-gray-500 bg-opacity-50 text-white py-2 px-6 rounded flex items-center hover:bg-opacity-70 transition">
                    <Info className="mr-2" /> More Info
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={`${isDark ? "bg-black py-10" : "bg-white py-10"} px-10 mx-auto flex flex-wrap gap-6 w-full`}>
        {data ? data.map((item) => (
          <Link to={`/${item.id}`} key={item.id}>
            <div className={`${isDark ? "bg-black border-gray-500" : "bg-white border-gray-300"} border p-4 rounded-lg hover:shadow-md md:max-w-[400px] h-full`}>
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
  );
}
