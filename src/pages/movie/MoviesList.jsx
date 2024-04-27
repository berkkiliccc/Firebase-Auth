import { useEffect } from "react";
import MovieCard from "../../components/MovieCard";
import useMovies from "../../hooks/useMovies";

function MovieList() {
  const { movieList, getMovieList, handleDelete } = useMovies();

  useEffect(() => {
    getMovieList();
    console.log("MovieList component mounted");
  }, []);

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
