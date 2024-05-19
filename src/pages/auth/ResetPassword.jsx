import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      navigate("/login");
      alert("Parola sıfırlama maili gönderildi.");
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Formun otomatik gönderimini engelle
    handleResetPassword(); // Parola sıfırlama işlemini gerçekleştir
  };

  return (
    <div className="hero is-fullheight is-full d-flex is-align-items-center is-justify-content-center text-center">
      <div className="col-md-3">
        <form onSubmit={handleSubmit}>
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
          <div className="d-flex align-items-center justify-content-center">
            <button className="btn btn-primary btn-block" type="submit">
              Sıfırla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
