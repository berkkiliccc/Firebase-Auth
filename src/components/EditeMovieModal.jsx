import React from "react";

function EditeMovieModal() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const [newMovieName, setNewMovieName] = useState("");
  const [newMovieTopic, setNewMovieTopic] = useState("");
  const [newMovieYear, setNewMovieYear] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");

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
    <div>
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
    </div>
  );
}

export default EditeMovieModal;
