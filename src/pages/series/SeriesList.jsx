import { useEffect } from "react";

import MovieCard from "../../hooks/MovieCard";
import useSeries from "../../hooks/useSeries";

function SeriesList() {
  const { seriesList, getSeriesList, handleDelete, isLoading } = useSeries();

  useEffect(() => {
    getSeriesList();
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
        <div className="columns is-multiline m-4">
          {seriesList.map((series) => (
            <div
              key={series.id}
              className="column is-justify-content-center is-one-third text-center "
            >
              <MovieCard {...series} handleDelete={handleDelete} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SeriesList;
