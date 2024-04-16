import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MovieList() {
  const [movieList, setMovieList] = useState([]);

  useEffect(() => {
    getMovieList();
    console.log("MovieList component mounted");
  }, []);

  const moviesCollectionRef = collection(db, "Movies");

  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        id: doc.id,
        Name: doc.data().Name,
        Topic: doc.data().Topic,
        CreateTime: doc.data().CreateTime,
        Year: doc.data().Year,
        PhotoUrl: doc.data().PhotoUrl,
        createdAt: doc.data().createdAt,
        userId: doc.data().userId,
      }));

      setMovieList(filteredData);
      console.log("MovieList =>", filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="columns is-multiline">
      {movieList.map((movie) => (
        <div key={movie.id} className="column is-one-third">
          <div className="card mt-6 " style={{ height: 600 }}>
            <div className="card-image">
              <figure className="image is-4by3 ">
                <img
                  style={{
                    objectFit: "fill",
                  }}
                  src={movie.PhotoUrl}
                  alt="Placeholder image"
                />
              </figure>
            </div>
            <div className="card-content">
              <div className="media">
                <div className="media-left">
                  <figure className="image is-48x48 ">
                    <img
                      src={auth.currentUser.photoURL}
                      alt=""
                      className="is-rounded"
                    />
                  </figure>
                </div>
                <div className="media-content">
                  <p className="title is-4 has-text-black ">
                    <Link to={`/movie/${movie.id}`}>{movie.Name}</Link>
                  </p>
                  {movie.createdAt && (
                    <p className="subtitle is-6 mt-3">
                      {movie.createdAt.replaceAll(" ", "").toLowerCase()}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="content p-3 ">
              {movie.Topic}.
              <br />
              <a> #{movie.Name.replaceAll(" ", "").toLowerCase()}</a>
              <br />
            </div>
            {auth.currentUser.uid === movie.userId && (
              <div>
                <button className="button is-primary  is-fullwidth">
                  Düzenle
                </button>
                <div>
                  <button className="button is-danger  is-fullwidth">
                    Sil
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
export default MovieList;
