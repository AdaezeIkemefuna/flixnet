import { useState, useEffect } from "react";
import StarRating from "../../StarRating";
import Loader from "./Loader";

const KEY = "878a8fff856f6992866822cc5cee102c";

export default function MovieDetails({
  selectId,
  onClose,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((movie) => movie.id).includes(selectId);
  const watchedUserRating = watched.find(
    (movie) => movie.id === selectId
  )?.userRating;
  const {
    title,
    release_date: year,
    poster_path: poster,
    runtime,
    vote_average,
    overview: plot,
    release_date: released,
    production_companies,
    genres,
    adult,
    tagline,
    spoken_languages,
  } = movie;

  const producers = production_companies?.map((prod) => {
    return <span>{prod.name + ", "}</span>;
  });

  const genre = genres?.map((genre) => {
    return <span>{genre.name + ","}</span>;
  });

  const languages = spoken_languages?.map((lang) => {
    return <span>{lang.english_name + ", "}</span>;
  });
  useEffect(
    function () {
      async function fetchMovieDetail() {
        setLoading(true);
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${selectId}?api_key=${KEY}`
        );

        const data = await res.json();

        setMovie(data);
        setLoading(false);
      }
      fetchMovieDetail();
    },
    [selectId]
  );
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectId,
      title,
      year,
      poster,
      imdbRating: Number(vote_average),
      runtime: runtime,
      userRating,
    };

    onAddWatched(newWatchedMovie);
    onClose();
  }

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "Flixnet";
      };
    },
    [title]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onClose}>
              &larr;
            </button>

            <img
              src={`https://image.tmdb.org/t/p/original/${poster}`}
              alt={`Poster of ${movie}`}
            />
            <div className="details-overview">
              <h2>
                {title} {adult ? <span>🔞</span> : ""}
              </h2>
              <i>{tagline}</i>
              <p>
                {released} &bull; {runtime}mins
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {vote_average} IMDB Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={15}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie {watchedUserRating} <span>⭐️</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Directed by: {producers}</p>
            <p>Spoken Languages: {languages}</p>
          </section>
        </>
      )}
    </div>
  );
}
