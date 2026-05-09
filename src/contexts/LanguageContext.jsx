/* eslint-disable react/prop-types */
import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

const dictionary = {
  en: {
    nav_wiki: "Wiki",
    nav_monsters: "Monsters",
    nav_bosses: "Bosses",
    nav_items: "Items",
    nav_updates: "Updates",

    search_monsters: "Search monsters by name or dropped items...",
    hp: "HP",
    exp: "EXP",
    spd: "SPD",
    def: "DEF",
    exphp: "Exp/HP",
    combat_info: "Combat Info",
    attacks: "Attacks",
    dmg: "Dmg",
    cd: "CD",
    defenses: "Defenses",
    heal: "Heal",
    loot_drops: "Loot Drops",
    elements_immunities: "Elements & Immunities",
    weaknesses: "Weaknesses:",
    immunities: "Immunities:",
    search_bosses: "Search bosses by name...",
    respawn: "Respawn",
    top_drops: "Top drops",

    search_items: "Search items by name...",
    class_all: "Class: All",
    class_warrior: "Class: Warrior",
    class_archer: "Class: Archer",
    class_druid: "Class: Druid",
    class_mage: "Class: Mage",
    item_type_all: "Item Type: All",
    type_label: "Type:",
    def_element_all: "Def Element: All",
    physical: "Physical",
    death: "Death",
    fire: "Fire",
    earth: "Earth",
    ice: "Ice",
    holy: "Holy",
    energy: "Energy",
    level: "Level",
    two_hand: "2H",
    one_hand: "1H",
    bon_dist: "Bon Dist",
    bon_melee: "Bon Melee",
    bon_magic: "Bon Magic",
    crit_chance: "Crit %",
    crit_mult: "Crit Mult",
    range: "Range",
    min_dmg: "Min Dmg",
    max_dmg: "Max Dmg",
    elem_dmg: "Elem Dmg",
    p_phys: "P. Phys",
    p_death: "P. Death",
    p_fire: "P. Fire",
    p_earth: "P. Earth",
    p_ice: "P. Ice",
    p_holy: "P. Holy",
    p_energy: "P. Energy",
    ext: "Ext",

    drop_from: "Drop From:",
    updates_title: "Updates",
    updated_monsters: "Updated monsters",
    updated_items: "Updated items",
  },
  pt: {
    nav_wiki: "Wiki",
    nav_monsters: "Monstros",
    nav_bosses: "Bosses",
    nav_items: "Itens",
    nav_updates: "Updates",

    search_monsters: "Pesquise monstros pelo nome ou itens dropados...",
    hp: "Vida",
    exp: "EXP",
    spd: "VEL",
    def: "DEF",
    exphp: "Exp/Vida",
    combat_info: "Infor. Combate",
    attacks: "Ataques",
    dmg: "Dano",
    cd: "Recarga",
    defenses: "Defesas",
    heal: "Cura",
    loot_drops: "Itens Dropados",
    elements_immunities: "Elementos e Imunidades",
    weaknesses: "Fraquezas:",
    immunities: "Imunidades:",
    search_bosses: "Pesquise bosses pelo nome...",
    respawn: "Respawn",
    top_drops: "Principais drops",

    search_items: "Pesquise itens pelo nome...",
    class_all: "Classe: Todas",
    class_warrior: "Classe: Guerreiro",
    class_archer: "Classe: Arqueiro",
    class_druid: "Classe: Druida",
    class_mage: "Classe: Mago",
    item_type_all: "Tipo de Item: Todos",
    type_label: "Tipo:",
    def_element_all: "Elemento Def: Todos",
    physical: "Físico",
    death: "Morte",
    fire: "Fogo",
    earth: "Terra",
    ice: "Gelo",
    holy: "Sagrado",
    energy: "Energia",
    level: "Nível",
    two_hand: "2 Mãos",
    one_hand: "1 Mão",
    bon_dist: "Bônus Dist",
    bon_melee: "Bônus Corpo",
    bon_magic: "Bônus Mágico",
    crit_chance: "Chance Crít.",
    crit_mult: "Dano Crít.",
    range: "Alcance",
    min_dmg: "Dano Mín",
    max_dmg: "Dano Máx",
    elem_dmg: "Dano Elem.",
    p_phys: "P. Físico",
    p_death: "P. Morte",
    p_fire: "P. Fogo",
    p_earth: "P. Terra",
    p_ice: "P. Gelo",
    p_holy: "P. Sagrado",
    p_energy: "P. Energia",
    ext: "Ext",

    drop_from: "Dropado por:",
    updates_title: "Updates",
    updated_monsters: "Monstros atualizados",
    updated_items: "Itens atualizados",
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    return dictionary[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'pt' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
