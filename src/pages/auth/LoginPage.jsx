import {
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, db, googleProvider, storage } from "../../config/firebase";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import defaultProfilePicture from "../../assets/defaultpicture.png";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("Google Login Success");

      const user = auth.currentUser;
      const response = await fetch(defaultProfilePicture);

      const blob = await response.blob();
      const profilePictureRef = ref(
        storage,
        `profilePicture/${user.uid}/defaultpicture.png`
      );
      await uploadBytes(profilePictureRef, blob);
      const profilePictureURL = await getDownloadURL(profilePictureRef);
      await updateProfile(user, {
        photoURL: profilePictureURL,
      });

      await setDoc(doc(db, "users", user.uid), {
        userId: auth.currentUser.uid,
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName,
        profilePicture: auth.currentUser.photoURL,
      });
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login Success");
      navigate("/");
    } catch (e) {
      console.error(e);
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
              handleLogin();
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
            <div className="d-flex align-items-center justify-content-center ">
              <button
                className="btn btn-lg btn-primary btn-block "
                type="submit"
              >
                Giriş Yap
              </button>
            </div>
            <p className="text-center mt-3">
              Hesabın yok mu?
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <span className="fs-5 "> Kayıt Ol</span>
              </Link>
            </p>

            <hr className="border border-danger border-2 opacity-50" />

            <div className="d-flex align-items-center justify-content-center ">
              <button
                onClick={handleGoogleLogin}
                className="btn btn-lg btn-danger btn-block "
                type="button"
              >
                <i className="bi bi-google"> Google Ile Giris yap</i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
