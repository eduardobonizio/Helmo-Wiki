import items from "../../data/items.json";
import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

const gifImg = (item) => {
  const itensWithGif = [
    "sanguine_axe", "sanguine_blade", "sanguine_boots", "sanguine_bow",
    "sanguine_crossbow", "sanguine_galoshes", "sanguine_greaves", "sanguine_hatchet",
    "sanguine_legs", "sanguine_rod", "sanguine_sword", "sanguine_wand",
    "mystic_glacier_shield", "warlord_sword", "blue_plasma_amulet", "blue_plasma_ring",
    "green_plasma_amulet", "green_plasma_ring", "red_plasma_amulet", "red_plasma_ring",
    "mystic_glacier_book", "mystic_glacier_bow", "mystic_glacier_crossbow", "mystic_glacier_rod",
    "mystic_glacier_sword", "mystic_glacier_wand", "prismatic_ring", "icestorm_rod",
    "thunder_hammer", "thunder_wand", "necro_rod", "demon_shield", "durable_exercise_bow",
    "durable_exercise_melee", "durable_exercise_shield", "durable_exercise_wand",
    "exercise_bow", "exercise_melee", "exercise_shield", "exercise_wand", "gold_floor",
    "hanger_ghost_skeleton", "hanger_platinum", "moonsun", "sanguine_bagpack",
    "santa_doll", "scroll_buff_exp", "celestial_axe", "celestial_bow", "celestial_book",
    "celestial_crossbow", "celestial_ring", "celestial_rod", "celestial_shield",
    "celestial_sword", "celestial_wand", "soft_boots", "hanger_trailblazer",
    "santa_bagpack", "santa_boots", "receptacle_of_spirits", "garland", "enchanted_torch",
    "christmas_tree", "blazing_bone", "viper_rod",
  ];

  if (itensWithGif.includes(item.originalName)) {
    return `../items/${item.originalName}/download.gif`;
  } else {
    return `../items/${item.originalName}/icon.png`;
  }
};

const renderStatBadge = (label, value, colorClass = "bg-secondary") => {
  if (!value || value === 0) return null;
  return <span className={`badge ${colorClass} me-1 mb-1`} style={{ fontSize: "0.75rem" }}>{label}: {value}</span>;
};

function Item() {
  const [classe, setClasse] = useState("-1");
  const [sortByResis, setSortByResis] = useState("all");
  const [itemType, setItemType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [displayCount, setDisplayCount] = useState(20);
  const { t } = useLanguage();

  // Extract unique item types for the dropdown
  const uniqueItemTypes = useMemo(() => {
    const types = new Set(items.map(i => i.equipType).filter(Boolean));
    return Array.from(types).sort();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 100 >= document.documentElement.offsetHeight) {
        setDisplayCount(prev => prev + 20);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setDisplayCount(20);
  }, [searchTerm, classe, sortByResis, itemType]);

  const filteredItems = items
    .filter((item) => {
      // Search term
      if (searchTerm !== "") {
        const term = searchTerm.toLowerCase();
        if (!item.id.toLowerCase().includes(term)) return false;
      }
      
      // Item Type
      if (itemType !== "all" && item.equipType !== itemType) return false;

      // Class
      if (classe !== "-1") {
        if (!item.vocations || (!item.vocations.includes(classe) && !item.vocations.includes("all"))) {
          return false;
        }
      }

      // Resistance
      if (sortByResis !== "all" && !item[sortByResis]) {
        return false;
      }

      return true;
    })
    .sort((a, b) => b.level - a.level);

  const itemsToDisplay = filteredItems.slice(0, displayCount);

  return (
    <div className="container mt-4">
      {/* Search Bar */}
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-8 col-lg-6">
          <input 
            type="text" 
            className="form-control form-control-lg shadow-sm" 
            placeholder={t("search_items")} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderRadius: '20px' }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
        <select className="form-select shadow-sm" style={{ width: 'auto', minWidth: '150px' }} value={classe} onChange={(e) => setClasse(e.target.value)}>
          <option value="-1">{t("class_all")}</option>
          <option value="0">{t("class_warrior")}</option>
          <option value="1">{t("class_archer")}</option>
          <option value="2">{t("class_druid")}</option>
          <option value="3">{t("class_mage")}</option>
        </select>

        <select className="form-select shadow-sm" style={{ width: 'auto', minWidth: '150px' }} value={itemType} onChange={(e) => setItemType(e.target.value)}>
          <option value="all">{t("item_type_all")}</option>
          {uniqueItemTypes.map(type => (
            <option key={type} value={type}>{t("type_label")} {type}</option>
          ))}
        </select>

        <select className="form-select shadow-sm" style={{ width: 'auto', minWidth: '150px' }} value={sortByResis} onChange={(e) => setSortByResis(e.target.value)}>
          <option value="all">{t("def_element_all")}</option>
          <option value="protectPhysical">{t("physical")}</option>
          <option value="protectDeath">{t("death")}</option>
          <option value="protectFire">{t("fire")}</option>
          <option value="protectEarth">{t("earth")}</option>
          <option value="protectIce">{t("ice")}</option>
          <option value="protectHoly">{t("holy")}</option>
          <option value="protectEnergy">{t("energy")}</option>
        </select>
      </div>

      {/* Item Grid */}
      <div className="row justify-content-center">
        {itemsToDisplay.map((item, i) => (
          <div className="col-12 col-md-6 col-lg-4 col-xl-3 d-flex justify-content-center mb-4" key={i}>
            <div className="card w-100 shadow-sm border-0 h-100" style={{ maxWidth: "23rem", borderRadius: "12px", overflow: "hidden" }}>
              
              <div className="card-header bg-dark text-white text-center fw-bold text-uppercase" style={{ letterSpacing: "1px" }}>
                {item.id}
              </div>
              
              <div className="card-body p-3 d-flex flex-column">
                <div className="d-flex align-items-center mb-2">
                  <div className="me-3 bg-light rounded d-flex justify-content-center align-items-center" style={{ width: "64px", height: "64px", flexShrink: 0 }}>
                    <img
                      src={gifImg(item)}
                      alt={item.id}
                      style={{ maxHeight: "48px", maxWidth: "48px" }}
                    />
                  </div>
                  <div>
                    <div className="fw-bold mb-1">{t("level")} {item.level || 0}</div>
                    <div className="text-muted small">
                      {item.equipType || "Item"}
                      {item.twoHand ? ` (${t("two_hand")})` : item.equipType === "Weapon" ? ` (${t("one_hand")})` : ""}
                      {item.weaponType ? ` • ${item.weaponType}` : ""}
                    </div>
                  </div>
                </div>

                {item.classification && (
                  <div className="text-center mb-2">
                    <span className="badge bg-dark w-100">{item.classification}</span>
                  </div>
                )}

                <div className="d-flex flex-wrap mt-auto">
                  {renderStatBadge(t("def"), item.defense, "bg-secondary")}
                  {renderStatBadge(t("bon_dist"), item.bonusDistance, "bg-info text-dark")}
                  {renderStatBadge(t("bon_melee"), item.bonusMelee, "bg-danger")}
                  {renderStatBadge(t("bon_magic"), item.bonusMagic, "bg-primary")}
                  {renderStatBadge(t("crit_chance"), item.critChance, "bg-warning text-dark")}
                  {renderStatBadge(t("crit_mult"), item.critMultiplier, "bg-warning text-dark")}
                  {renderStatBadge(t("range"), item.hitRange, "bg-dark")}
                  {renderStatBadge(t("min_dmg"), item.minDamage, "bg-danger")}
                  {renderStatBadge(t("max_dmg"), item.maxDamage, "bg-danger")}
                  {renderStatBadge(t("elem_dmg"), item.elementDamage, "bg-success")}
                  
                  {renderStatBadge(t("p_phys"), item.protectPhysical, "bg-secondary")}
                  {renderStatBadge(t("p_death"), item.protectDeath, "bg-dark")}
                  {renderStatBadge(t("p_fire"), item.protectFire, "bg-danger")}
                  {renderStatBadge(t("p_earth"), item.protectEarth, "bg-success")}
                  {renderStatBadge(t("p_ice"), item.protectIce, "bg-info text-dark")}
                  {renderStatBadge(t("p_holy"), item.protectHoly, "bg-warning text-dark")}
                  {renderStatBadge(t("p_energy"), item.protectEnergy, "bg-primary")}
                  
                  {item.extraElementDamage && renderStatBadge(`${t("ext")} ${item.extraElementDamage}`, item.maxDamage, "bg-primary")}
                </div>
              </div>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Item;
