import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, auth } from "../config/firebase";
import { Link, useNavigate, useParams } from "react-router-dom";

function Movie() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const [newMovieName, setNewMovieName] = useState("");
  const [newMovieTopic, setNewMovieTopic] = useState("");
  const [newMovieYear, setNewMovieYear] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");

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
  const handleEdit = async () => {
    try {
      console.log("Edit clicked", movieId);
      setSelectedMovieId(movieId);
      setOpenModal(true);

      setNewMovieName(movie.movieName);
      setNewMovieTopic(movie.movieTopic);
      setNewMovieYear(movie.movieYear);
      setNewPhotoUrl(movie.photoUrl);

      console.log("selectedMovieId", selectedMovieId);
      console.log("movie", movie);
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const handleSave = async () => {
    try {
      const movieDoc = doc(moviesCollectionRef, movieId);
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
      getMovie();
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
                {newMovieName}
              </p>
              <button
                className="delete has-background-danger"
                aria-label="close"
                onClick={closeModal}
              />
            </header>
            <section className="modal-card-body">
              <div className="field">
                <label className="label">Film Adı</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="Film Adı"
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
                    type="text"
                    placeholder="Film Konusu"
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
                    placeholder="Film Yılı"
                    value={newMovieYear}
                    onChange={(e) => setNewMovieYear(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Fotoğraf Url</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="Fotoğraf Url"
                    defaultValue={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    required
                  />
                </div>
              </div>
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

      <div className="hero is-fullheight is-full d-flex is-align-items-center is-justify-content-center  text-center mt-6">
        <div className="columns  ">
          {auth.currentUser ? (
            <div className="column   ">
              <div
                className="card mt-6 "
                style={{ width: 500, height: "auto" }}
              >
                <div className="card-image">
                  <figure className="image is-4by3  ">
                    <img
                      style={{
                        objectFit: "fill",
                      }}
                      src={movie?.photoUrl}
                      alt="Placeholder image"
                    />
                  </figure>
                </div>
                <div className="card-content">
                  <div className="media">
                    <div className="media-left">
                      <figure className="image is-48x48 ">
                        <img
                          src={movie?.userPhotoUrl}
                          alt=""
                          className="is-rounded"
                        />
                      </figure>
                    </div>
                    <div className="media-content">
                      <p className="title is-4 has-text-black ">
                        {movie?.movieName}
                      </p>
                      {movie?.createdAt && (
                        <p className="subtitle is-6 mt-2">
                          @{movie?.createdAt.replaceAll(" ", "").toLowerCase()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="content p-3 ">
                  {movie?.movieTopic}.
                  <br />
                  <a> #{movie?.movieName.replaceAll(" ", "").toLowerCase()}</a>
                  <br />
                </div>
                <div className="content p-3 ">
                  <a>Çıkış Yılı: {movie?.miveYear}</a>
                </div>
                <div className="content p-3 ">
                  <a>Oluşturulma Tarihi: {movie?.createTime}</a>
                </div>
                {auth.currentUser.uid === movie?.userId && (
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
      </div>
    </>
  );
}

export default Movie;
