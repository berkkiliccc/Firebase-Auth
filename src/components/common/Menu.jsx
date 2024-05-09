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
    <aside className="menu mt-5" style={{ float: "left" }}>
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
                  <h1 className="title has-text-black text-center">ONERI</h1>
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
  );
}

export default Menu;
