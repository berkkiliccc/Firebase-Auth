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

function SeriesList() {
  const [seriesList, setSeriesList] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedSeriesId, setSelectedSeriesId] = useState(null);

  const [newSeriesName, setNewSeriesName] = useState("");
  const [newSeriesTopic, setNewSeriesTopic] = useState("");
  const [newSeriesYear, setNewSeriesYear] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");

  useEffect(() => {
    getSeriesList();
    console.log("SriesList component mounted");
  }, []);

  const seriesCollectionRef = collection(db, "Series");

  const getSeriesList = async () => {
    try {
      const data = await getDocs(seriesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
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

      setSeriesList(filteredData);

      // console.log("MovieList =>", filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const seriesDoc = doc(seriesCollectionRef, id);
      await deleteDoc(seriesDoc);
      console.log("Document successfully deleted!");
      getSeriesList();
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  const handleEdit = async (id) => {
    try {
      console.log("Edit clicked", id);
      setSelectedSeriesId(id);
      setOpenModal(true);

      const selectedSeries = seriesList.find((series) => series.id === id);
      setNewSeriesName(selectedSeries.seriesName);
      setNewSeriesTopic(selectedSeries.seriesTopic);
      setNewSeriesYear(selectedSeries.seriesYear);
      setNewPhotoUrl(selectedSeries.photoUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const handleSave = async (id) => {
    try {
      const serieDoc = doc(seriesCollectionRef, id);
      await updateDoc(serieDoc, {
        seriesName: newSeriesName,
        seriesTopic: newSeriesTopic,
        seriesYear: newSeriesTopic,
        photoUrl: newPhotoUrl,
        createTime: new Date().toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
      getSeriesList();
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
                  seriesList.find((series) => series.id === selectedSeriesId)
                    .seriesName
                }
              </p>
              <button
                className="delete has-background-danger"
                aria-label="close"
                onClick={closeModal}
              />
            </header>
            <section className="modal-card-body ">
              {seriesList.map((series) => (
                <div key={series.id}>
                  {series.id === selectedSeriesId && (
                    <div>
                      <div className="field">
                        <label className="label">Film Adı</label>
                        <div className="control">
                          <input
                            className="input"
                            type="text"
                            value={newSeriesName}
                            onChange={(e) => setNewSeriesName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="field">
                        <label className="label">Film Konusu</label>
                        <div className="control">
                          <textarea
                            className="textarea"
                            value={newSeriesTopic}
                            onChange={(e) => setNewSeriesTopic(e.target.value)}
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
                            value={newSeriesYear}
                            onChange={(e) => setNewSeriesYear(e.target.value)}
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
                            defaultValue={series.photoUrl}
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
                  onClick={() => handleSave(selectedSeriesId)}
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

      <div className="hero is-fullheight">
        <div className="columns is-multiline m-4">
          {seriesList.map((series) => (
            <div
              key={series.id}
              className="column is-justify-content-center is-one-third  "
            >
              <div className="card " style={{ height: "99%" }}>
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img
                      src={series.photoUrl}
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
                          src={series.userPhotoUrl}
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
                          to={`/series/${series.id}`}
                        >
                          {series.serieName}
                        </Link>

                        <div className="card-content d-flex is-align-items-center is-justify-content-center">
                          <p className="subtitle is-6 ">
                            @
                            {series.createdAt.replaceAll(" ", "").toLowerCase()}
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
                  {series.seriesTopic}.
                  <br />
                </div>
                <div className="card-content d-flex is-align-items-center is-justify-content-center">
                  <a>#{series.seriesName.replaceAll(" ", "").toLowerCase()}</a>
                </div>

                <div className="card-content  ">
                  <a>Film Çıkış Yılı: {series?.seriesYear}</a>
                  <br />
                  <a>Oluşturulma Tarihi: {series?.createTime}</a>
                </div>

                {auth.currentUser.uid === series.userId && (
                  <footer className="card-footer ">
                    <button
                      className="button is-link m-1 card-footer-item"
                      onClick={() => handleEdit(series.id)}
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(series.id)}
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
    </>
  );
}

export default SeriesList;
