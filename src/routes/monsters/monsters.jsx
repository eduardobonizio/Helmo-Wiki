import monsters from "../../data/monsters.json";
import React, { useState } from "react";
import Popup from "../../elements/popup/popup";

const gifImg = (item) => {
  const itensWithGif = [
    "sanguine_axe",
    "sanguine_blade",
    "sanguine_boots",
    "sanguine_bow",
    "sanguine_crossbow",
    "sanguine_galoshes",
    "sanguine_greaves",
    "sanguine_hatchet",
    "sanguine_legs",
    "sanguine_rod",
    "sanguine_sword",
    "sanguine_wand",
    "mystic_glacier_shield",
    "warlord_sword",
    "blue_plasma_amulet",
    "blue_plasma_ring",
    "green_plasma_amulet",
    "green_plasma_ring",
    "red_plasma_amulet",
    "red_plasma_ring",
    "mystic_glacier_book",
    "mystic_glacier_bow",
    "mystic_glacier_crossbow",
    "mystic_glacier_rod",
    "mystic_glacier_sword",
    "mystic_glacier_wand",
    "prismatic_ring",
    "icestorm_rod",
    "thunder_hammer",
    "thunder_wand",
    "necro_rod",
    "demon_shield",
    "durable_exercise_bow",
    "durable_exercise_melee",
    "durable_exercise_shield",
    "durable_exercise_wand",
    "exercise_bow",
    "exercise_melee",
    "exercise_shield",
    "exercise_wand",
    "gold_floor",
    "hanger_ghost_skeleton",
    "hanger_platinum",
    "moonsun",
    "sanguine_bagpack",
    "santa_doll",
    "scroll_buff_exp",
  ];
  console.log(item);

  if (itensWithGif.includes(item.originalName)) {
    return `../items/${item.originalName}/download.gif`;
  } else {
    return `../items/${item.originalName}/icon.png`;
  }
};

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
                {monster.speed} DEF: {monster.defense} Exp/HP:{" "}
                {monster.expPerHp.toFixed(2)}
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
                            src={gifImg(drop)}
                            alt={drop.item}
                            style={{ "margin-right": "2px", width: "20px" }}
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
