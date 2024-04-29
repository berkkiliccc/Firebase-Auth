import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../../config/firebase";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import defaultProfilePicture from "../../assets/defaultpicture.png";
import { doc, setDoc } from "firebase/firestore";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log(userCredential.user);

      console.log("Signup Success", user);

      // Resmi indir ve Blob olarak al
      const response = await fetch(defaultProfilePicture);
      const blob = await response.blob();

      // Profil resminin yükleneceği konumu belirle
      const profilePictureRef = ref(
        storage,
        `profilePicture/${user.uid}/defaultpicture.png`
      );

      // Blob'u yükle
      await uploadBytes(profilePictureRef, blob);

      // Profil resminin URL'sini al
      const profilePictureURL = await getDownloadURL(profilePictureRef);

      // Kullanıcının profilini güncelle, varsayılan profil resmi ile
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
        photoURL: profilePictureURL,
      });

      await setDoc(doc(db, "users", user.uid), {
        userId: user.uid,
        email: user.email,
        displayName: `${firstName} ${lastName}`,
        profilePicture: profilePictureURL,
      });

      // Giriş sayfasına yönlendir
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container  ">
      <div className="row  d-flex justify-content-center align-items-center vh-100  ">
        <div className="col-md-6 ">
          <h1 className="text-center">Login</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignup();
            }}
          >
            <div className="mb-3">
              <label htmlFor="inputEmail" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="inputEmail"
                className="form-control"
                placeholder="google@auth.com"
                required
                autoFocus
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="inputPassword" className="form-label">
                Şifre
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Şifre"
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>

            <div className="input-group mb-3">
              <label className="input-group-text" htmlFor="firstName">
                @
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="İsim"
                aria-label="Username"
                id="firstName"
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
              <label className="input-group-text" htmlFor="lastName">
                @
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Soyisim"
                aria-label="lastName"
                id="lastName"
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </div>

            <div className="d-flex align-items-center justify-content-center ">
              <button
                className="btn btn-lg btn-primary btn-block "
                type="submit"
              >
                Kayıt Ol
              </button>
            </div>
            <p className="text-center mt-3">
              Hesabın var mı ?
              <Link to="/login" style={{ textDecoration: "none" }}>
                <span className="fs-6 "> Giriş Sayfası</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
