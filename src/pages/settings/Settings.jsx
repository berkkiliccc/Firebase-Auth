import { useEffect, useState } from "react";
import { auth, db, storage } from "../../config/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

function Settings() {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [file, setFile] = useState(null);
  const [pictureLoading, setPictureLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const deletePicture = async () => {
    try {
      // Kullanıcının önceki fotoğrafı var mı kontrol et
      if (currentUser.photoURL) {
        // Önceki fotoğrafın referansını oluştur
        const previousPhotoRef = ref(storage, currentUser.photoURL);

        // Önceki fotoğrafı sil
        await deleteObject(previousPhotoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const uploadFile = async () => {
    if (file === null || !currentUser || currentUser.photoURL === null) return;

    try {
      deletePicture();
      setPictureLoading(true);
      const filesFolderRef = ref(
        storage,
        `profilePicture/${currentUser.uid}/${file.name}`
      );
      await uploadBytes(filesFolderRef, file);
      const url = await getDownloadURL(filesFolderRef);

      await updateProfile(auth.currentUser, {
        photoURL: url,
      });

      // Kullanıcının fotoğraf URL'si güncellendiğinde Movies koleksiyonundaki belgeleri güncelle
      await updateMoviesCollection(currentUser.uid, url);

      await updateUsersCollection(currentUser.uid, url);

      // Kullanıcının fotoğraf URL'si güncellendiğinde Series koleksiyonundaki belgeleri güncelle
      await updateSeriesCollection(currentUser.uid, url);

      setPictureLoading(false);
      navigate(`/profile/${currentUser.uid}/settings`);
    } catch (e) {
      console.log(e);
    }
  };

  const updateMoviesCollection = async (userId, photoUrl) => {
    const moviesRef = collection(db, "Movies");
    const querySnapshot = await getDocs(
      query(moviesRef, where("userId", "==", userId))
    );
    querySnapshot.forEach(async (doc) => {
      try {
        await updateDoc(doc.ref, {
          userPhotoUrl: photoUrl,
        });
      } catch (error) {
        console.log("Error updating document: ", error);
      }
    });
  };

  const updateSeriesCollection = async (userId, photoUrl) => {
    const seriesRef = collection(db, "Series");
    const querySnapshot = await getDocs(
      query(seriesRef, where("userId", "==", userId))
    );
    querySnapshot.forEach(async (doc) => {
      try {
        await updateDoc(doc.ref, {
          userPhotoUrl: photoUrl,
        });
      } catch (error) {
        console.log("Error updating document: ", error);
      }
    });
  };

  const updateUsersCollection = async (userId, photoUrl) => {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(
      query(usersRef, where("userId", "==", userId))
    );
    querySnapshot.forEach(async (doc) => {
      try {
        await updateDoc(doc.ref, {
          profilePicture: photoUrl,
        });
      } catch (error) {
        console.log("Error updating document: ", error);
      }
    });
  };
  const handleButtonClick = () => {
    if (file !== null) {
      uploadFile();
    } else if (file === null) {
      alert("Lutfen bir dosya secin");
    }
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

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="hero is-fullheight d-flex align-items-center ">
      <div className="hero-body ">
        <figure className="image is-256x256">
          <img
            className="is-rounded "
            src={auth.currentUser.photoURL}
            alt="user"
            style={{
              width: "256px",
              height: "256px",
            }}
          />

          <input
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="mt-5"
          />
          <br />
          <button
            className={`button mt-3 is-primary m-1  ${
              pictureLoading ? "is-loading" : " "
            }`}
            onClick={handleButtonClick}
          >
            Resmi Degistir
          </button>
        </figure>
      </div>
      <div className="hero-body  ">
        <div className="container">
          <div className="columns">
            <div className="column">
              <h1 className="">Kullanici Bilgileri</h1>
              <hr />
              <div>
                <div className="field">
                  <label className="label has-text-black text-center">
                    Ad Soyad
                  </label>
                  <div className="control">
                    <p className="input is-link is-rounded  has-background-white has-text-black">
                      {auth.currentUser.displayName}
                    </p>
                  </div>
                </div>
                <div className="field">
                  <label className="label has-text-black text-center">
                    Email
                  </label>
                  <div className="control">
                    <p className="input is-link is-rounded  has-background-white has-text-black">
                      {auth.currentUser.email}
                    </p>
                  </div>
                </div>
                {/* <div className="field">
                  <label className="label has-text-black text-center">
                    Cinsiyet
                  </label>
                  <div className="select is-link is-rounded is-hovered">
                    <select className="has-background-white" disabled>
                      <option value="" className="has-text-black"></option>
                      <option value="Erkek" className="has-text-black">
                        Erkek
                      </option>
                      <option value="Kadın" className="has-text-black">
                        Kadın
                      </option>
                    </select>
                  </div>
                </div> */}

                <div className="field">
                  <label className="label has-text-black text-center">
                    Cinsiyet
                  </label>
                  <div className="control">
                    <p
                      className="input is-link is-rounded  has-background-white has-text-black"
                      value="Belirtilmemis"
                    >
                      {auth?.currentUser?.gender}
                    </p>
                  </div>
                </div>
                <div className="field">
                  <label className="label has-text-black text-center">
                    Tel No:
                  </label>
                  <div className="control">
                    <p className="input is-link is-rounded is-hovered has-background-white has-text-black">
                      {auth?.currentUser?.phoneNumber}
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-center text-center justify-content-center">
                  <button className="button is-primary  is-focused ">
                    Değiştir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
