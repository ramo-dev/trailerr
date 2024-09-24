import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Calendar, Globe, Star, Film, Heart, Play, Info, Bookmark } from "lucide-react";
import noPhoto from "../assets/nophoto.webp";
import GoBackBtn from "./GoBackBtn";
import Loader from "./Loading";
import useThemeStore from "../store/ThemeStore";

const fetchMovies = async (id) => {
  const api = `${import.meta.env.VITE_MOVIEDB_PREVIEW}${id}`;
  const key = import.meta.env.VITE_MOVIEDB_API_KEY;

  const resp = await fetch(api, {
    headers: {
      Authorization: `Bearer ${key}`,
    },
  });

  if (!resp.ok) {
    throw new Error('Network response was not okay!');
  }

  const data = await resp.json();
  return data;
};

export default function MoviePreview() {
  const { id } = useParams();
  const { isDark } = useThemeStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['MovieTitle', id],
    queryFn: () => fetchMovies(id),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <>
        <GoBackBtn />
        <div className="flex justify-center items-center text-3xl h-screen bg-black text-white">Error Loading Movie</div>
      </>
    );
  }

  return (
    <div className={`${isDark ? "bg-black" : "bg-white"} min-h-screen`}>
      <GoBackBtn />
      {data && (
        <div>
          {/* Hero Section */}
          <div className="relative h-screen">
            <div className={`${isDark ? "bg-gradient-to-t from-black absolute inset-0 to-transparent" : "bg-white "} `} />
            <img
              src={
                data.backdrop_path
                  ? `${import.meta.env.VITE_MOVIEDB_BACKDROP}${data.backdrop_path}`
                  : noPhoto
              }
              alt={data.title || "No Title Available"}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-14 left-0 p-8 w-full md:w-2/3">
              <h1 className={`text-5xl font-bold mb-4 text-white`}>{data.title}</h1>
              <p className={`text-xl mb-6 text-white`}>{data.tagline}</p>
              <div className="flex space-x-4 mb-6">
                <button className="bg-white text-black py-2 px-6 rounded flex items-center hover:bg-opacity-80 transition">
                  <Bookmark className="mr-2" /> Save
                </button>
                <a href="#info">
                  <button className="bg-gray-500 bg-opacity-50 text-white py-2 px-6 rounded flex items-center hover:bg-opacity-70 transition">
                    <Info className="mr-2" /> More Info
                  </button>
                </a>
              </div>
            </div>
          </div>

          {/* Movie Details */}
          <div className={`px-8 py-12 ${isDark ? "text-white" : "text-black"}`} id="info">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-2/3">
                <p className="text-lg mb-6">{data.overview}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    <span>Release: {data.release_date}</span>
                  </div>
                  <div className="flex items-center">
                    <Film className="w-5 h-5 mr-2 text-blue-600" />
                    <span>Runtime: {data.runtime} mins</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-blue-600" />
                    <span>Rating: {data.vote_average}/10</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-blue-600" />
                    <span>Language: {data.original_language.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/3">
                <h3 className="text-xl font-semibold mb-4">Genres</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {data.genres.map((genre) => (
                    <span key={genre.id} className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md">
                      {genre.name}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-semibold mb-4">Production</h3>
                <div className="space-y-2">
                  {data.production_companies.slice(0, 3).map((company) => (
                    <div key={company.id} className="flex items-center space-x-2">
                      {company.logo_path ? (
                        <img
                          src={`${import.meta.env.VITE_MOVIEDB_IMAGES}${company.logo_path}`}
                          alt={company.name}
                          className="w-8 h-8 object-contain bg-white rounded"
                        />
                      ) : (
                        <Globe className="w-8 h-8 text-gray-400" />
                      )}
                      <span>{company.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-10 py-4 border-t border-gray-800 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-blue-600" />
                <span className="text-sm">{data.vote_count} votes</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
