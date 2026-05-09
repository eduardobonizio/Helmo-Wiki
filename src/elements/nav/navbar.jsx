import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

function NavBar() {
  const { language, t, toggleLanguage } = useLanguage();

  return (
    <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <a className="navbar-brand fw-bold text-uppercase" href="/" style={{ letterSpacing: "1px" }}>
          {t("nav_wiki")}
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
          <ul className="navbar-nav me-auto">
            <li className="nav-item active">
              <a className="nav-link text-uppercase" href="/monsters" style={{ fontSize: "0.9rem", letterSpacing: "0.5px" }}>
                {t("nav_monsters")}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-uppercase" href="/bosses" style={{ fontSize: "0.9rem", letterSpacing: "0.5px" }}>
                {t("nav_bosses")}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-uppercase" href="/items" style={{ fontSize: "0.9rem", letterSpacing: "0.5px" }}>
                {t("nav_items")}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-uppercase" href="/updates" style={{ fontSize: "0.9rem", letterSpacing: "0.5px" }}>
                {t("nav_updates")}
              </a>
            </li>
          </ul>
          <div className="d-flex">
            <button 
              className="btn btn-outline-light d-flex align-items-center fw-bold" 
              onClick={toggleLanguage}
              style={{ borderRadius: "20px", padding: "4px 12px", fontSize: "0.9rem" }}
            >
              {language === 'en' ? '🇺🇸 EN' : '🇧🇷 PT'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default NavBar;
