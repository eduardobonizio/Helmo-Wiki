import "bootstrap/dist/css/bootstrap.css";
import monsters from "./creatures/monsters.json";

function App() {
  return (
    <div className="container d-flex">
      <div className="row justify-content-around">
        {monsters.map((monster) => (
          <div className="card d-block mt-2" style={{ width: "23rem" }}>
            <div className="card-body">
              <h5 className="card-title text-center">{monster.id}</h5>
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
                  {monster.drops.map((drop) => (
                    <tbody>
                      <td>{drop.item}</td>
                      <td>{drop.chance / 1000 + "%"}</td>
                      <td>{drop.max || 1}</td>
                    </tbody>
                  ))}
                </table>
              </li>
              <li className="list-group-item">
                <p>
                  Weaknesses:
                  {monster.elements &&
                    monster.elements.map((element) => (
                      <div className="card-text">
                        {element.name + " " + element.value + "%"}
                      </div>
                    ))}
                </p>
              </li>
              <li className="list-group-item">
                <p>
                  Immunity:{" "}
                  {monster.immunities &&
                    monster.immunities.map((immunitie) => (
                      <span className="card-text">{immunitie.name + " "}</span>
                    ))}
                </p>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
