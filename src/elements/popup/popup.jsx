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
              (item) => item.item === drop.item
            );
            if (monsterWithDrop.length > 0) {
              return <span key={i}>{monster.id}, </span>;
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
