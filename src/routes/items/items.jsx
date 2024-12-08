import items from "../../data/items.json";
import React, { useState } from "react";

React;
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
            Element
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
                    src={`../items/${item.originalName}/icon.png`}
                    alt={item.item}
                    width={"32px"}
                    height={"32px"}
                  ></img>
                  <h5 className="card-title text-center">{item.id}</h5>
                </div>

                <p className="text-center">Level: {item.level}</p>

                <p className="text-center">Slot: {item.equipType}</p>
                {item.defense && (
                  <p className="text-center">Defense: {item.defense || 0}</p>
                )}
                {item.bonusDistance && (
                  <p className="text-center">
                    Bonus Distance: {item.bonusDistance || 0}
                  </p>
                )}
                {item.protectPhysical && (
                  <p className="text-center">
                    Protect Physical: {item.protectPhysical || 0}
                  </p>
                )}
                {item.protectDeath && (
                  <p className="text-center">
                    Protect Death: {item.protectDeath || 0}
                  </p>
                )}
                {item.protectFire && (
                  <p className="text-center">
                    Protect Fire: {item.protectFire || 0}
                  </p>
                )}
                {item.protectEarth && (
                  <p className="text-center">
                    Protect Earth: {item.protectEarth || 0}
                  </p>
                )}
                {item.protectIce && (
                  <p className="text-center">
                    Protect Ice: {item.protectIce || 0}
                  </p>
                )}
                {item.protectHoly && (
                  <p className="text-center">
                    Protect Holy: {item.protectHoly || 0}
                  </p>
                )}
                {item.minDamage && (
                  <p className="text-center">Min dmg: {item.minDamage || 0}</p>
                )}
                {item.maxDamage && (
                  <p className="text-center">Max dmg: {item.maxDamage || 0}</p>
                )}
                {item.elementDamage && (
                  <p className="text-center">
                    Element damage: {item.elementDamage || 0}
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
