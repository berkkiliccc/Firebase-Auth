import { addDoc, collection, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../../config/firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";

function CreateMovie() {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [year, setYear] = useState(Number);
  const [platform, setPlatform] = useState("movie");
  const [photoUrl, setPhotoUrl] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCIMGFCxokq8Vhi27FmgyPQOqSuolbXVQDNA&s"
  );
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const moviesCollectionRef = collection(db, "Movies");

  const navigate = useNavigate();

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
  const addMovie = async () => {
    try {
      setLoading(true);
      const userUid = auth.currentUser.uid;
      const profilePictureRef = ref(
        storage,
        `profilePicture/${userUid}'-'${auth.currentUser.email}`
      );
      const listResult = await listAll(profilePictureRef);
      const fileName = listResult.items[0].name;
      const photoRef = ref(
        storage,
        `profilePicture/${userUid}'-'${auth.currentUser.email}/${fileName}`
      );
      const profilePhotoUrl = await getDownloadURL(photoRef);

      const movieData = {
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
        userPhotoUrl: profilePhotoUrl,
        type: platform,
      };

      // Yeni bir dizi belgesi oluştur
      const movieDocRef = await addDoc(moviesCollectionRef, movieData);
      const movieId = movieDocRef.id; // Dizinin kimlik bilgisini al

      if (file) {
        // Dosyayı diziye yükle
        const fileRef = ref(
          storage,
          `moviePicture/${movieId}'-'${auth.currentUser.email}/${file.name}`
        );
        await uploadBytes(fileRef, file);
        const photoUrl = await getDownloadURL(fileRef);

        // Dosyanın URL'sini dizi belgesine kaydet
        await updateDoc(movieDocRef, {
          photoUrl,
        });
      }

      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // const addMovie = async () => {
  //   const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
  //   const userData = userDoc.data();
  //   const res = userData.profilePicture;
  //   try {
  //     await addDoc(moviesCollectionRef, {
  //       title: title,
  //       topic: topic,
  //       createdAt: new Date().toLocaleDateString("tr-TR", {
  //         year: "numeric",
  //         month: "long",
  //         day: "numeric",
  //       }),
  //       year: year,
  //       photoUrl: photoUrl,
  //       userId: auth.currentUser.uid,
  //       createdBy: auth.currentUser.displayName,
  //       userPhotoUrl: res,
  //       type: platform,
  //     });
  //     navigate("/");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
          <input
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="mt-5 "
          />
          <br />

          <div className="field is-grouped d-flex justify-content-center align-items-center hero-body ">
            <div className="control">
              <button
                className={`button is-link ${loading ? "is-loading" : ""}`}
                onClick={addMovie}
              >
                Kaydet
              </button>
            </div>
            <div className="control">
              <button
                onClick={() => navigate("/movies")}
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

export default CreateMovie;
