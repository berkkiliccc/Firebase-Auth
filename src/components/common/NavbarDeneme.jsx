function NavbarDeneme() {
  return (
    <div className="columns is-mobile">
      <div className="column is-11 is-offset-1">
        <div className="tabs  is-toggle is-fullwidth  ">
          <ul>
            <li className="is-active">
              <a>
                <span className="icon is-small">
                  <i className="fas fa-image" aria-hidden="true" />
                </span>
                <span>Pictures</span>
              </a>
            </li>
            <li>
              <a>
                <span className="icon is-small">
                  <i className="fas fa-music" aria-hidden="true" />
                </span>
                <span>Music</span>
              </a>
            </li>
            <li>
              <a>
                <span className="icon is-small">
                  <i className="fas fa-film" aria-hidden="true" />
                </span>
                <span>Videos</span>
              </a>
            </li>
            <li>
              <a>
                <span className="icon is-small">
                  <i className="far fa-file-alt" aria-hidden="true" />
                </span>
                <span>Documents</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NavbarDeneme;
