const fs = require('fs');
const content = fs.readFileSync('src/routes/monsters/monsters.jsx', 'utf8');
const lines = content.split('\n');

const newCard = `            <div className="card w-100 shadow-sm border-0 h-100" style={{ maxWidth: "23rem", borderRadius: "12px", overflow: "hidden" }}>
              <div className="card-header bg-dark text-white text-center fw-bold text-uppercase" style={{ letterSpacing: "1px" }}>
                {monster.id}
              </div>
              <div className="card-body p-3 d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3 bg-light rounded d-flex justify-content-center align-items-center" style={{ width: "80px", height: "80px", flexShrink: 0 }}>
                    <img
                      src={\`../monsters/\${monster.originalName}/walk.gif\`}
                      alt={monster.id}
                      style={{ maxHeight: "64px", maxWidth: "64px" }}
                    />
                  </div>
                  <div className="d-flex flex-wrap">
                    <span className="badge bg-danger mb-1 me-1">HP: {monster.maxHealth}</span>
                    <span className="badge bg-success mb-1 me-1">EXP: {monster.experience}</span>
                    <span className="badge bg-info text-dark mb-1 me-1">SPD: {monster.speed}</span>
                    <span className="badge bg-secondary mb-1 me-1">DEF: {monster.defense}</span>
                    <span className="badge bg-warning text-dark mb-1 me-1">Exp/HP: {monster.expPerHp.toFixed(2)}</span>
                  </div>
                </div>

                <div className="accordion accordion-flush flex-grow-1" id={\`accordion-\${i}\`} style={{ borderTop: "1px solid #eee" }}>
                  
                  {((monster.attacks && monster.attacks.length > 0) || (monster.defenses && monster.defenses.length > 0)) && (
                  <div className="accordion-item">
                    <h2 className="accordion-header" id={\`heading-combat-\${i}\`}>
                      <button className="accordion-button collapsed py-2 px-1" type="button" data-bs-toggle="collapse" data-bs-target={\`#collapse-combat-\${i}\`} aria-expanded="false" aria-controls={\`collapse-combat-\${i}\`} style={{ fontSize: "0.85rem", fontWeight: "600", backgroundColor: "transparent", boxShadow: "none" }}>
                        Combat Info
                      </button>
                    </h2>
                    <div id={\`collapse-combat-\${i}\`} className="accordion-collapse collapse" aria-labelledby={\`heading-combat-\${i}\`} data-bs-parent={\`#accordion-\${i}\`}>
                      <div className="accordion-body p-1" style={{ fontSize: "0.8rem" }}>
                        {monster.attacks && monster.attacks.length > 0 && <strong className="d-block mb-1 text-danger">Attacks</strong>}
                        {monster.attacks && monster.attacks.map((attack, idx) => (
                          <div key={idx} className="border-bottom pb-1 mb-1">
                            <span className="fw-bold">{attack.attack}</span> 
                            <span className="text-muted ms-1">(CD: {attack.interval})</span>
                            {attack.min && <span> Dmg: {attack.min}-{attack.max}</span>}
                            {attack.type && <span className="ms-1 badge bg-light text-dark border">{attack.type}</span>}
                          </div>
                        ))}
                        {monster.defenses && monster.defenses.length > 0 && <strong className="d-block mt-2 mb-1 text-primary">Defenses</strong>}
                        {monster.defenses && monster.defenses.map((defense, idx) => (
                          <div key={idx} className="border-bottom pb-1 mb-1">
                            <span className="fw-bold">{(defense.name == "healing" && "Heal") || defense.name}</span>
                            <span className="text-muted ms-1">(CD: {defense.interval})</span>
                            {defense.min && <span> Heal: {defense.min}-{defense.max}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  )}

                  {monster.drops && monster.drops.length > 0 && (
                  <div className="accordion-item">
                    <h2 className="accordion-header" id={\`heading-drops-\${i}\`}>
                      <button className="accordion-button collapsed py-2 px-1" type="button" data-bs-toggle="collapse" data-bs-target={\`#collapse-drops-\${i}\`} aria-expanded="false" aria-controls={\`collapse-drops-\${i}\`} style={{ fontSize: "0.85rem", fontWeight: "600", backgroundColor: "transparent", boxShadow: "none" }}>
                        Loot Drops
                      </button>
                    </h2>
                    <div id={\`collapse-drops-\${i}\`} className="accordion-collapse collapse" aria-labelledby={\`heading-drops-\${i}\`} data-bs-parent={\`#accordion-\${i}\`}>
                      <div className="accordion-body p-0">
                        <table className="table table-sm table-borderless table-striped mb-0" style={{ fontSize: "0.8rem" }}>
                          <tbody>
                            {monster.drops.map((drop, idx) => (
                              <tr key={idx}>
                                <td className="show-cursor" onClick={() => { setItem(drop); setOpen(true); }}>
                                  <img src={gifImg(drop)} alt={drop.item} style={{ marginRight: "4px", width: "16px" }} />
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
                    <h2 className="accordion-header" id={\`heading-elements-\${i}\`}>
                      <button className="accordion-button collapsed py-2 px-1" type="button" data-bs-toggle="collapse" data-bs-target={\`#collapse-elements-\${i}\`} aria-expanded="false" aria-controls={\`collapse-elements-\${i}\`} style={{ fontSize: "0.85rem", fontWeight: "600", backgroundColor: "transparent", boxShadow: "none" }}>
                        Elements & Immunities
                      </button>
                    </h2>
                    <div id={\`collapse-elements-\${i}\`} className="accordion-collapse collapse" aria-labelledby={\`heading-elements-\${i}\`} data-bs-parent={\`#accordion-\${i}\`}>
                      <div className="accordion-body p-1" style={{ fontSize: "0.8rem" }}>
                        {monster.elements && monster.elements.length > 0 && (
                          <div className="mb-2">
                            <strong className="d-block mb-1">Weaknesses:</strong>
                            <div className="d-flex flex-wrap gap-1">
                              {monster.elements.map((el, idx) => (
                                <span key={idx} className={\`badge \${el.value > 100 ? 'bg-success' : 'bg-danger'}\`}>
                                  {el.name} {el.value}%
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {monster.immunities && monster.immunities.length > 0 && (
                          <div>
                            <strong className="d-block mb-1">Immunities:</strong>
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
            </div>`;

const startIdx = lines.findIndex(l => l.includes('<div className="card w-100" style={{ maxWidth: "23rem" }}>'));
let endIdx = -1;
for (let i = startIdx; i < lines.length; i++) {
  if (lines[i].includes('</ul>')) {
    endIdx = i + 1; // include the next line which is </div>
    break;
  }
}

if (startIdx !== -1 && endIdx !== -1) {
  const newLines = [...lines.slice(0, startIdx), newCard, ...lines.slice(endIdx + 1)];
  fs.writeFileSync('src/routes/monsters/monsters.jsx', newLines.join('\n'));
  console.log('Replaced successfully');
} else {
  console.log('Failed to find boundaries', startIdx, endIdx);
}
