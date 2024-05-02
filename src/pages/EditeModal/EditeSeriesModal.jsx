import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, storage } from "../../config/firebase";
import useSeries from "../../hooks/useSeries";
import { useNavigate, useParams } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function EditeSeriesModal() {
  const { serie, getSerie } = useSeries();
  const { seriesId } = useParams();
  const navigate = useNavigate();

  const [editedSeries, setEditedSeries] = useState({
    title: "",
    topic: "",
    year: "",
    photoUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (seriesId) {
      setLoading(true);
      getSerie(seriesId).then(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    if (serie) {
      setEditedSeries({
        title: serie.title,
        topic: serie.topic,
        year: serie.year,
        photoUrl: serie.photoUrl,
      });
    }
  }, [serie]);

  const handleSave = async () => {
    const seriesRef = doc(db, "Series", seriesId);
    setLoading(true);
    await updateDoc(seriesRef, {
      title: editedSeries.title,
      topic: editedSeries.topic,
      year: editedSeries.year,
      photoUrl: editedSeries.photoUrl,
    });

    if (file) {
      const fileRef = ref(storage, `seriesPicture/${seriesId}/${file.name}`);
      await uploadBytes(fileRef, file);
      const photoUrl = await getDownloadURL(fileRef);

      await updateDoc(seriesRef, {
        photoUrl,
      });
    }

    setLoading(false);
    navigate(`/series/${seriesId}`);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Seçilen dosyanın uzantısını al
    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

    // Uzantıyı kontrol et
    if (
      fileExtension === "png" ||
      fileExtension === "jpg" ||
      fileExtension === "jpeg"
    ) {
      // Uzantı PNG veya JPG ise dosyayı setFile ile ayarla
      setFile(selectedFile);
    } else {
      // Diğer durumlarda kullanıcıya hata mesajı göster
      alert("Lütfen sadece PNG veya JPG dosyaları yükleyin.");
    }
  };

  return (
    <div className="hero is-fullheight">
      <div className=" columns hero-body d-flex is-align-items-center is-justify-content-center text-center ">
        <div className="column is-4 ">
          <h1
            className="subtittle mb-3"
            style={{ textDecoration: "underline" }}
          >
            Düzenle
          </h1>
          <div className="">
            <figure className="image is-4by3  ">
              <img
                style={{
                  objectFit: "fill",
                }}
                src={serie?.photoUrl}
                alt="Placeholder image"
              />
            </figure>
          </div>
          <div className="field">
            <label id="photoUrl" className="">
              Film Adı
            </label>
            <div className={`control ${loading ? "is-loading" : ""}`}>
              <input
                className={`input has-background-white-grey has-text-dark `}
                id="filmName"
                type="text"
                placeholder=""
                value={editedSeries.title || ""}
                onChange={(e) =>
                  setEditedSeries({ ...editedSeries, title: e.target.value })
                }
              />
            </div>
          </div>

          <div className="field">
            <label className="">Konu</label>
            <div className={`control ${loading ? "is-loading" : ""}`}>
              <textarea
                className="textarea has-background-white-grey has-text-dark"
                placeholder="Textarea"
                value={editedSeries.topic || ""}
                onChange={(e) =>
                  setEditedSeries({ ...editedSeries, topic: e.target.value })
                }
              />
            </div>
          </div>
          <div className="field">
            <label id="filmName" className="">
              Çıkış Yılı
            </label>
            <div className={`control ${loading ? "is-loading" : ""}`}>
              <input
                className="input has-background-white-grey has-text-dark"
                id="filmName"
                type="number"
                placeholder="2000 "
                value={editedSeries.year || ""}
                onChange={(e) =>
                  setEditedSeries({ ...editedSeries, year: e.target.value })
                }
              />
            </div>
          </div>
          <div className="field">
            <label id="filmName" className="">
              Fotoğraf Url
            </label>
            <div className={`control ${loading ? "is-loading" : ""}`}>
              <input
                className="input has-background-white-grey has-text-dark"
                id="photoUrl"
                type="text"
                value={editedSeries.photoUrl || ""}
                placeholder="https://example.com/image.jpg "
                onChange={(e) =>
                  setEditedSeries({ ...editedSeries, photoUrl: e.target.value })
                }
              />
            </div>
          </div>
          <input
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="mt-5"
          />
          <br />

          <div className="field is-grouped d-flex justify-content-center align-items-center hero-body ">
            <div className="control">
              <button
                className={`button is-link ${loading ? "is-loading" : ""}`}
                onClick={handleSave}
              >
                Kaydet
              </button>
            </div>
            <div className="control">
              <button
                onClick={() => navigate(`/movie/${seriesId}`)}
                className="button is-link is-danger"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
