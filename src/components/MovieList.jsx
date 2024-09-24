import { useState, useEffect } from "react";
import { Card } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ExternalLink, User } from "lucide-react";
import { Link } from "react-router-dom";
import noPhoto from "../assets/nophoto.webp";
import ErrorBoundary from "./Error";
import Loader from "./Loading";

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
  console.log(data)
  return data.results;
};



export default function MovieList() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["movies"],
    queryFn: fetchMovies,
    staleTime: 5 * 60 * 4000,
    retry: false,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError && !isLoading) {
    return <ErrorBoundary />;
  }

  return (
    <div className="container max-w-6xl px-3 mx-auto my-10 flex flex-wrap gap-6">
      {data ? data.map((item) => (
        <Link to={`/${item.id}`} key={item.id}>
          <Card className="flex flex-col p-4 rounded-lg hover:shadow-md md:max-w-[400px] h-full">
            <img
              loading="lazy"
              src={`${import.meta.env.VITE_MOVIEDB_IMAGES + item.poster_path}`}
              alt={item.title}
              className="rounded-lg object-cover h-60 w-full mb-4"
            />
            <h2 className="text-lg font-semibold mb-1">{item.title}</h2>
            <p className="text-gray-600 mb-2">{item.overview}</p>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <User className="mr-1" />
              <span>{item.original_language}</span>
              <span className="mx-2">|</span>
              <Calendar className="mr-1" />
              <span>{item.release_date}</span>
            </div>
          </Card>
        </Link>
      )) : "No movies available"}
    </div>
  );
}

