import { Link } from "react-router-dom";
import MovieList from "../components/MovieList";
import { auth } from "../config/firebase";

function Home() {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return (
      <div className="hero is-fullheight">
        <div className="hero-body  d-flex is-align-items-center is-justify-content-center text-center">
          <div className="container  ">
            <div className="row  ">
              <div className="col-md-12 text-center ">
                <h1 className="text-center"></h1>
                <h1>
                  Giriş yapmadınız <br />
                  <span className="text-primary ">Giriş yapmak için</span>
                </h1>
                <button className="btn btn-primary">
                  <Link to="/login" className="text-white">
                    Giriş Yap
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero is-fullheight">
      <div className="hero-body  d-flex is-align-items-center is-justify-content-center text-center">
        <div className="container py-6">
          <div className="row">
            <div className="col-md-12 text-center ">
              <h1 className="text-center"></h1>
              <h1 className="mt-6">
                Hoşgeldin <br />
                <span className="text-primary ">
                  {currentUser.displayName.toUpperCase()}
                </span>
              </h1>
              <img
                className="mt-4 mb-5 rounded-circle border border-1 "
                style={{ width: "100px" }}
                src={currentUser.photoURL}
                alt=""
              />
              <div>
                <button className="btn btn-primary">
                  <Link to="/addmovie" className="text-white">
                    Film Ekle
                  </Link>
                </button>
              </div>
              <MovieList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
