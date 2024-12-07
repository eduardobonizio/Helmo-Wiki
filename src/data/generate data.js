/* eslint-disable no-undef */
const fs = require("fs");
const path = require("path");

const monsters = [];

const jsonsInDir = fs
  .readdirSync("./src/data/monsters")
  .filter((file) => path.extname(file) === ".json");
jsonsInDir.forEach((file) => {
  console.log("Last monster: ", file);
  const fileData = fs.readFileSync(path.join("./src/data/monsters", file));
  const json = JSON.parse(fileData.toString());
  monsters.push(json);
});

const letrasMaiusculas = (text) => {
  const palavras = text.replaceAll("_", " ").split(" ");
  for (let i = 0; i < palavras.length; i++) {
    palavras[i] = palavras[i][0].toUpperCase() + palavras[i].substr(1);
  }

  return palavras.join(" ");
};

const monstersFix = monsters.map((monster) => {
  if (monster.id === "night_mare") monster.id = "Nightmare";
  if (monster.id === "night_mare_hand") monster.id = "Nightmare_Hand";

  monster.id = letrasMaiusculas(monster.id);

  if (monster.drops) {
    monster.drops.forEach((current) => {
      current.originalName = current.item;
      current.item = letrasMaiusculas(current.item);
    });
  }

  if (!monster.elements) return monster;
  monster.elements.forEach((element) => {
    element.name = letrasMaiusculas(element.name);
  });
  monster.elements.sort((a, b) => b.value - a.value);
  return monster;
});

fs.writeFile(
  "./src/data/monsters.json",
  JSON.stringify(monstersFix),
  "utf8",
  function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("Monsters JSON file has been saved.");
  },
);

const items = [];

const jsonsInDirItems = fs
  .readdirSync("./src/data/items")
  .filter((file) => path.extname(file) === ".json");
jsonsInDirItems.forEach((file) => {
  console.log("Last item: ", file);
  const fileData = fs.readFileSync(path.join("./src/data/items", file));
  const json = JSON.parse(fileData.toString());
  json.id = letrasMaiusculas(file);
  items.push(json);
});

fs.writeFile(
  "./src/data/items.json",
  JSON.stringify(items),
  "utf8",
  function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("Items JSON file has been saved.");
  },
);
