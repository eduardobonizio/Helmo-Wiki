import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import NavLink from "../../components/NavLink";

const IS_DEV = process.env.NODE_ENV === "development";

function NavBar() {
  const { language, t, toggleLanguage } = useLanguage();

  return (
    <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <NavLink to="/" className="navbar-brand fw-bold text-uppercase" end style={{ letterSpacing: "1px" }}>
          {t("nav_wiki")}
        </NavLink>
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
            <li className="nav-item">
              <NavLink to="/monsters" className="nav-link text-uppercase" style={{ fontSize: "0.9rem", letterSpacing: "0.5px" }}>
                {t("nav_monsters")}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/bosses" className="nav-link text-uppercase" style={{ fontSize: "0.9rem", letterSpacing: "0.5px" }}>
                {t("nav_bosses")}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/items" className="nav-link text-uppercase" style={{ fontSize: "0.9rem", letterSpacing: "0.5px" }}>
                {t("nav_items")}
              </NavLink>
            </li>
            {IS_DEV && (
              <li className="nav-item">
                <NavLink to="/updates" className="nav-link text-uppercase" style={{ fontSize: "0.9rem", letterSpacing: "0.5px" }}>
                  {t("nav_updates")}
                </NavLink>
              </li>
            )}
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
