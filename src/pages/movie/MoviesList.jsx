import { useEffect } from "react";
import MovieCard from "../../hooks/MovieCard";
import useMovies from "../../hooks/useMovies";

function MovieList() {
  const { movieList, getMovieList, handleDelete, isLoading } = useMovies();

  useEffect(() => {
    getMovieList();
    console.log("MovieList component mounted");
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex text-center align-items-center justify-content-center vh-100 text-bold ">
        Yukleniyor...
      </div>
    );
  }

  return (
    <>
      <div className="hero is-fullheight">
        <div className="columns is-multiline m-4 ">
          {movieList.map((movie) => (
            <div
              key={movie.id}
              className="column is-justify-content-center is-one-third text-center "
            >
              <MovieCard {...movie} handleDelete={handleDelete} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
export default MovieList;
