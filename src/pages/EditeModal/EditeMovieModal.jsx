import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, storage } from "../../config/firebase";
import useMovies from "../../hooks/useMovies";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function EditeMovieModal() {
  const { movie, getMovie } = useMovies();
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [editedMovie, setEditedMovie] = useState({
    title: "",
    topic: "",
    year: "",
    photoUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (movieId) {
      setLoading(true);
      getMovie(movieId).then(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    if (movie) {
      setEditedMovie({
        title: movie.title,
        topic: movie.topic,
        year: movie.year,
        photoUrl: movie.photoUrl,
      });
    }
  }, [movie]);

  const handleSave = async () => {
    const movieRef = doc(db, "Movies", movieId);
    setLoading(true);
    await updateDoc(movieRef, {
      title: editedMovie.title,
      topic: editedMovie.topic,
      year: editedMovie.year,
      photoUrl: editedMovie.photoUrl,
    });

    if (file) {
      const fileRef = ref(storage, `moviePicture/${movieId}/${file.name}`);
      await uploadBytes(fileRef, file);
      const photoUrl = await getDownloadURL(fileRef);

      await updateDoc(movieRef, {
        photoUrl,
      });
    }

    setLoading(false);
    navigate(`/movie/${movieId}`);
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
                src={movie?.photoUrl}
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
                value={editedMovie.title || ""}
                onChange={(e) =>
                  setEditedMovie({ ...editedMovie, title: e.target.value })
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
                value={editedMovie.topic || ""}
                onChange={(e) =>
                  setEditedMovie({ ...editedMovie, topic: e.target.value })
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
                value={editedMovie.year || ""}
                onChange={(e) =>
                  setEditedMovie({ ...editedMovie, year: e.target.value })
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
                value={editedMovie.photoUrl || ""}
                placeholder="https://example.com/image.jpg "
                onChange={(e) =>
                  setEditedMovie({ ...editedMovie, photoUrl: e.target.value })
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
                onClick={() => navigate(`/movie/${movieId}`)}
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

export default EditeMovieModal;
