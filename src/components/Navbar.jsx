import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";

function Navbar() {
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth);
    navigate("/login");
  };

  return (
    <div>
      <nav
        className="navbar bg-dark border-bottom border-body nav-fixed-top "
        data-bs-theme="dark"
      >
        <div className="container-fluid ">
          <Link to="/" className="navbar-brand">
            Auth
          </Link>

          <Link to="/login">
            <button onClick={handleLogout} className="btn btn-outline-success">
              {currentUser ? "Logout" : "Login"}
            </button>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
