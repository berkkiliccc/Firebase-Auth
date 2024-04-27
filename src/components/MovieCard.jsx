/* eslint-disable react/prop-types */

import { useState } from "react";
import { auth } from "../config/firebase";
import { Link } from "react-router-dom";

function MovieCard({
  userPhotoUrl,
  photoUrl,
  id,
  title,
  createdBy,
  topic,
  year,
  userId,
  createdAt,
  handleDelete,
  type,
}) {
  const [deleting, setDeleting] = useState(false);
  return (
    <div className="card " style={{ height: "99%" }}>
      <div className="card-image">
        <figure className="image is-4by3">
          <img
            src={photoUrl}
            alt="Placeholder image"
            style={{
              borderRadius: "5px",
              objectFit: "contain",
            }}
          />
        </figure>
      </div>

      <div className="card-content">
        <div className="media">
          <div className="media-right">
            <figure className="image is-48x48 ">
              <img src={userPhotoUrl} alt="" className="is-rounded" />
            </figure>
          </div>
          <div className="media-content d-flex is-align-items-center is-justify-content-center">
            <div className="title is-4 has-text-black ">
              <Link
                style={{ textDecoration: "none" }}
                className="has-text-link"
                to={`/${type}/${id}`}
              >
                {title}
              </Link>

              <div className="card-content d-flex is-align-items-center is-justify-content-center">
                <p className="subtitle is-6 ">
                  @{createdBy.replaceAll(" ", "").toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="card-content d-flex is-align-items-center is-justify-content-center "
        style={{ height: 200 }}
      >
        {topic}.
        <br />
      </div>
      <div className="card-content d-flex is-align-items-center is-justify-content-center">
        <a>#{title.replaceAll(" ", "").toLowerCase()}</a>
      </div>

      <div className="card-content  ">
        <a> Çıkış Yılı: {year}</a>
        <br />
        <a>Oluşturulma Tarihi: {createdAt}</a>
      </div>

      {auth.currentUser.uid === userId && (
        <footer className="card-footer ">
          <button className="button is-link m-1 card-footer-item">
            Düzenle
          </button>
          <button
            onClick={() => {
              handleDelete(id), setDeleting(true);
            }}
            className={`button is-danger m-1 card-footer-item ${
              deleting ? "is-loading" : " "
            }`}
          >
            Sil
          </button>
        </footer>
      )}
    </div>
  );
}

export default MovieCard;
