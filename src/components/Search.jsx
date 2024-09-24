
import { Button, Dialog, Skeleton } from "@radix-ui/themes";
import { MessageCircleQuestion, SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";


const fetchArticles = async (query) => {
  const api = `${import.meta.env.VITE_MOVIEDB_ENDPOINT}/everything?q=${query}`;
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

export default function Search() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const { data, isLoading } = useQuery({
    queryKey: ['articles', debouncedSearch],
    queryFn: () => fetchArticles(debouncedSearch),
    enabled: !!debouncedSearch
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button radius="full" variant="ghost" size="4" className="!h-8 !w-5 cursor-pointer">
          <SearchIcon className="h-12 w-12 cursor-pointer" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="750px" className="rounded-full">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="border p-2 rounded-full flex-1 focus:ring-gray-300 px-4 w-full"
        />

        {!search.length ? (
          <div className="flex text-center gap-2 items-center justify-center my-4 text-gray-500">
            <SearchIcon />
            <h2>Search titles from your favourite movies</h2>
          </div>
        ) : (
          <div>
            {isLoading ? (
              <>
                <Skeleton className="w-full h-[50px] my-4" />
                <Skeleton className="w-full h-[50px] my-4" />
                <Skeleton className="w-full h-[50px] my-4" />
                <Skeleton className="w-full h-[50px] my-4" />
              </>


            ) : (
              data && data.length > 0 ? (
                data.map((movie, index) => (
                  <Link to={`/${slugify(movie?.title)}`} key={index}>
                    <div className="p-2 border-b">
                      <h3 className="font-semibold">{movie.title}</h3>
                      <p className="text-gray-600">{movie.description}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex items-center text-center gap-2 items-center justify-center my-4 text-gray-500">
                  <MessageCircleQuestion />
                  <h1>No Movies available, try searching for something else.</h1>
                </div>

              )
            )}
          </div>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
