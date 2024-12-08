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
  json.id = letrasMaiusculas(file.replace(".json", ""));
  json.originalName = file.replace(".json", "");
  if (json.originalName.includes("potion")) return;
  const vocs = [];
  if (json.vocations) {
    json.vocations.forEach((vocation) => vocs.push(vocation.name));
  }
  if (!json.vocations) vocs.push("all");
  json.vocations = vocs;
  if (!json.level) json.level = 0;
  if (json.equipType && json.equipType == -1) json.equipType = "Resource";
  if ((json.equipType && json.equipType == 0) || json.equipType == false)
    json.equipType = "Amulet";

  if (json.equipType && json.equipType == 1) json.equipType = "Head";
  if (json.equipType && json.equipType == 2) json.equipType = "Backpack";
  if (json.equipType && json.equipType == 3) json.equipType = "Weapon";
  if (json.equipType && json.equipType == 4) json.equipType = "Armor";
  if (json.equipType && json.equipType == 5) json.equipType = "Shield";
  if (json.equipType && json.equipType == 6) json.equipType = "Ring";
  if (json.equipType && json.equipType == 7) json.equipType = "Pants";
  if (json.equipType && json.equipType == 8) json.equipType = "Ammo";
  if (json.equipType && json.equipType == 9) json.equipType = "Accessory";
  if (json.equipType && json.equipType == 10) json.equipType = "Shoes";
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
