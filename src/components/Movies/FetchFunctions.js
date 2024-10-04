
//Function to fetch all Movies
export const fetchMovies = async (id) => {
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




//Function to fetch movie Trailers
export async function getMovieTrailer(id) {
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

//Fetch related movies
export const fetchRelated = async (id) => {
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

//Fetch Trending Movies
export const fetchTrending = async () => {
  const api = `https://api.themoviedb.org/3/trending/all/week?language=en-US
`;
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



//Function to fetch query from the search bar
export const fetchQuery = async (query) => {
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
