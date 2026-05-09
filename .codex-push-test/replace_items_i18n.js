const fs = require('fs');

let content = fs.readFileSync('src/routes/items/items.jsx', 'utf8');

// Add import
content = content.replace(
  'import React, { useState, useEffect, useMemo } from "react";',
  'import React, { useState, useEffect, useMemo } from "react";\nimport { useLanguage } from "../../contexts/LanguageContext";'
);

// Add hook
content = content.replace(
  'const [displayCount, setDisplayCount] = useState(20);',
  'const [displayCount, setDisplayCount] = useState(20);\n  const { t } = useLanguage();'
);

// Replace strings
const replacements = {
  '"Search items by name..."': 't("search_items")',
  '>Class: All<': '>{t("class_all")}<',
  '>Class: Warrior<': '>{t("class_warrior")}<',
  '>Class: Archer<': '>{t("class_archer")}<',
  '>Class: Druid<': '>{t("class_druid")}<',
  '>Class: Mage<': '>{t("class_mage")}<',
  '>Item Type: All<': '>{t("item_type_all")}<',
  '>Type: ': '>{t("type_label")} ',
  '>Def Element: All<': '>{t("def_element_all")}<',
  '>Physical<': '>{t("physical")}<',
  '>Death<': '>{t("death")}<',
  '>Fire<': '>{t("fire")}<',
  '>Earth<': '>{t("earth")}<',
  '>Ice<': '>{t("ice")}<',
  '>Holy<': '>{t("holy")}<',
  '>Energy<': '>{t("energy")}<',
  'Level ': '{t("level")} ',
  ' (2H)': ' ({t("two_hand")})',
  ' (1H)': ' ({t("one_hand")})',
  '"DEF"': 't("def")',
  '"Bon Dist"': 't("bon_dist")',
  '"Bon Melee"': 't("bon_melee")',
  '"Bon Magic"': 't("bon_magic")',
  '"Crit %"': 't("crit_chance")',
  '"Crit Mult"': 't("crit_mult")',
  '"Range"': 't("range")',
  '"Min Dmg"': 't("min_dmg")',
  '"Max Dmg"': 't("max_dmg")',
  '"Elem Dmg"': 't("elem_dmg")',
  '"P. Phys"': 't("p_phys")',
  '"P. Death"': 't("p_death")',
  '"P. Fire"': 't("p_fire")',
  '"P. Earth"': 't("p_earth")',
  '"P. Ice"': 't("p_ice")',
  '"P. Holy"': 't("p_holy")',
  '"P. Energy"': 't("p_energy")',
  '\`Ext ': '\`${t("ext")} '
};

for (const [search, replace] of Object.entries(replacements)) {
  content = content.split(search).join(replace);
}

fs.writeFileSync('src/routes/items/items.jsx', content);
console.log('Replaced items successfully');
