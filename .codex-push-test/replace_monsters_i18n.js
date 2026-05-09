const fs = require('fs');

let content = fs.readFileSync('src/routes/monsters/monsters.jsx', 'utf8');

// Add import
content = content.replace(
  'import React, { useState, useEffect } from "react";',
  'import React, { useState, useEffect } from "react";\nimport { useLanguage } from "../../contexts/LanguageContext";'
);

// Add hook
content = content.replace(
  'const [displayCount, setDisplayCount] = useState(20);',
  'const [displayCount, setDisplayCount] = useState(20);\n  const { t } = useLanguage();'
);

// Replace strings
const replacements = {
  '"Search monsters by name or dropped items..."': 't("search_monsters")',
  'HP: ': '{t("hp")}: ',
  'EXP: ': '{t("exp")}: ',
  'SPD: ': '{t("spd")}: ',
  'DEF: ': '{t("def")}: ',
  'Exp/HP: ': '{t("exphp")}: ',
  '>Combat Info<': '>{t("combat_info")}<',
  '>Attacks<': '>{t("attacks")}<',
  '>(CD: ': '>({t("cd")}: ',
  ' Dmg: ': ' {t("dmg")}: ',
  '>Defenses<': '>{t("defenses")}<',
  ' Heal: ': ' {t("heal")}: ',
  '>Loot Drops<': '>{t("loot_drops")}<',
  '>Elements & Immunities<': '>{t("elements_immunities")}<',
  '>Weaknesses:<': '>{t("weaknesses")}<',
  '>Immunities:<': '>{t("immunities")}<'
};

for (const [search, replace] of Object.entries(replacements)) {
  content = content.split(search).join(replace);
}

fs.writeFileSync('src/routes/monsters/monsters.jsx', content);
console.log('Replaced monsters successfully');
