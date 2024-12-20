import items from "../../data/items.json";
import React, { useState } from "react";

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

  if (itensWithGif.includes(item.originalName)) {
    return `../items/${item.originalName}/download.gif`;
  } else {
    return `../items/${item.originalName}/icon.png`;
  }
};

function Item() {
  const [classe, setClasse] = useState("-1");
  const [sortByResis, setSortByResis] = useState("all");
  return (
    <div className="container d-inline">
      <div className="container d-flex justify-content-around">
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Class
          </button>
          <ul className="dropdown-menu">
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => {
                  setClasse(-1);
                }}
              >
                All
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => {
                  setClasse("0");
                }}
              >
                Warrior
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => {
                  setClasse("1");
                }}
              >
                Archer
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => {
                  setClasse("2");
                }}
              >
                Druid
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => {
                  setClasse("3");
                }}
              >
                Mage
              </a>
            </li>
          </ul>
        </div>
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Defensive Element
          </button>
          <ul className="dropdown-menu">
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => {
                  setSortByResis("all");
                }}
              >
                All
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => {
                  setSortByResis("protectPhysical");
                }}
              >
                Physical
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => {
                  setSortByResis("protectDeath");
                }}
              >
                Death
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => {
                  setSortByResis("protectFire");
                }}
              >
                Fire
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => {
                  setSortByResis("protectEarth");
                }}
              >
                Earth
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => {
                  setSortByResis("protectIce");
                }}
              >
                Ice
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => {
                  setSortByResis("protectHoly");
                }}
              >
                Holy
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => {
                  setSortByResis("protectEnergy");
                }}
              >
                Energy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="row justify-content-around">
        {items
          .filter((item) => {
            if (classe == -1 && sortByResis == "all") return item;
            if (classe == -1 && item[sortByResis]) return item;
            if (
              (item.vocations.includes(classe) && item[sortByResis]) ||
              (item.vocations.includes("all") && item[sortByResis]) ||
              (item.vocations.includes(classe) && sortByResis == "all")
            )
              return item;
          })
          .sort((a, b) => b.level - a.level)
          .map((item, i) => (
            <div
              className="card d-block mt-2"
              style={{ width: "23rem" }}
              key={i}
            >
              <div className="card-body">
                <div className="d-flex justify-content-center">
                  <img
                    src={gifImg(item)}
                    alt={item.item}
                    style={{
                      height: "32px",
                    }}
                  ></img>
                  <h5 className="card-title text-center">{item.id}</h5>
                </div>

                <p className="text-center">Level: {item.level}</p>

                <p className="text-center">Slot: {item.equipType}</p>

                {item.weaponType != 0 && item.weaponType && (
                  <p className="text-center">Weapon Type: {item.weaponType}</p>
                )}

                {item.twoHand != 0 && item.twoHand && (
                  <p className="text-center">Two Handed: Yes</p>
                )}

                {item.defense != 0 && item.defense && (
                  <p className="text-center">Defense: {item.defense}</p>
                )}

                {item.bonusDistance != 0 && item.bonusDistance && (
                  <p className="text-center">
                    Bonus Distance: {item.bonusDistance}
                  </p>
                )}

                {item.critChance && item.critChance != 0 && (
                  <p className="text-center">Crit Chance: {item.critChance}</p>
                )}

                {item.critMultiplier != 0 && item.critMultiplier && (
                  <p className="text-center">
                    Crit Mult: {item.critMultiplier}
                  </p>
                )}

                {item.hitRange != 0 && item.hitRange && (
                  <p className="text-center">Hit Range: {item.hitRange}</p>
                )}

                {item.protectPhysical != 0 && item.protectPhysical && (
                  <p className="text-center">
                    Protect Physical: {item.protectPhysical}
                  </p>
                )}
                {item.protectDeath != 0 && item.protectDeath && (
                  <p className="text-center">
                    Protect Death: {item.protectDeath}
                  </p>
                )}
                {item.protectFire != 0 && item.protectFire && (
                  <p className="text-center">
                    Protect Fire: {item.protectFire}
                  </p>
                )}
                {item.protectEarth != 0 && item.protectEarth && (
                  <p className="text-center">
                    Protect Earth: {item.protectEarth}
                  </p>
                )}
                {item.protectIce != 0 && item.protectIce && (
                  <p className="text-center">Protect Ice: {item.protectIce}</p>
                )}
                {item.protectHoly != 0 && item.protectHoly && (
                  <p className="text-center">
                    Protect Holy: {item.protectHoly}
                  </p>
                )}
                {item.protectEnergy != 0 && item.protectEnergy && (
                  <p className="text-center">
                    Protect Energy: {item.protectEnergy}
                  </p>
                )}

                {item.elementDamage && item.extraElementDamage && (
                  <p className="text-center">
                    {item.elementDamage} dmage: {item.minDamage}
                  </p>
                )}
                {item.elementDamage && item.extraElementDamage && (
                  <p className="text-center">
                    {item.extraElementDamage} dmage: {item.maxDamage}
                  </p>
                )}

                {item.minDamage != 0 &&
                  !item.extraElementDamage &&
                  item.minDamage && (
                    <p className="text-center">Min dmg: {item.minDamage}</p>
                  )}
                {item.maxDamage != 0 &&
                  !item.extraElementDamage &&
                  item.maxDamage && (
                    <p className="text-center">Max dmg: {item.maxDamage}</p>
                  )}
                {item.elementDamage != 0 &&
                  !item.extraElementDamage &&
                  item.elementDamage && (
                    <p className="text-center">
                      Element damage: {item.elementDamage}
                    </p>
                  )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Item;
