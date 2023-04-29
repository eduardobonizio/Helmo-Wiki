const fs = require("fs");
const path = require("path");

const monsters = [];

const jsonsInDir = fs
  .readdirSync("./monsters")
  .filter((file) => path.extname(file) === ".json");
jsonsInDir.forEach((file) => {
  const fileData = fs.readFileSync(path.join("./monsters", file));
  const json = JSON.parse(fileData.toString());
  monsters.push(json);
});

fs.writeFile("monsters.json", JSON.stringify(monsters), "utf8", function (err) {
  if (err) {
    console.log("An error occured while writing JSON Object to File.");
    return console.log(err);
  }

  console.log("JSON file has been saved.");
});
