import { useEffect, useState } from "react";
import { auth } from "../../config/firebase";
import { Link, useNavigate, useParams } from "react-router-dom";
import useSeries from "../../hooks/useSeries";

function Series() {
  const { seriesId } = useParams();
  const [deleting, setDeleting] = useState(false);

  const { serie, getSerie, handleDelete } = useSeries();

  const navigate = useNavigate();

  useEffect(() => {
    getSerie(seriesId);
  }, []);

  const onClickDelete = async () => {
    try {
      setDeleting(true);
      await handleDelete(seriesId);
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="hero is-fullheight is-full d-flex is-align-items-center is-justify-content-center  text-center mt-6">
        <div className="columns  ">
          {auth.currentUser ? (
            <div className="column   ">
              <div
                className="card mt-6 "
                style={{ width: 500, height: "auto" }}
              >
                <div className="card-image">
                  <figure className="image is-4by3  ">
                    <img
                      style={{
                        objectFit: "fill",
                      }}
                      src={serie?.photoUrl}
                      alt="Placeholder image"
                    />
                  </figure>
                </div>
                <div className="card-content">
                  <div className="media">
                    <div className="media-left">
                      <figure className="image is-48x48 ">
                        <img
                          src={serie?.userPhotoUrl}
                          alt=""
                          className="is-rounded"
                        />
                      </figure>
                    </div>
                    <div className="media-content">
                      <p className="title is-4 has-text-black ">
                        {serie?.title}
                      </p>
                      {serie?.createdBy && (
                        <p className="subtitle is-6 mt-2">
                          @{serie?.createdBy.replaceAll(" ", "").toLowerCase()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="content p-3 ">
                  {serie?.topic}.
                  <br />
                  <a> #{serie?.title.replaceAll(" ", "").toLowerCase()}</a>
                  <br />
                </div>
                <div className="content p-3 ">
                  <a>Çıkış Yılı: {serie?.year}</a>
                </div>
                <div className="content p-3 ">
                  <a>Oluşturulma Tarihi: {serie?.createdAt}</a>
                </div>
                {auth.currentUser.uid === serie?.userId && (
                  <footer className="card-footer ">
                    <button className="button is-link m-1 card-footer-item">
                      Düzenle
                    </button>
                    <button
                      onClick={onClickDelete}
                      className={`button is-danger m-1 card-footer-item ${
                        deleting ? "is-loading" : " "
                      }`}
                    >
                      Sil
                    </button>
                  </footer>
                )}
              </div>
            </div>
          ) : (
            <div className="hero is-fullheight">
              <div className="hero-body d-flex is-align-items-center is-justify-content-center text-center">
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
          )}
        </div>
      </div>
    </>
  );
}

export default Series;
