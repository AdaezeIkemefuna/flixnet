import ReactPaginate from "react-paginate";
import Movie from "./Movie";
import { useState } from "react";

export default function MovieList({
  movies,
  onSelect,
  pagesVisited,
  bulletinsPerPage,
  setPageNumber,
  setShowMobile,
}) {
  const pageCount = Math.ceil(movies?.length / bulletinsPerPage);
  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  //Sorting algorithm
  const [sortBy, setSortBy] = useState("input");

  let sortedMovies = movies;
  if (sortBy === "input") sortedMovies = movies;

  if (sortBy === "year")
    sortedMovies = movies
      .slice()
      .sort((a, b) => b.release_date.localeCompare(a.release_date));

  if (sortBy === "title")
    sortedMovies = movies.slice().sort((a, b) => a.title - b.title);

  if (sortBy === "popularity")
    sortedMovies = movies.slice().sort((a, b) => a.popularity - b.popularity);

  return (
    <div className="movie-container">
      <div className="sort-actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort</option>
          <option value="title">Sort by Title</option>
          <option value="popularity">Sort by popularity</option>
          <option value="year">Sort by latest release</option>
        </select>
      </div>
      <ul className="list list-movies">
        {sortedMovies
          ?.slice(pagesVisited, pagesVisited + bulletinsPerPage)
          ?.map((movie) => (
            <Movie
              movie={movie}
              key={movie.imdbID}
              onSelect={onSelect}
              setShowMobile={setShowMobile}
            />
          ))}
      </ul>

      {movies.length > 0 && (
        <div className="pagination">
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            pageCount={pageCount}
            onPageChange={handlePageChange}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            containerClassName={"pagination"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </div>
      )}
    </div>
  );
}
