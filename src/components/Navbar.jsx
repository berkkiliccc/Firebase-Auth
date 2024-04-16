import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useEffect, useState } from "react";

function Navbar() {
  const currentUser = auth.currentUser;
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleLogout = () => {
    signOut(auth);
    navigate("/login");
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <nav className="navbar has-background-grey ">
        <div className="navbar-brand">
          <Link
            className="navbar-item has-text-primary"
            style={{ backgroundColor: "transparent" }}
            to="/"
          >
            Movies
          </Link>
        </div>

        <div
          id="navbar"
          className="navbar-menu"
          style={{ flexDirection: windowWidth < 768 ? "column" : "row" }}
        >
          <div className="navbar-start">
            <Link
              to="/"
              className="navbar-item"
              style={{
                textDecoration: "none",
                marginBottom: windowWidth < 768 ? "0.5rem" : 0,
              }}
            >
              Home
            </Link>
            <Link
              to="/addMovie"
              className="navbar-item"
              style={{
                textDecoration: "none",
                marginBottom: windowWidth < 768 ? "0.5rem" : 0,
              }}
            >
              Film Ekle
            </Link>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <Link to="/login">
                <button
                  onClick={handleLogout}
                  className={
                    currentUser
                      ? "button is-danger is-dark"
                      : "button is-link is-light"
                  }
                >
                  {currentUser ? "Logout" : "Login"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
