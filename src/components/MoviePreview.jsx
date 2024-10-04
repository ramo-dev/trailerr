import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Calendar, Globe, Star, Film, Heart, Bookmark, Info, User } from "lucide-react";
import noPhoto from "../assets/nophoto.webp";
import GoBackBtn from "./GoBackBtn";
import Loader from "./Loading";
import { useMovieStore, useThemeStore } from "../store/store";
import useAuthState from "../hooks/useAuth";

const fetchMovies = async (id) => {
  const api = `https://api.themoviedb.org/3/movie/${id}`;
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

async function getMovieTrailer(id) {
  const trailerApi = `https://api.themoviedb.org/3/movie/${id}/videos`;
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
    return null;
  }
};


const fetchRelated = async (id) => {
  const api = `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`;
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


export default function MoviePreview() {
  const { id } = useParams();
  const { isDark } = useThemeStore();
  const [movieTrailer, setMovieTrailer] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const { movies, removeMovie, addMovie } = useMovieStore();

  const { user } = useAuthState();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['MovieTitle', id],
    queryFn: () => fetchMovies(id),
  });

  const { data: related, isLoading: relatedLoading } = useQuery({
    queryKey: ['Related', id],
    queryFn: () => fetchRelated(id),
  })

  useEffect(() => {
    const fetchTrailer = async () => {
      const trailer = await getMovieTrailer(id);
      const timeout = setTimeout(() => {
        setMovieTrailer(trailer);
      }, 4000);
      setTimeoutId(timeout);
    };
    fetchTrailer();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [id]);

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
  }, []);


  useEffect(() => {
    // Scroll to the top when a new movie is loaded
    window.scrollTo(0, 0);
  }, [id]);



  function checkIsAdded(id) {
    if (movies) {
      setIsAdded(!isAdded);
      const find = movies.find(itm => itm.id === id);
      setIsAdded(!!find);
    }
  }



  useEffect(() => {
    if (data && data.id) {
      checkIsAdded(data.id);
    }
  }, [data?.id, movies]);


  const handleAddMovie = () => {
    if (user && data) {
      addMovie(user.uid, data);
      setIsAdded(true);
    }
  };

  const handleRemoveMovie = () => {
    if (user && data) {
      removeMovie(user.uid, data.id);
      setIsAdded(false);
    }
  };


  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={`${isDark ? "bg-black" : "bg-white"} min-h-screen`}>
      <GoBackBtn />
      {isError && !isLoading ? <div className="flex justify-center items-center text-3xl h-screen bg-black text-white">Error Loading Movie</div>
        : data && (
          <div>
            {/* Hero Section */}
            <div className="relative h-screen">
              <div className={`${isDark ? "bg-gradient-to-t from-black absolute inset-0 to-transparent" : "bg-white"}`} />
              <div className="relative w-full h-full">
                {movieTrailer ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${movieTrailer.key}`}
                    frameBorder="0"
                    allow="autoplay; encrypted-media;"
                    allowFullScreen

                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={
                      data.backdrop_path
                        ? `${import.meta.env.VITE_MOVIEDB_BACKDROP}${data.backdrop_path}`
                        : noPhoto
                    }
                    alt={data.title || "No Title Available"}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>


              <div
                className={`absolute md:bottom-14 bottom-32 left-0 md:p-8 p-3 w-full rounded-lg bg-gradient-to-t from-black to-transparent transition-all duration-500 ease-in-out ${scrolled ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                  }`}
              >
                <h1 className={`text-5xl font-bold mb-4 text-white`}>{data.title}</h1>
                <p className={`text-xl mb-6 text-white`}>{data.tagline}</p>
                <div className="flex space-x-4 mb-6">
                  {user ?
                    isAdded ?
                      <button
                        onClick={handleRemoveMovie}
                        className="bg-white text-black py-2 px-6 rounded flex items-center hover:bg-opacity-80 transition">
                        <Film className="mr-2" /> Remove from List
                      </button>
                      : <button
                        onClick={handleAddMovie}
                        className="bg-white text-black py-2 px-6 rounded flex items-center hover:bg-opacity-80 transition">
                        <Bookmark className="mr-2" /> Save
                      </button>


                    : <Link to="/login">
                      <button
                        className="bg-white text-black py-2 px-6 rounded flex items-center hover:bg-opacity-80 transition">
                        Login to save
                      </button>

                    </Link>}
                  <a href="#info">
                    <button className="bg-gray-500 bg-opacity-50 text-white py-2 px-6 rounded flex items-center hover:bg-opacity-70 transition">
                      <Info className="mr-2" /> More Info
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Movie Details */}
            <div className={`md:px-8 px-3 py-12 ${isDark ? "text-white" : "text-black"}`} id="info">
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

      <h1 className={`${isDark ? "text-white" : ""} md:px-10 px-2 font-bold text-3xl my-4`}>People also watched</h1>
      <div className="md:px-10 px-2 mx-auto flex flex-wrap gap-6 w-full">
        {relatedLoading ? <div className="mx-auto"><Loader /></div> :
          related ? related.map((item) => (
            <Link to={`/movie/${item.id}`} key={item.id} className=" flex-1  md:min-w-[380px] min-w-[280px] w-full">
              <div className={`${isDark ? "bg-black border-neutral-800" : "bg-white border-gray-300"} border p-4 hover:shadow-md md:max-w-[400px] h-full transition-all duration-200 ease-in-out`}>
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
          )) : <p className={`${isDark ? "text-white" : ""} h-[10vh]`}>No movies available</p>}

      </div>
    </div>
  );
}
