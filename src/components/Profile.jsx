import { Link } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

function Profile() {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);

  const [activeTab, setActiveTab] = useState("movies");

  const moviesCollectionRef = collection(db, "Movies");
  const seriesCollectionRef = collection(db, "Series");

  useEffect(() => {
    getMovies();
  }, []);

  const getMovies = async () => {
    try {
      const response = await getDocs(moviesCollectionRef);
      const filteredData = response.docs.map((doc) => ({
        id: doc.id,
        movieName: doc.data().movieName,
        movieTopic: doc.data().movieTopic,
        createTime: doc.data().createTime,
        movieYear: doc.data().movieYear,
        photoUrl: doc.data().photoUrl,
        createdAt: doc.data().createdAt,
        userId: doc.data().userId,
        userPhotoUrl: doc.data().userPhotoUrl,
        platform: doc.data().platform,
      }));
      setMovies(filteredData);
      setActiveTab("movies");
    } catch (error) {
      console.log(error);
    }
  };

  const getSeries = async () => {
    try {
      const response = await getDocs(seriesCollectionRef);
      const filteredData = response.docs.map((doc) => ({
        id: doc.id,
        seriesName: doc.data().seriesName,
        seriesTopic: doc.data().seriesTopic,
        createTime: doc.data().createTime,
        seriesYear: doc.data().seriesYear,
        photoUrl: doc.data().photoUrl,
        createdAt: doc.data().createdAt,
        userId: doc.data().userId,
        userPhotoUrl: doc.data().userPhotoUrl,
        platform: doc.data().platform,
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
              <li>
                <button className="button is-ghost ">Kullanıcı Bilgisi</button>
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
                  <div className="card " style={{ height: "99%" }}>
                    <div className="card-image">
                      <figure className="image is-4by3">
                        <img
                          src={
                            activeTab === "movies"
                              ? item.photoUrl
                              : item.photoUrl
                          }
                          alt="Placeholder image"
                          style={{
                            borderRadius: "5px",
                            objectFit: "contain",
                          }}
                        />
                      </figure>
                    </div>

                    <div className="card-content">
                      <div className="media">
                        <div className="media-right">
                          <figure className="image is-48x48 ">
                            <img
                              src={
                                activeTab === "movies"
                                  ? item.userPhotoUrl
                                  : item.userPhotoUrl
                              }
                              alt=""
                              className="is-rounded"
                            />
                          </figure>
                        </div>
                        <div className="media-content d-flex is-align-items-center is-justify-content-center">
                          <div className="title is-4 has-text-black ">
                            <Link
                              style={{ textDecoration: "none" }}
                              className="has-text-link"
                              to={
                                activeTab === "movies"
                                  ? `/movie/${item.id}`
                                  : `/series/${item.id}`
                              }
                            >
                              {activeTab === "movies"
                                ? item.movieName
                                : item.seriesName}
                            </Link>

                            <div className="card-content d-flex is-align-items-center is-justify-content-center">
                              <p className="subtitle is-6 ">
                                @
                                {item.createdAt
                                  .replaceAll(" ", "")
                                  .toLowerCase()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="card-content d-flex is-align-items-center is-justify-content-center "
                      style={{ height: 200 }}
                    >
                      {activeTab === "movies"
                        ? item.movieTopic
                        : item.seriesTopic}
                      .
                      <br />
                    </div>
                    <div className="card-content d-flex is-align-items-center is-justify-content-center">
                      <a>
                        #
                        {activeTab === "movies"
                          ? item.movieName.replaceAll(" ", "").toLowerCase()
                          : item.seriesName.replaceAll(" ", "").toLowerCase()}
                      </a>
                    </div>

                    <div className="card-content  ">
                      <a>
                        {`${
                          activeTab === "movies"
                            ? "Film Çıkış Yılı"
                            : "Dizi Çıkış Yılı"
                        }`}{" "}
                        {activeTab === "movies"
                          ? item?.movieYear
                          : item.seriesYear}
                      </a>
                      <br />
                      <a>Oluşturulma Tarihi: {item?.createTime}</a>
                    </div>

                    {auth.currentUser.uid === item.userId && (
                      <footer className="card-footer ">
                        <button
                          className="button is-link m-1 card-footer-item"
                          // onClick={() => handleEdit(movie.id)}
                        >
                          Düzenle
                        </button>
                        <button
                          // onClick={() => handleDelete(movie.id)}
                          className="button is-danger m-1 card-footer-item"
                        >
                          Sil
                        </button>
                      </footer>
                    )}
                  </div>
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
