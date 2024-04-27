import { Link } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import MovieCard from "../components/MovieCard";
import useMovies from "../hooks/useMovies";
import useSeries from "../hooks/useSeries";

function Profile() {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);

  const [activeTab, setActiveTab] = useState("movies");

  const moviesCollectionRef = collection(db, "Movies");
  const seriesCollectionRef = collection(db, "Series");

  const { handleDelete: handleMovieDelete } = useMovies();
  const { handleDelete: handleSeriesDelete } = useSeries();

  useEffect(() => {
    getMovies();
  }, []);

  const onClickDelete = async (itemId) => {
    console.log("delete");
    try {
      if (activeTab === "movies") {
        await handleMovieDelete(itemId);
        getMovies();
      } else if (activeTab === "series") {
        await handleSeriesDelete(itemId);
        getSeries();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getMovies = async () => {
    try {
      const q = query(
        moviesCollectionRef,
        where("userId", "==", auth.currentUser.uid),
        orderBy("createdAt", "desc")
      );
      const response = await getDocs(q);
      const filteredData = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMovies(filteredData);
      setActiveTab("movies");
    } catch (error) {
      console.log(error);
    }
  };

  const getSeries = async () => {
    try {
      const q = query(
        seriesCollectionRef,
        where("userId", "==", auth.currentUser.uid),
        orderBy("createdAt", "desc")
      );
      const response = await getDocs(q);
      const filteredData = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSeries(filteredData);
      setActiveTab("series");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="hero is-fullheight d-flex ">
      {auth.currentUser ? (
        <div className="title has-text-black text-center mt-3 ">
          {auth.currentUser.displayName}
          <div className="has-align-items-center justify-content-center d-flex mt-2">
            <figure className="image is-128x128">
              <img
                className="is-rounded"
                src={auth.currentUser.photoURL}
                alt="Placeholder image"
              />
            </figure>
          </div>
          <nav
            className="breadcrumb is-centered justify-content-center mt-6 "
            aria-label="breadcrumbs"
          >
            <ul>
              <li>
                <button className="button is-ghost" onClick={() => getMovies()}>
                  Filmler
                </button>
              </li>
              <li>
                <button className="button is-ghost" onClick={() => getSeries()}>
                  Diziler
                </button>
              </li>
            </ul>
          </nav>
          <div className="columns is-multiline m-4 subtitle ">
            {(activeTab === "movies" ? movies : series)
              .filter((item) => auth.currentUser.uid === item.userId)
              .map((item) => (
                <div
                  key={item.id}
                  className="column is-justify-content-center is-one-third  "
                >
                  <MovieCard
                    {...item}
                    handleDelete={() => onClickDelete(item.id)}
                  />
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="hero is-fullheight">
          <div className="hero-body d-flex is-align-items-center is-justify-content-center text-center">
            <div className="container  ">
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
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
