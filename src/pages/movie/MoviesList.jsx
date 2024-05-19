import { useEffect } from "react";
import MovieCard from "../../hooks/MovieCard";
import useMovies from "../../hooks/useMovies";

function MovieList() {
  const { movieList, getMovieList, handleDelete, isLoading } = useMovies();

  useEffect(() => {
    getMovieList();
  }, []);

  if (isLoading) {
    return (
      <div className=" hero is-fullheight d-flex text-center align-items-center justify-content-center  text-bold ">
        Yukleniyor...
      </div>
    );
  }

  return (
    <>
      <div className="hero is-fullheight">
        <div className="columns is-multiline mt-2 mb-2">
          {movieList.map((movie) => (
            <div key={movie.id} className="column is-half  ">
              <MovieCard {...movie} handleDelete={handleDelete} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
export default MovieList;
