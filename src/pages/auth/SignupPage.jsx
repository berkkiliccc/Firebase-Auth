import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  const defaultPhotoURL =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png";

  const handleSignup = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);

      console.log("Signup Success", user);

      await updateProfile(user.user, {
        displayName: `${firstName} ${lastName}`,
        photoURL: defaultPhotoURL,
      });

      //
      navigate("/login");
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
