const fs = require("fs");
const path = require("path");

const monsters = [];

const jsonsInDir = fs
  .readdirSync("./src/creatures/monsters")
  .filter((file) => path.extname(file) === ".json");
jsonsInDir.forEach((file) => {
  const fileData = fs.readFileSync(path.join("./src/creatures/monsters", file));
  const json = JSON.parse(fileData.toString());
  monsters.push(json);
});

const monstersFix = monsters.map((monster) => {
  if (!monster.elements) return monster;
  monster.elements.sort((a, b) => b.value - a.value);
  return monster;
});

fs.writeFile(
  "./src/creatures/monsters.json",
  JSON.stringify(monstersFix),
  "utf8",
  function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("JSON file has been saved.");
  }
);
