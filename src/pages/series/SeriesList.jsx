import { useEffect } from "react";

import MovieCard from "../../components/MovieCard";
import useSeries from "../../hooks/useSeries";

function SeriesList() {
  const { seriesList, getSeriesList, handleDelete } = useSeries();

  useEffect(() => {
    getSeriesList();
    console.log("SeriesList component mounted");
  }, []);

  return (
    <>
      <div className="hero is-fullheight">
        <div className="columns is-multiline m-4">
          {seriesList.map((series) => (
            <div
              key={series.id}
              className="column is-justify-content-center is-one-third  "
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
