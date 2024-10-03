import { Button, Dialog, IconButton, Skeleton } from "@radix-ui/themes";
import { FilmIcon, SearchIcon, XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useThemeStore } from "../store/store";

const fetchArticles = async (query) => {
  const api = `https://api.themoviedb.org/3/search/multi?query=${query}`;
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
  return data.results;
};

export default function Search() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [sticky, setSticky] = useState(false);
  const { isDark } = useThemeStore();
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

  useEffect(() => {
    function showOnScroll() {
      if (window.scrollY > 50) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    }

    window.addEventListener("scroll", showOnScroll);

    return () => window.removeEventListener("scroll", showOnScroll);
  }, []);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton variant="solid" size="3" radius="full"
          className="cursor-pointer">
          <SearchIcon />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content
        maxWidth="750px"
        className={`${isDark ? "!bg-black/80 !border-0" : "bg-white"} max-h-screen no-scroll`}>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search..."
          className={`sticky top-0 border p-2 rounded-full flex-1 focus:ring-gray-300 px-4 w-full ${isDark ? "!bg-black/80 text-white" : "bg-white"}`}
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
                <Skeleton className={`w-full h-[50px] my-4  ${isDark ? "!bg-gray-800 text-white" : ""}`} />

                <Skeleton className={`w-full h-[50px] my-4  ${isDark ? "!bg-gray-800 text-white" : ""}`} />
                <Skeleton className={`w-full h-[50px] my-4  ${isDark ? "!bg-gray-800 text-white" : ""}`} />
                <Skeleton className={`w-full h-[50px] my-4  ${isDark ? "!bg-gray-800 text-white" : ""}`} />
              </>
            ) : (
              data && data.length > 0 ? (
                data.map((item, index) => (
                  <Dialog.Close>
                    <Link to={`/movie/${item.id}`} key={index} className="block">
                      <div className="flex items-center gap-4 p-4 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg my-4 transition">
                        {item.poster_path ? (
                          <img
                            src={`${import.meta.env.VITE_MOVIEDB_IMAGES}${item.poster_path}`}
                            alt={item.name || item.title}
                            className="w-[120px] h-[120px] object-cover rounded"
                          />
                        ) : (
                          <div className="bg-gray-200 dark:bg-gray-700 w-[80px] h-[120px] flex items-center justify-center rounded">
                            <FilmIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200">{item.name || item.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 line-clamp-2">{item.overview}</p>
                        </div>
                      </div>
                    </Link>
                  </Dialog.Close>
                ))
              ) : (
                <div className="flex items-center text-center gap-2 items-center justify-center my-4 text-gray-500 dark:text-gray-400">
                  <FilmIcon />
                  <h1>No results found, try searching for something else.</h1>
                </div>
              )
            )}
          </div>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
