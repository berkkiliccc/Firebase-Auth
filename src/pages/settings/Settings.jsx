import "./settings.css";
import { useEffect, useRef, useState } from "react";
import { auth, db, storage } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { sendEmailVerification, updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

function Settings() {
  const [file, setFile] = useState(null);
  const [pictureLoading, setPictureLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccessUpdateProfile, setIsSuccessUpdateProfile] = useState(false);

  const [displayName, setDisplayName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [gender, setGender] = useState("");

  const fileInputRef = useRef(null); // Input alanına referans oluştur

  const navigate = useNavigate();

  useEffect(() => {
    if (!displayName) {
      getUserDoc();
    }
  }, []);

  const getUserDoc = async () => {
    const userRef = doc(db, `users/${auth.currentUser.uid}`);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      setDisplayName(docSnap.data().displayName);
      setPhoneNumber(docSnap.data().phoneNumber);
      setGender(docSnap.data().gender);
    } else {
      console.log("No such document!");
    }
  };

  const deletePicture = async () => {
    try {
      // Kullanıcının önceki fotoğrafı var mı kontrol et
      if (auth.currentUser.photoURL) {
        // Önceki fotoğrafın referansını oluştur
        const previousPhotoRef = ref(storage, auth.currentUser.photoURL);

        // Önceki fotoğrafı sil
        await deleteObject(previousPhotoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const uploadFile = async () => {
    if (
      file === null ||
      !auth.currentUser ||
      auth.currentUser.photoURL === null
    )
      return;

    try {
      deletePicture();
      setPictureLoading(true);
      const filesFolderRef = ref(
        storage,
        `profilePicture/${auth.currentUser.uid}'-'${auth.currentUser.email}/${file.name}`
      );
      await uploadBytes(filesFolderRef, file);
      const url = await getDownloadURL(filesFolderRef);

      await updateProfile(auth.currentUser, {
        photoURL: url,
      });

      // Kullanıcının fotoğraf URL'si güncellendiğinde Movies koleksiyonundaki belgeleri güncelle
      await updateMoviesPhotoUrl(auth.currentUser.uid, url);

      // Kullanıcının fotoğraf URL'si güncellendiğinde Users koleksiyonundaki belgeleri güncelle
      await updateUserPhotoUrlDoc(auth.currentUser.uid, url);

      // Kullanıcının fotoğraf URL'si güncellendiğinde Series koleksiyonundaki belgeleri güncelle
      await updateSeriesPhotoUrl(auth.currentUser.uid, url);

      setPictureLoading(false);
      setFile(null);
      setPreviewImage(null);
      fileInputRef.current.value = null;
      navigate(`/profile/${auth.currentUser.uid}/settings`);
    } catch (e) {
      console.log(e);
    }
  };

  const updateUserPhotoUrlDoc = async (userId, photoUrl) => {
    const userRef = doc(db, `users/${userId}`);

    try {
      await updateDoc(userRef, {
        photoUrl: photoUrl,
        displayName: displayName,
        phoneNumber: phoneNumber,
        gender: gender,
      });
    } catch (error) {
      console.log("Error updating document: ", error);
    }
  };

  const updateMoviesPhotoUrl = async (userId, photoUrl) => {
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

  const updateSeriesPhotoUrl = async (userId, photoUrl) => {
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

  const updateUserDoc = async ({
    userId,
    displayName,
    phoneNumber,
    gender,
  }) => {
    const userRef = doc(db, `users/${userId}`);
    try {
      await updateDoc(userRef, {
        displayName: displayName,
        phoneNumber: phoneNumber,
        gender: gender,
      });
      navigate(`/profile/${userId}/settings`);
    } catch (error) {
      console.log("Error updating document: ", error);
    }
  };

  const updateMoviesDisplayName = async (userId, displayName) => {
    const moviesRef = collection(db, "Movies");
    const querySnapshot = await getDocs(
      query(moviesRef, where("userId", "==", userId))
    );
    querySnapshot.forEach(async (doc) => {
      try {
        await updateDoc(doc.ref, {
          createdBy: displayName,
        });
      } catch (error) {
        console.log("Error updating document: ", error);
      }
    });
  };

  const updateSeriesDisplayName = async (userId, displayName) => {
    const seriesRef = collection(db, "Series");
    const querySnapshot = await getDocs(
      query(seriesRef, where("userId", "==", userId))
    );
    querySnapshot.forEach(async (doc) => {
      try {
        await updateDoc(doc.ref, {
          createdBy: displayName,
        });
      } catch (error) {
        console.log("Error updating document: ", error);
      }
    });
  };

  const handleUpdateUserInformation = async () => {
    setLoading(true);
    setIsSuccessUpdateProfile(false);
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName,
        photoURL: auth.currentUser.photoURL,
      });

      await updateUserDoc({
        userId: auth.currentUser.uid,
        displayName,
        phoneNumber,
        gender,
      });

      await updateMoviesDisplayName(auth.currentUser.uid, displayName);
      await updateSeriesDisplayName(auth.currentUser.uid, displayName);
      console.log("User information updated");
      setLoading(false);
      setIsSuccessUpdateProfile(true);
    } catch (e) {
      console.error(e);
    }
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
    const fileExtension = selectedFile?.name.split(".").pop().toLowerCase();

    // Uzantıyı kontrol et
    if (
      fileExtension === "png" ||
      fileExtension === "jpg" ||
      fileExtension === "jpeg"
    ) {
      // Uzantı PNG veya JPG ise dosyayı setFile ile ayarla
      setFile(selectedFile);
      console.log(selectedFile);

      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewImage(fileReader.result);
      };
      fileReader.readAsDataURL(selectedFile);
    } else {
      alert("Lütfen sadece PNG veya JPG dosyaları yükleyin.");
    }
  };

  const handleDeleteButtonClick = () => {
    // Dosya ve önizlemeyi temizle
    setFile(null);
    setPreviewImage(null);
    fileInputRef.current.value = null;
    console.log(file);
  };

  const handleVerifyEmail = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      console.log("Verification Email Sent");
      alert("Email onay maili gönderildi. Lutfen kontrol edin.");
    } catch (e) {
      console.error(e);
    }
  };

  if (!auth.currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="hero is-fullheight d-flex align-items-center ">
      <h1 className="mt-3">Kullanici Bilgileri</h1>
      <hr />
      <div className="hero-body ">
        <figure className="image is-256x256">
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{
                width: "256px",
                height: "256px",
                borderRadius: "10%",
              }}
            />
          )}
          {!previewImage && (
            <img
              className=" "
              src={auth.currentUser.photoURL}
              alt="user"
              style={{
                width: "256px",
                height: "256px",
                borderRadius: "10%",
              }}
            />
          )}

          <div className="mt-3">
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={handleFileChange}
              className=""
              ref={fileInputRef}
            />
            {previewImage && (
              <button
                className="delete "
                onClick={handleDeleteButtonClick}
              ></button>
            )}
          </div>
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
              {isSuccessUpdateProfile && (
                <div className="notification  is-primary is-light">
                  <button
                    className="delete"
                    onClick={() => setIsSuccessUpdateProfile(null)}
                  />
                  Profiliniz başarıyla güncellendi.
                </div>
              )}
              <div className="field">
                <label className="label has-text-black ">Ad Soyad</label>
                <div className="control">
                  <input
                    type="text"
                    className="input is-link is-rounded is-medium has-background-white has-text-black"
                    defaultValue={auth.currentUser.displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    minLength={3}
                    maxLength={30}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label has-text-black ">Email</label>
                <div className="control">
                  <p className="input is-link is-rounded is-medium has-background-white has-text-black">
                    {auth.currentUser.email}
                  </p>
                </div>
              </div>

              <div className="field">
                <label className="label has-text-black ">Cinsiyet</label>
                <div className="select">
                  <select
                    type="text"
                    className="input is-medium is-link is-rounded is-medium has-background-white has-text-black"
                    value={gender || ""}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Belirtilmemis">Seçiniz</option>
                    <option value="Erkek">Erkek</option>
                    <option value="Kadın">Kadın</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label className="label has-text-black ">Tel No:</label>
                <div className="control">
                  <input
                    type="tel"
                    className="input is-medium is-link is-rounded is-medium has-background-white has-text-black"
                    value={phoneNumber || ""}
                    maxLength={10}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                {phoneNumber === null ||
                  (phoneNumber === "" && (
                    <p className="help is-success">
                      Başında `0` olmadan yazmanız gereklidir.
                    </p>
                  ))}
              </div>
              <div className="field">
                <label className="label has-text-black ">Email onay</label>
                <div className="control">
                  <p className="input is-medium is-link is-rounded is-hovered has-background-white has-text-black">
                    {auth.currentUser.emailVerified
                      ? "Onaylandı"
                      : "Onaylanmadı"}
                  </p>
                  <p className="help has-text-black ">
                    {auth.currentUser.emailVerified ? (
                      false
                    ) : (
                      <button
                        className="button is-danger is-small is-rounded"
                        onClick={() => handleVerifyEmail()}
                      >
                        Emaili Onayla
                      </button>
                    )}
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center text-center justify-content-center">
                <button
                  className={`button is-link ${loading ? "is-loading" : ""}`}
                  onClick={() => handleUpdateUserInformation()}
                >
                  Güncelle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
