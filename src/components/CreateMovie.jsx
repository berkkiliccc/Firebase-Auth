import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateMovie() {
  const [movieName, setMovieName] = useState("");
  const [topic, setTopic] = useState("");
  const [year, setYear] = useState(Number);
  const [photoUrl, setPhotoUrl] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCIMGFCxokq8Vhi27FmgyPQOqSuolbXVQDNA&s"
  );

  const moviesCollectionRef = collection(db, "Movies");

  const navigate = useNavigate();

  const addMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        Name: movieName,
        Topic: topic,
        CreateTime: new Date().toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        Year: year,
        PhotoUrl: photoUrl,
        userId: auth.currentUser.uid,
        createdAt: auth.currentUser.displayName,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="vh-100 columns d-flex justify-content-center align-items-center hero-body  ">
        <div className="column is-3 ">
          <div className="field">
            <label id="photoUrl" className="">
              Film Adı
            </label>
            <div className="control  ">
              <input
                className="input has-background-white-grey has-text-dark"
                id="filmName"
                type="text"
                placeholder=""
                onChange={(e) => setMovieName(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="">Konu</label>
            <div className="control">
              <textarea
                className="textarea has-background-white-grey has-text-dark"
                placeholder="Textarea"
                defaultValue={""}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label id="filmName" className="">
              Çıkış Yılı
            </label>
            <div className="control">
              <input
                className="input has-background-white-grey has-text-dark"
                id="filmName"
                type="number"
                placeholder="2000 "
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label id="filmName" className="">
              Fotoğraf Url
            </label>
            <div className="control">
              <input
                className="input has-background-white-grey has-text-dark"
                id="photoUrl"
                type="text"
                placeholder="https://example.com/image.jpg "
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </div>
          </div>
          <div className="field is-grouped d-flex justify-content-center align-items-center hero-bod ">
            <div className="control">
              <button className="button is-link" onClick={addMovie}>
                Submit
              </button>
            </div>
            <div className="control">
              <button className="button is-link is-danger">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateMovie;
