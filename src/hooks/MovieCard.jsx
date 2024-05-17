/* eslint-disable react/prop-types */

// import { useState } from "react";
// import { auth } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import "./MovieCard.css";

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
  // const [deleting, setDeleting] = useState(false);

  const limitedTopic = topic.split(" ").slice(0, 10).join(" ");
  const topicDisplay = topic.length > 50 ? `${limitedTopic}...` : topic;

  const navigate = useNavigate();
  return (
    <div className="card">
      <div className="card-image">
        <figure className="image is-4by3">
          <img
            className="img is-fullwidth "
            src={photoUrl}
            alt="Placeholder image"
            style={{
              borderRadius: "5px",
              objectFit: "contain",
            }}
            onClick={() => {
              navigate(`/${type}/${id}`);
            }}
          />
        </figure>
      </div>

      <div className="card-content">
        <div className="d-flex is-align-items-center is-justify-content-center">
          <div className="title is-4 has-text-black ">
            <Link
              style={{
                textDecoration: "none",
                maxWidth: "90%",
              }}
              className="has-text-link"
              to={`/${type}/${id}`}
            >
              {title}
            </Link>
          </div>
        </div>
      </div>

      <div className="card-content">
        <p className="subtitle is-6 ">
          @{createdBy.replaceAll(" ", "").toLowerCase()}
        </p>
      </div>

      <div className="card-content ">
        {topicDisplay}.
        <br />
      </div>

      <div className="card-content  ">
        <a> Çıkış Yılı: {year}</a>
        <br />
        <a>Oluşturulma Tarihi: {createdAt}</a>
      </div>
    </div>
  );
}

export default MovieCard;
