import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateMovie() {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [year, setYear] = useState(Number);
  const [platform, setPlatform] = useState("movie");
  const [photoUrl, setPhotoUrl] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCIMGFCxokq8Vhi27FmgyPQOqSuolbXVQDNA&s"
  );

  const moviesCollectionRef = collection(db, "Movies");

  const navigate = useNavigate();

  const addMovie = async () => {
    const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
    const userData = userDoc.data();
    const res = userData.profilePicture;
    try {
      await addDoc(moviesCollectionRef, {
        title: title,
        topic: topic,
        createdAt: new Date().toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        year: year,
        photoUrl: photoUrl,
        userId: auth.currentUser.uid,
        createdBy: auth.currentUser.displayName,
        userPhotoUrl: res,
        type: platform,
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
            Film Ekle
          </h1>
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
                onChange={(e) => setTitle(e.target.value)}
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
              <button className="button is-link" onClick={addMovie}>
                Submit
              </button>
            </div>
            <div className="control">
              <button
                onClick={() => navigate("/movies")}
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

export default CreateMovie;
