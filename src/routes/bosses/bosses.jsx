import monsters from "../../data/monsters.json";
import bossNames from "../../data/bosses.json";
import React, { useMemo, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import SpriteImage from "../../components/SpriteImage";

const isBoss = (monster) => {
  return bossNames.includes(monster.originalName);
};

const formatRespawn = (seconds) => {
  if (!seconds) return null;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  return `${minutes}m`;
};

function Bosses() {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();

  const bosses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const bossesByName = new Map();
    monsters
      .filter(isBoss)
      .filter((boss) => {
        if (!term) return true;
        return boss.id.toLowerCase().includes(term);
      })
      .forEach((boss) => {
        const currentBoss = bossesByName.get(boss.originalName);
        if (!currentBoss || boss.maxHealth > currentBoss.maxHealth) {
          bossesByName.set(boss.originalName, boss);
        }
      });

    return Array.from(bossesByName.values()).sort((a, b) => b.maxHealth - a.maxHealth || a.id.localeCompare(b.id));
  }, [searchTerm]);

  return (
    <div className="container mt-4">
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-8 col-lg-6">
          <input
            type="text"
            className="form-control form-control-lg shadow-sm"
            placeholder={t("search_bosses")}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            style={{ borderRadius: "20px" }}
          />
        </div>
      </div>

      <div className="row justify-content-center">
        {bosses.map((boss) => {
          const respawn = formatRespawn(boss.intervalResp);
          const topDrops = (boss.drops || [])
            .filter((drop) => drop.originalName !== "gold")
            .slice(0, 5);

          return (
            <div className="col-12 col-md-6 col-lg-4 col-xl-3 d-flex justify-content-center mb-4" key={boss.originalName}>
              <div className="card w-100 shadow-sm border-0 h-100" style={{ maxWidth: "23rem", borderRadius: "12px", overflow: "hidden" }}>
                <div className="card-header bg-dark text-white text-center fw-bold text-uppercase" style={{ letterSpacing: "1px" }}>
                  {boss.id}
                </div>

                <div className="card-body p-3 d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3 bg-light rounded d-flex justify-content-center align-items-center" style={{ width: "88px", height: "88px", flexShrink: 0 }}>
                      <SpriteImage
                        kind="monster"
                        name={boss.originalName}
                        sprite={boss.sprite || "walk_0.png"}
                        frameSize={boss.frameSize || 32}
                        frameWidth={boss.frameWidth}
                        frameHeight={boss.frameHeight}
                        framesPerDirection={boss.framesPerDirection || 1}
                        directions={boss.directions || 4}
                        direction={0}
                        duration="2.4s"
                        alt={boss.id}
                        eager={true}
                        style={{ maxHeight: "72px", maxWidth: "72px" }}
                      />
                    </div>

                    <div className="d-flex flex-wrap">
                      <span className="badge bg-danger mb-1 me-1">{t("hp")}: {boss.maxHealth}</span>
                      <span className="badge bg-success mb-1 me-1">{t("exp")}: {boss.experience}</span>
                      <span className="badge bg-info text-dark mb-1 me-1">{t("spd")}: {boss.speed}</span>
                      <span className="badge bg-secondary mb-1 me-1">{t("def")}: {boss.defense}</span>
                      {respawn && <span className="badge bg-warning text-dark mb-1 me-1">{t("respawn")}: {respawn}</span>}
                    </div>
                  </div>

                  {boss.elements && boss.elements.length > 0 && (
                    <div className="mb-3">
                      <div className="fw-bold small mb-1">{t("weaknesses")}</div>
                      <div className="d-flex flex-wrap gap-1">
                        {boss.elements.map((element) => (
                          <span key={`${boss.originalName}-${element.name}`} className={`badge ${element.value > 100 ? "bg-success" : "bg-danger"}`}>
                            {element.name} {element.value}%
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {topDrops.length > 0 && (
                    <div className="mt-auto">
                      <div className="fw-bold small mb-2">{t("top_drops")}</div>
                      <div className="d-flex flex-column gap-1">
                        {topDrops.map((drop) => (
                          <div className="d-flex align-items-center justify-content-between small border-bottom pb-1" key={`${boss.originalName}-${drop.item}`}>
                            <span className="text-truncate me-2">{drop.item}</span>
                            <span className="text-muted">{(drop.chance / 1000).toFixed(2)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Bosses;
