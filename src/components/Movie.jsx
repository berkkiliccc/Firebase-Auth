import { collection, deleteDoc, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, auth } from "../config/firebase";
import { Link, useNavigate, useParams } from "react-router-dom";

function Movie() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getMovie();
  }, []);

  const moviesCollectionRef = collection(db, "Movies");
  const getMovie = async () => {
    try {
      const docRef = doc(moviesCollectionRef, movieId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMovie(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log("Error getting document:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(moviesCollectionRef, movieId));
      console.log("Document successfully deleted!");
      navigate("/");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  return (
    <div className="columns vh-100 ">
      {auth.currentUser ? (
        <div className="column is-full d-flex is-align-items-center is-justify-content-center  text-center ">
          <div className="card mt-6 " style={{ width: 600, height: 800 }}>
            <div className="card-image">
              <figure className="image is-4by3  ">
                <img
                  style={{
                    objectFit: "fill",
                  }}
                  src={movie?.PhotoUrl}
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
                  <p className="title is-4 has-text-black ">{movie?.Name}</p>
                  {movie?.createdAt && (
                    <p className="subtitle is-6 mt-2">
                      @{movie.createdAt.replaceAll(" ", "").toLowerCase()}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="content p-3 ">
              {movie?.Topic}.
              <br />
              <a> #{movie?.Name.replaceAll(" ", "").toLowerCase()}</a>
              <br />
            </div>
            {auth.currentUser.uid === movie?.userId && (
              <div>
                <button className="button is-primary  is-fullwidth">
                  Düzenle
                </button>
                <div>
                  <button
                    onClick={handleDelete}
                    className="button is-danger  is-fullwidth"
                  >
                    Sil
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="container d-flex is-align-items-center is-justify-content-center  text-center vh-100 ">
          <div className="row  ">
            <div className="col-md-12 text-center ">
              <h1 className="text-center"></h1>
              <h1>
                Giriş yapmadınız <br />
                <span className="text-primary ">Giriş yapmak için</span>
              </h1>
              <button className="btn btn-primary">
                <Link to="/login" className="text-white">
                  Giriş Yap
                </Link>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Movie;
