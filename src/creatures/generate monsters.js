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
