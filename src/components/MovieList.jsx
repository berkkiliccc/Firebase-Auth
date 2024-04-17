import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MovieList() {
  const [movieList, setMovieList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const [newMovieName, setNewMovieName] = useState("");
  const [newMovieTopic, setNewMovieTopic] = useState("");
  const [newMovieYear, setNewMovieYear] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");

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
        movieName: doc.data().movieName,
        movieTopic: doc.data().movieTopic,
        createTime: doc.data().createTime,
        movieYear: doc.data().movieYear,
        photoUrl: doc.data().photoUrl,
        createdAt: doc.data().createdAt,
        userId: doc.data().userId,
        userPhotoUrl: doc.data().userPhotoUrl,
      }));

      setMovieList(filteredData);
      // console.log("MovieList =>", filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const movieDoc = doc(moviesCollectionRef, id);
      await deleteDoc(movieDoc);
      console.log("Document successfully deleted!");
      getMovieList();
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  const handleEdit = async (id) => {
    try {
      console.log("Edit clicked", id);
      setSelectedMovieId(id);
      setOpenModal(true);

      const selectedMovie = movieList.find((movie) => movie.id === id);
      setNewMovieName(selectedMovie.movieName);
      setNewMovieTopic(selectedMovie.movieTopic);
      setNewMovieYear(selectedMovie.movieYear);
      setNewPhotoUrl(selectedMovie.photoUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const handleSave = async (id) => {
    try {
      const movieDoc = doc(moviesCollectionRef, id);
      await updateDoc(movieDoc, {
        movieName: newMovieName,
        movieTopic: newMovieTopic,
        movieYear: newMovieYear,
        photoUrl: newPhotoUrl,
        createTime: new Date().toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
      getMovieList();
      setOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {openModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeModal}></div>
          <div className="modal-card ">
            <header className="modal-card-head  ">
              <p className="modal-card-title has-text-grey-lighter">
                {
                  movieList.find((movie) => movie.id === selectedMovieId)
                    .movieName
                }
              </p>
              <button
                className="delete has-background-danger"
                aria-label="close"
                onClick={closeModal}
              />
            </header>
            <section className="modal-card-body">
              {movieList.map((movie) => (
                <div key={movie.id}>
                  {movie.id === selectedMovieId && (
                    <div>
                      <div className="field">
                        <label className="label">Film Adı</label>
                        <div className="control">
                          <input
                            className="input"
                            type="text"
                            value={newMovieName}
                            onChange={(e) => setNewMovieName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="field">
                        <label className="label">Film Konusu</label>
                        <div className="control">
                          <textarea
                            className="textarea"
                            value={newMovieTopic}
                            onChange={(e) => setNewMovieTopic(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="field">
                        <label className="label">Film Yılı</label>
                        <div className="control">
                          <input
                            className="input"
                            type="text"
                            value={newMovieYear}
                            onChange={(e) => setNewMovieYear(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="field">
                        <label className="label">Fotoğraf URL</label>
                        <div className="control">
                          <input
                            className="input"
                            type="text"
                            defaultValue={movie.photoUrl}
                            onChange={(e) => setNewPhotoUrl(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </section>
            <footer className="modal-card-foot">
              <div className="buttons">
                <button
                  className="button is-success"
                  onClick={() => handleSave(selectedMovieId)}
                >
                  Kaydet
                </button>
                <button className="button is-danger" onClick={closeModal}>
                  İptal
                </button>
              </div>
            </footer>
          </div>

          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={closeModal}
          ></button>
        </div>
      )}

      <div className="columns is-multiline mt-6 ">
        {movieList.map((movie) => (
          <div
            key={movie.id}
            className="column is-justify-content-center is-one-third  "
          >
            <div className="card " style={{ height: "99%" }}>
              <div className="card-image">
                <figure className="image is-4by3">
                  <img
                    src={movie.photoUrl}
                    alt="Placeholder image"
                    style={{
                      borderRadius: "5px",
                    }}
                  />
                </figure>
              </div>

              <div className="card-content">
                <div className="media">
                  <div className="media-right">
                    <figure className="image is-48x48 ">
                      <img
                        src={movie.userPhotoUrl}
                        alt=""
                        className="is-rounded"
                      />
                    </figure>
                  </div>
                  <div className="media-content d-flex is-align-items-center is-justify-content-center">
                    <p className="title is-4 has-text-black ">
                      <Link
                        style={{ textDecoration: "none" }}
                        className="has-text-link"
                        to={`/movie/${movie.id}`}
                      >
                        {movie.movieName}
                      </Link>
                      <div className="card-content d-flex is-align-items-center is-justify-content-center">
                        <p className="subtitle is-6 ">
                          @{movie.createdAt.replaceAll(" ", "").toLowerCase()}
                        </p>
                      </div>
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="card-content d-flex is-align-items-center is-justify-content-center "
                style={{ height: 200 }}
              >
                {movie.movieTopic}.
                <br />
              </div>
              <div className="card-content d-flex is-align-items-center is-justify-content-center">
                <a>#{movie.movieName.replaceAll(" ", "").toLowerCase()}</a>
              </div>

              <div className="card-content  ">
                <a>Film Çıkış Yılı: {movie?.movieYear}</a>
                <br />
                <a>Oluşturulma Tarihi: {movie?.createTime}</a>
              </div>

              {auth.currentUser.uid === movie.userId && (
                <footer className="card-footer ">
                  <button
                    className="button is-link m-1 card-footer-item"
                    onClick={() => handleEdit(movie.id)}
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(movie.id)}
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
    </>
  );
}
export default MovieList;
