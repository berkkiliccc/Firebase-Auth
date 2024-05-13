import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";

function Menu() {
  const navigate = useNavigate();
  const handleLogout = () => {
    signOut(auth);
    navigate("/login");
  };

  return (
    <>
      <div>
        <aside
          className="menu mt-5 is-hidden-touch is-hidden-tablet-only"
          style={{ float: "left", border: "1px solid black" }}
        >
          <div className="menu-label">
            <div className="menu-list">
              <div className="box has-background-white">
                <article className="media">
                  <div className="media-left">
                    <figure className="image is-64x64">
                      <img
                        src={auth?.currentUser?.photoURL}
                        alt="Image"
                        style={{
                          width: "64px",
                          height: "64px",
                          objectPosition: "center",
                          objectFit: "cover",
                        }}
                      />
                    </figure>
                  </div>
                  <div className="media-content">
                    <div className="content">
                      <h1 className="title has-text-black text-center">
                        ONERI
                      </h1>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>

          <p className="menu-label"></p>
          <ul className="menu-list has-background-white	 ">
            <li>
              <Link
                to="/"
                className="navbar-item has-text-black title"
                style={{
                  textDecoration: "none",
                  border: "1px solid #a3a0a0",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                Ana Sayfa
              </Link>
            </li>
          </ul>
          <p className="menu-label ml-3">Film</p>
          <ul className="menu-list">
            <li
              style={{
                textDecoration: "none",
                border: "1px solid #a3a0a0",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              <Link
                to="/movies"
                className="navbar-item has-text-black"
                style={{
                  textDecoration: "none ",
                }}
              >
                Filmler
              </Link>
              <hr />
              <Link
                to="/addmovie"
                className="navbar-item has-text-black"
                style={{
                  textDecoration: "none",
                }}
              >
                Film Ekle
              </Link>
            </li>
          </ul>
          <p className="menu-label ml-3">Dizi</p>
          <ul className="menu-list">
            <li
              style={{
                textDecoration: "none",
                border: "1px solid #a3a0a0",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              <Link
                to="/diziler"
                className="navbar-item has-text-black"
                style={{
                  textDecoration: "none",
                }}
              >
                Diziler
              </Link>
              <hr />
              <Link
                to="/addseries"
                className="navbar-item has-text-black"
                style={{
                  textDecoration: "none",
                }}
              >
                Dizi Ekle
              </Link>
            </li>
          </ul>

          <div className="menu-label d-flex ">
            <div className="menu-list">
              <div className="box has-background-white">
                <article className="media">
                  <div className="media-left">
                    <figure className="image is-64x64">
                      <img
                        src={auth?.currentUser?.photoURL}
                        alt="Image"
                        style={{
                          width: "64px",
                          height: "64px",
                          objectPosition: "center",
                          objectFit: "cover",
                          borderRadius: "20%",
                        }}
                      />
                    </figure>
                  </div>
                  <div className="media-content ">
                    <div className="content ">
                      <h3 className="has-text-black text-center ">
                        {auth?.currentUser?.displayName}
                      </h3>
                      <button
                        className="button is-danger is-dark has-background-danger has-text-black has-text-weight-bold text-center"
                        onClick={handleLogout}
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <div className="is-hidden-desktop">
        <nav
          className="navbar is-transparent is-expanded is-fixed-bottom  d-flex is-justify-content-space-around  p-0 "
          role="navigation"
        >
          <div
            className="text-center d-flex is-align-items-center is-justify-content-space-around"
            style={{ width: "100%" }}
          >
            <Link
              to="/"
              className="navbar-item"
              style={{
                textDecoration: "none",
                flex: "1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span className="icon">
                <i className="fas fa-home" />
              </span>
              <span style={{ fontSize: "12px" }}>Öneri</span>
            </Link>
            <Link
              to="/movies"
              className="navbar-item"
              style={{
                textDecoration: "none",
                flex: "1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span className="icon">
                <i className="fa-solid fa-film"></i>
              </span>
              <span style={{ fontSize: "12px" }}>Film</span>
            </Link>
            <Link
              to="/diziler"
              className="navbar-item"
              style={{
                textDecoration: "none",
                flex: "1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span className="icon">
                <i className="fa-solid fa-tv"></i>
              </span>
              <span style={{ fontSize: "12px" }}>Dizi</span>
            </Link>
            <Link
              to={`/profile/${auth?.currentUser?.uid}`}
              className="navbar-item"
              style={{
                textDecoration: "none",
                flex: "1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span className="icon">
                <i className="fa-solid fa-user"></i>
              </span>
              <span style={{ fontSize: "12px" }}>Profil</span>
            </Link>
            <Link
              to={`/profile/${auth?.currentUser?.uid}/settings`}
              className="navbar-item"
              style={{
                textDecoration: "none",
                flex: "1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span className="icon">
                <i className="fa-solid fa-cog"></i>
              </span>
              <span style={{ fontSize: "12px" }}>Ayarlar</span>
            </Link>
            <Link
              to="/login"
              className="navbar-item"
              style={{
                textDecoration: "none",
                flex: "1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              onClick={handleLogout}
            >
              <span className="icon has-text-danger">
                <i className="fa-solid fa-sign-out"></i>
              </span>
              <span style={{ fontSize: "12px" }}>Çıkış</span>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Menu;
