import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateSeries() {
  const [seriesName, setSeriesName] = useState("");
  const [topic, setTopic] = useState("");
  const [year, setYear] = useState(Number);
  const [platform, setPlatform] = useState("Dizi");
  const [photoUrl, setPhotoUrl] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCIMGFCxokq8Vhi27FmgyPQOqSuolbXVQDNA&s"
  );

  const seriesCollectionRef = collection(db, "Series");

  const navigate = useNavigate();

  const addSeries = async () => {
    try {
      await addDoc(seriesCollectionRef, {
        seriesName: seriesName,
        seriesTopic: topic,
        createTime: new Date().toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        seriesYear: year,
        photoUrl: photoUrl,
        userId: auth.currentUser.uid,
        createdAt: auth.currentUser.displayName,
        userPhotoUrl: auth.currentUser.photoURL,
        platform: platform,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="hero is-fullheight   ">
      <div className=" columns hero-body d-flex is-align-items-center is-justify-content-center text-center ">
        <div className="column is-4 ">
          <h1
            className="subtittle mb-3"
            style={{ textDecoration: "underline" }}
          >
            Dizi Ekle
          </h1>
          <div className="field">
            <label id="photoUrl" className="">
              Dizi Adı
            </label>
            <div className="control  ">
              <input
                className="input has-background-white-grey has-text-dark"
                id="filmName"
                type="text"
                placeholder=""
                onChange={(e) => setSeriesName(e.target.value)}
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

          <div className="field is-grouped d-flex justify-content-center align-items-center hero-body ">
            <div className="control">
              <button className="button is-link" onClick={addSeries}>
                Submit
              </button>
            </div>
            <div className="control">
              <button
                onClick={() => navigate("/")}
                className="button is-link is-danger"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateSeries;
