import { auth } from "../config/firebase";

function Settings() {
  const currentUser = auth.currentUser;

  // console.log(currentUser);

  return (
    <div className="hero is-fullheight d-flex align-items-center ">
      <figure className="image is-128x128 mt-6">
        <img className="is-rounded" src={currentUser.photoURL} alt="user" />
      </figure>
      <div className="file has-background-white	">
        <label className="file-label has-background-white	">
          <input
            className="file-input has-background-white	"
            type="file"
            name="resume"
          />
          <span className="file-cta has-background-white	">
            <span className="file-icon">
              <i className="fas fa-upload" />
            </span>
            <span className="file-label has-text-black "> Resmi Değiştir </span>
          </span>
        </label>
      </div>

      <div className="hero-body  ">
        <div className="container">{currentUser.displayName}</div>
      </div>
    </div>
  );
}

export default Settings;
