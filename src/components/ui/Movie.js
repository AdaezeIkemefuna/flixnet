export default function Movie({ movie, onSelect, setShowMobile }) {
  return (
    <li
      onClick={() => {
        onSelect(movie.id);
        setShowMobile(true);
      }}
    >
      <img
        src={`https://image.tmdb.org/t/p/original/${movie?.poster_path}`}
        alt={`poster`}
      />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.release_date}</span>
        </p>
        <h5>View Details</h5>
      </div>
    </li>
  );
}
