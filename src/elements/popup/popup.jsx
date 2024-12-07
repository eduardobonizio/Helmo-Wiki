/* eslint-disable react/prop-types */
import React from "react";
import "./Popup.css";
export const Popup = ({ drop, closePopup, monsters }) => {
  return (
    <div className="popup-container">
      <div className="popup-body">
        <h3>{drop.item}</h3>
        <div>
          <div>Drop From:</div>
          {monsters.map((monster, i) => {
            const monsterWithDrop = monster.drops.filter(
              (item) => item.item === drop.item,
            );
            if (monsterWithDrop.length > 0) {
              return (
                <div key={i}>
                  {monster.id}{" "}
                  {monster.drops.find((item) => item.item === drop.item)
                    .chance / 1000}
                  % ,{" "}
                </div>
              );
            }
            return false;
          })}
        </div>
        <button
          type="button"
          className="close-button btn btn-light"
          onClick={closePopup}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default Popup;
