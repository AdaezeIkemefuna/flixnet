export default function Movie({ movie, onSelect, setShowMobile }) {
  return (
    <li
      onClick={() => {
        onSelect(movie.imdbID);
        setShowMobile(true);
      }}
    >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
        <h5>View Details</h5>
      </div>
    </li>
  );
}
