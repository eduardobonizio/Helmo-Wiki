import React from "react";
import updates from "../../data/updates.json";
import { useLanguage } from "../../contexts/LanguageContext";

const renderNameList = (title, names) => {
  if (!names || names.length === 0) return null;

  return (
    <div className="mt-3">
      <div className="fw-bold small text-uppercase mb-2">
        {title} ({names.length})
      </div>
      <div className="border rounded p-2 bg-light" style={{ maxHeight: "260px", overflowY: "auto" }}>
        <div className="d-flex flex-wrap gap-1">
          {names.map((name) => (
            <span className="badge bg-secondary" key={`${title}-${name}`}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

function Updates() {
  const { t } = useLanguage();

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="mb-4">
            <h1 className="h3 fw-bold text-uppercase mb-1">{t("updates_title")}</h1>
          </div>

          <div className="d-flex flex-column gap-3">
            {updates.map((update) => (
              <div className="card shadow-sm border-0" style={{ borderRadius: "12px", overflow: "hidden" }} key={`${update.date}-${update.time}`}>
                <div className="card-header bg-dark text-white fw-bold">
                  Dia {update.date} as {update.time}
                </div>
                <div className="card-body">
                  <ul className="mb-0 ps-3">
                    {update.changes.map((change) => (
                      <li key={change}>{change}</li>
                    ))}
                  </ul>
                  {renderNameList(t("updated_monsters"), update.updatedMonsters)}
                  {renderNameList(t("updated_items"), update.updatedItems)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Updates;
