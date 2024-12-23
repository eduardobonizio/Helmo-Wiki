import React from "react";

function NavBar() {
  return (
    <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="/">
          Wiki
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="/monsters">
                Monsters
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/items">
                Items
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
export default NavBar;
