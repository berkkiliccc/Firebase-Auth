import { Link, useNavigate } from "react-router-dom";
import { MoviesList } from "../components";
import { auth } from "../config/firebase";
import SeriesList from "./series/SeriesList";

function Home() {
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="hero is-fullheight">
        <div className="hero-body  d-flex is-align-items-center is-justify-content-center text-center">
          <div className="container  ">
            <div className="row  ">
              <div className="col-md-12 text-center ">
                <h1 className="">Kurallar</h1>
                <p className="text-center">
                  1- Bu siteye giriş yapmadan önce lütfen giriş yapınız. Giriş
                  yapmadan film ve dizi ekleyemezsiniz.
                </p>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Giriş Yap
                </button>
                <p className="text-center mt-3">
                  2- Geçerli bir email adresi olmalıdır. Gönderilen emaili
                  onaylamadan film ve dizi ekleyemezsiniz.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  Kayıt Ol
                </button>
                <p className="text-center mt-3">
                  3- Şifreni unuttuysan lütfen şifremi unuttum butonuna
                  tıklayın.
                </p>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    navigate("/resetpassword");
                  }}
                >
                  Şifremi Unuttum
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
              <div>
                <hr />

                <h1 className="text-center subtitle">Filmler</h1>
                <hr />
                {currentUser.emailVerified && (
                  <button className="btn btn-primary">
                    <Link to="/addmovie" className="text-white">
                      Film Ekle
                    </Link>
                  </button>
                )}
                <MoviesList />
              </div>

              <hr />
              <h1 className="text-center subtitle">Diziler</h1>
              <hr />
              {currentUser.emailVerified && (
                <button className="btn btn-primary">
                  <Link to="/addseries" className="text-white">
                    Dizi Ekle
                  </Link>
                </button>
              )}
              <SeriesList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
