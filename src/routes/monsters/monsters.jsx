import monsters from "../../data/monsters.json";
import React, { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import Popup from "../../elements/popup/popup";
import OptimizedImage from "../../components/OptimizedImage";
import SpriteImage from "../../components/SpriteImage";

const gifImg = (item) => `/items/${item.originalName}/icon.png`;

function Monsters() {
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [displayCount, setDisplayCount] = useState(20);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 100 >= document.documentElement.offsetHeight) {
        setDisplayCount(prev => prev + 20);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setDisplayCount(20);
  }, [searchTerm]);

  const filteredMonsters = monsters.filter((monster) => {
    if (searchTerm === "") return true;
    const term = searchTerm.toLowerCase();
    if (monster.id.toLowerCase().includes(term)) return true;
    if (monster.drops && monster.drops.some(drop => drop.item.toLowerCase().includes(term))) return true;
    return false;
  });

  const monstersToDisplay = filteredMonsters.slice(0, displayCount);

  return (
    <div className="container mt-4">
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-8 col-lg-6">
          <input 
            type="text" 
            className="form-control form-control-lg shadow-sm" 
            placeholder={t("search_monsters")} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderRadius: '20px' }}
          />
        </div>
      </div>
      <div className="row justify-content-center">
        {monstersToDisplay.map((monster, i) => (
          <div className="col-12 col-md-6 col-lg-4 col-xl-3 d-flex justify-content-center mb-4" key={i}>
            <div className="card w-100 shadow-sm border-0 h-100" style={{ maxWidth: "23rem", borderRadius: "12px", overflow: "hidden" }}>
              <div className="card-header bg-dark text-white text-center fw-bold text-uppercase" style={{ letterSpacing: "1px" }}>
                {monster.id}
              </div>
              <div className="card-body p-3 d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3 bg-light rounded d-flex justify-content-center align-items-center" style={{ width: "80px", height: "80px", flexShrink: 0 }}>
                    <SpriteImage
                      kind="monster"
                      name={monster.originalName}
                      sprite={monster.sprite || "walk_0.png"}
                      frameSize={monster.frameSize || 32}
                      frameWidth={monster.frameWidth}
                      frameHeight={monster.frameHeight}
                      framesPerDirection={monster.framesPerDirection || 1}
                      directions={monster.directions || 4}
                      direction={0}
                      duration="2.4s"
                      alt={monster.id}
                      eager={i === 0}
                      style={{ maxHeight: "64px", maxWidth: "64px" }}
                    />
                  </div>
                  <div className="d-flex flex-wrap">
                    <span className="badge bg-danger mb-1 me-1">{t("hp")}: {monster.maxHealth}</span>
                    <span className="badge bg-success mb-1 me-1">{t("exp")}: {monster.experience}</span>
                    <span className="badge bg-info text-dark mb-1 me-1">{t("spd")}: {monster.speed}</span>
                    <span className="badge bg-secondary mb-1 me-1">{t("def")}: {monster.defense}</span>
                    <span className="badge bg-warning text-dark mb-1 me-1">Exp/{t("hp")}: {monster.expPerHp.toFixed(2)}</span>
                  </div>
                </div>

                <div className="accordion accordion-flush flex-grow-1" id={`accordion-${i}`} style={{ borderTop: "1px solid #eee" }}>
                  
                  {((monster.attacks && monster.attacks.length > 0) || (monster.defenses && monster.defenses.length > 0)) && (
                  <div className="accordion-item">
                    <h2 className="accordion-header" id={`heading-combat-${i}`}>
                      <button className="accordion-button collapsed py-2 px-1" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-combat-${i}`} aria-expanded="false" aria-controls={`collapse-combat-${i}`} style={{ fontSize: "0.85rem", fontWeight: "600", backgroundColor: "transparent", boxShadow: "none" }}>
                        Combat Info
                      </button>
                    </h2>
                    <div id={`collapse-combat-${i}`} className="accordion-collapse collapse" aria-labelledby={`heading-combat-${i}`} data-bs-parent={`#accordion-${i}`}>
                      <div className="accordion-body p-1" style={{ fontSize: "0.8rem" }}>
                        {monster.attacks && monster.attacks.length > 0 && <strong className="d-block mb-1 text-danger">{t("attacks")}</strong>}
                        {monster.attacks && monster.attacks.map((attack, idx) => (
                          <div key={idx} className="border-bottom pb-1 mb-1">
                            <span className="fw-bold">{attack.attack}</span> 
                            <span className="text-muted ms-1">({t("cd")}: {attack.interval})</span>
                            {attack.min && <span> {t("dmg")}: {attack.min}-{attack.max}</span>}
                            {attack.type && <span className="ms-1 badge bg-light text-dark border">{attack.type}</span>}
                          </div>
                        ))}
                        {monster.defenses && monster.defenses.length > 0 && <strong className="d-block mt-2 mb-1 text-primary">{t("defenses")}</strong>}
                        {monster.defenses && monster.defenses.map((defense, idx) => (
                          <div key={idx} className="border-bottom pb-1 mb-1">
                            <span className="fw-bold">{(defense.name == "healing" && "Heal") || defense.name}</span>
                            <span className="text-muted ms-1">({t("cd")}: {defense.interval})</span>
                            {defense.min && <span> {t("heal")}: {defense.min}-{defense.max}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  )}

                  {monster.drops && monster.drops.length > 0 && (
                  <div className="accordion-item">
                    <h2 className="accordion-header" id={`heading-drops-${i}`}>
                      <button className="accordion-button collapsed py-2 px-1" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-drops-${i}`} aria-expanded="false" aria-controls={`collapse-drops-${i}`} style={{ fontSize: "0.85rem", fontWeight: "600", backgroundColor: "transparent", boxShadow: "none" }}>
                        Loot Drops
                      </button>
                    </h2>
                    <div id={`collapse-drops-${i}`} className="accordion-collapse collapse" aria-labelledby={`heading-drops-${i}`} data-bs-parent={`#accordion-${i}`}>
                      <div className="accordion-body p-0">
                        <table className="table table-sm table-borderless table-striped mb-0" style={{ fontSize: "0.8rem" }}>
                          <tbody>
                            {monster.drops.map((drop, idx) => (
                              <tr key={idx}>
                                <td className="show-cursor" onClick={() => { setItem(drop); setOpen(true); }}>
                                  <OptimizedImage src={gifImg(drop).replace(/^\.\./, "")} alt={drop.item} width={16} height={16} sizes={[16, 32]} style={{ marginRight: "4px", width: "16px", height: "16px" }} />
                                  {drop.item}
                                </td>
                                <td className="text-end text-muted">{(drop.chance / 1000).toFixed(2)}%</td>
                                <td className="text-end text-muted">x{drop.max || 1}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  )}

                  {((monster.elements && monster.elements.length > 0) || (monster.immunities && monster.immunities.length > 0)) && (
                  <div className="accordion-item">
                    <h2 className="accordion-header" id={`heading-elements-${i}`}>
                      <button className="accordion-button collapsed py-2 px-1" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-elements-${i}`} aria-expanded="false" aria-controls={`collapse-elements-${i}`} style={{ fontSize: "0.85rem", fontWeight: "600", backgroundColor: "transparent", boxShadow: "none" }}>
                        Elements & Immunities
                      </button>
                    </h2>
                    <div id={`collapse-elements-${i}`} className="accordion-collapse collapse" aria-labelledby={`heading-elements-${i}`} data-bs-parent={`#accordion-${i}`}>
                      <div className="accordion-body p-1" style={{ fontSize: "0.8rem" }}>
                        {monster.elements && monster.elements.length > 0 && (
                          <div className="mb-2">
                            <strong className="d-block mb-1">{t("weaknesses")}</strong>
                            <div className="d-flex flex-wrap gap-1">
                              {monster.elements.map((el, idx) => (
                                <span key={idx} className={`badge ${el.value > 100 ? 'bg-success' : 'bg-danger'}`}>
                                  {el.name} {el.value}%
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {monster.immunities && monster.immunities.length > 0 && (
                          <div>
                            <strong className="d-block mb-1">{t("immunities")}</strong>
                            <div className="d-flex flex-wrap gap-1">
                              {monster.immunities.map((im, idx) => (
                                <span key={idx} className="badge bg-secondary">
                                  {im.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  )}
                  
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        {open ? (
          <Popup
            drop={item}
            monsters={monsters}
            closePopup={() => setOpen(false)}
          />
        ) : null}
      </div>
    </div>
  );
}

export default Monsters;
