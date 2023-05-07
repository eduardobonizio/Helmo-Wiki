import monsters from "../../data/monsters.json";
import React, { useState } from "react";
import Popup from "../../elements/popup/popup";

function Monsters() {
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState({});
  return (
    <div className="container d-flex">
      <div className="row justify-content-around">
        {monsters.map((monster, i) => (
          <div className="card d-block mt-2" style={{ width: "23rem" }} key={i}>
            <div className="card-body">
              <h5 className="card-title text-center">{monster.id}</h5>
              <p className="text-center">
                HP: {monster.maxHealth} EXP: {monster.experience} SPEED:{" "}
                {monster.speed} DEF: {monster.defense}
              </p>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Item</th>
                      <th scope="col">Chance</th>
                      <th scope="col">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monster.drops.map((drop, i) => (
                      <tr key={i}>
                        <td
                          className="show-cursor"
                          onClick={() => {
                            setItem(drop);
                            setOpen(true);
                          }}
                        >
                          <img
                            src={`../items/${drop.originalName}/icon.png`}
                            alt={drop.item}
                          ></img>
                          {drop.item}
                        </td>
                        <td>{drop.chance / 1000 + "%"}</td>
                        <td>{drop.max || 1}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </li>
              <li className="list-group-item">
                <div>
                  Weaknesses:
                  {monster.elements &&
                    monster.elements.map((element, i) => (
                      <p className="card-text" key={i}>
                        {element.name + " " + element.value + "%"}
                      </p>
                    ))}
                </div>
              </li>
              <li className="list-group-item">
                <p>
                  Immunity:{" "}
                  {monster.immunities &&
                    monster.immunities.map((immunitie, i) => (
                      <span className="card-text" key={i}>
                        {immunitie.name + " "}
                      </span>
                    ))}
                </p>
              </li>
            </ul>
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
