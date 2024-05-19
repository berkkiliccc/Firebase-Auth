import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";

import oneriImg from "../../assets/onerilogo.png";
import { useEffect, useState } from "react";

function Menu() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1216);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);



  const navigate = useNavigate();
  const handleLogout = () => {
    signOut(auth);
    navigate("/login");
  };

  const dateTime = () => {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    return `${day < 10 ? `0${day + 1}` : `${day}`}/${
      month < 10 ? `0${month + 1}` : `${month}`
    }/${year}`;
  };

  useEffect(() => {
    const handleWindowResize = () => {
      setIsMobile(window.innerWidth < 1216);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    const htmlElement = document.querySelector("html");
    if (isMobile) {
      htmlElement.classList.add("has-navbar-fixed-bottom");
    } else {
      htmlElement.classList.remove("has-navbar-fixed-bottom");
    }
  }, [isMobile]);

  const handleSearch = async () => {
    
    try {
      const query = searchQuery; 
      const url = `https://api.themoviedb.org/3/search/multi?query=${query}&api_key=${import.meta.env.VITE_TMDB_API_KEY}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
      }


      const data = await response.json();
      console.log(data);
      // Burada API'den gelen verileri kullanabilirsiniz.
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  return (
    <>
      <div className="is-hidden-mobile is-hidden-tablet-only  ">
        <aside
          className="menu p-3"
          style={{
            float: "left",
            height: "100%",
            borderRight: "1px solid #a3a0a0",
          }}
        >
          <div className="menu-label">
            <div className="menu-list">
              <div className="box has-background-white">
                <article className="media">
                  <div className="media-left">
                    <figure className="image is-64x64">
                      <img
                        src={oneriImg}
                        alt="Image"
                        style={{
                          width: "64px",
                          height: "64px",
                          objectPosition: "center",
                          objectFit: "cover",
                          borderRadius: "10%",
                        }}
                      />
                    </figure>
                  </div>

                  <div className="media-content">
                    <div className="content">
                      <h3 className="title has-text-black text-center">
                        Öneri
                      </h3>
                      <h5 className="has-text-black-light text-center">
                        {dateTime()}
                      </h5>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>

          <p className="menu-label"></p>
          <ul className="menu-list has-background-white">
            <li>
              <Link
                to="/"
                className="navbar-item has-text-black  "
                style={{
                  textDecoration: "none",
                  border: "1px solid #a3a0a0",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                <span className="icon-text">
                  <span className="icon ml-3">
                    <i className="fas fa-home " />
                  </span>
                  <span className="ml-2">Ana Sayfa</span>
                </span>
              </Link>
            </li>
          </ul>
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
                <span className="icon-text">
                  <span className="icon">
                    <i className="fa-solid fa-film" />
                  </span>
                  <span className="ml-2">Filmler</span>
                </span>
              </Link>
              <hr />
              <Link
                to="/addmovie"
                className="navbar-item has-text-black"
                style={{
                  textDecoration: "none",
                }}
              >
                <span className="icon-text">
                  <span className="icon">
                    <i className="fa-solid fa-plus" />
                  </span>
                  <span className="ml-2">Film Ekle</span>
                </span>
              </Link>
            </li>
          </ul>

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
                <span className="icon-text">
                  <span className="icon">
                    <i className="fa-solid fa-tv" />
                  </span>
                  <span className="ml-2">Diziler</span>
                </span>
              </Link>
              <hr />
              <Link
                to="/addseries"
                className="navbar-item has-text-black"
                style={{
                  textDecoration: "none",
                }}
              >
                <span className="icon-text">
                  <span className="icon">
                    <i className="fa-solid fa-plus" />
                  </span>
                  <span className="ml-2">Dizi Ekle</span>
                </span>
              </Link>
            </li>
          </ul>
          <ul className="menu-list ">
            <li
              style={{
                textDecoration: "none",
                border: "1px solid #a3a0a0",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              <div className="field has-addons has-background-white theme-light">
                <p className="control">
                  <input
                    className="input "
                    type="text"
                    placeholder="Ara..."
                    onChange={
                      (e) => setSearchQuery(e.target.value)
                    }
                  />
                </p>
                <p className="control">
                  <button className="button " onClick={
                      handleSearch
                    
                  }>
                    Ara
                  </button>
                </p>
              </div>
            </li>
          </ul>

          <div className="menu-label d-flex">
            <div className="menu-list">
              <div className="box has-background-white card">
                <article className="media is-align-items-center ">
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
                          borderRadius: "10%",
                        }}
                      />
                    </figure>
                  </div>
                  <div className="media-content  ">
                    <div className="content  ">
                      <Link
                        to={`/profile/${auth?.currentUser?.uid}`}
                        className="navbar-item has-text-black text-center has-text-link"
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        {auth?.currentUser?.displayName}
                      </Link>
                      <div className="text-center d-flex is-align-items-center is-justify-content-space-around">
                        <Link
                          to={`/profile/${auth?.currentUser?.uid}`}
                          className="navbar-item has-text-black "
                          style={{
                            textDecoration: "none",
                            flex: "1",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <span className="icon is-small">
                            <i className="fa-regular fa-user"></i>
                          </span>
                          <span style={{ fontSize: "10px" }}>Profil</span>
                        </Link>
                        <Link
                          to={`/profile/${auth?.currentUser?.uid}/settings`}
                          className="navbar-item has-text-black"
                          style={{
                            textDecoration: "none",
                            flex: "1",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <span className="icon is-small">
                            <i className="fa-solid fa-cog"></i>
                          </span>
                          <span style={{ fontSize: "10px" }}>Ayarlar</span>
                        </Link>
                        <Link
                          to="/login"
                          className="navbar-item has-text-danger"
                          style={{
                            textDecoration: "none",
                            flex: "1",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                          onClick={handleLogout}
                        >
                          <span className="icon is-small has-text-danger">
                            <i className="fa-solid fa-sign-out"></i>
                          </span>
                          <span style={{ fontSize: "10px" }}>Çıkış</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div
        className="is-hidden-widescreen is-flex-tablet-only  "
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        <nav
          className="navbar  is-transparent is-light is-fixed-bottom p-0"
          role="navigation"
        >
          <div
            className=""
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
            }}
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
                <i className="fa-regular fa-user"></i>
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
