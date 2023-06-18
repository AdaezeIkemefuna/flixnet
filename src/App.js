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
  const [showMobile, setShowMobile] = useState(false);

  //pagination
  const [pageNumber, setPageNumber] = useState(0);
  const bulletinsPerPage = 6;
  const pagesVisited = pageNumber * bulletinsPerPage;

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          setPageNumber(0);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found!");
          setMovies(data.Search);
          console.log(data.Search);

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
    [query]
  );

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

  //mobile view
  console.log(showMobile);

  const handleMobile = () => {
    setShowMobile((prev) => !prev);
    console.log("clicked");
  };

  return (
    <>
      <NavBar query={query} setQuery={setQuery} movies={movies} />

      <main className="main">
        <div className="box">
          {isLoading && <Loader />}
          {!movies.length && !error && (
            <div className="loader initial">
              Search for your favourite movies!
            </div>
          )}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              onSelect={handleMovieId}
              pagesVisited={pagesVisited}
              bulletinsPerPage={bulletinsPerPage}
              setPageNumber={setPageNumber}
              setShowMobile={setShowMobile}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </div>

        <div className="box movie-details">
          {selectId ? (
            <MovieDetails
              selectId={selectId}
              onClose={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
              handleMobile={handleMobile}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} setShowMobile={setShowMobile} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </div>

        {showMobile ? (
          <div className="mobile">
            <div className="box mobile-box">
              {selectId ? (
                <MovieDetails
                  selectId={selectId}
                  onClose={handleCloseMovie}
                  onAddWatched={handleAddWatched}
                  watched={watched}
                />
              ) : (
                <>
                  <WatchedSummary
                    watched={watched}
                    setShowMobile={setShowMobile}
                  />
                  <WatchedMoviesList
                    watched={watched}
                    onDeleteWatched={handleDeleteWatched}
                  />
                </>
              )}
            </div>
          </div>
        ) : undefined}
      </main>
    </>
  );
}
