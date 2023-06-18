import { useEffect, useState } from "react";
import NavBar from "./components/layout/Navbar";
import Loader from "./components/ui/Loader";
import MovieList from "./components/ui/MovieList";
import ErrorMessage from "./components/ui/Error";
import MovieDetails from "./components/ui/MovieDetails";
import WatchedSummary from "./components/ui/WatchedSummary";
import WatchedMoviesList from "./components/ui/WatchedMoviesList";

const KEY = "8dae2df9";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("");
  const [selectId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found!");
          setMovies(data.Search);
          setError("");
        } catch (err) {
          console.error(err.message);
          if (!err.name === "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      handleCloseMovie();
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query, pageNumber]
  );

  //   const handleScroll = () => {
  //   if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isLoading) {
  //     return;
  //   }
  //   fetchData();
  // };

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, [isLoading]);

  //Event Handlers
  function handleMovieId(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar query={query} setQuery={setQuery} movies={movies} />

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelect={handleMovieId} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectId ? (
            <MovieDetails
              selectId={selectId}
              onClose={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}
