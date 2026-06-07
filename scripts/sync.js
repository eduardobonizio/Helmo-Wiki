#!/usr/bin/env node
/* eslint-disable no-console */
"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const crypto = require("crypto");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const APK_ROOT = path.join(ROOT, "Helmo arquivos apk");

const APK_ITEMS_DIR = path.join(APK_ROOT, "assets", "items");
const APK_MOBS_DIR = path.join(APK_ROOT, "assets", "entities", "character", "mob");
const APK_LANG_DIR = path.join(APK_ROOT, "assets", "languages");

const WIKI_ITEMS_DIR = path.join(ROOT, "src", "data", "Items");
const WIKI_MONSTERS_DIR = path.join(ROOT, "src", "data", "monsters");
const WIKI_PUBLIC_ITEMS = path.join(ROOT, "public", "items");
const WIKI_PUBLIC_MONSTERS = path.join(ROOT, "public", "monsters");
const WIKI_UPDATES = path.join(ROOT, "src", "data", "updates.json");

const args = process.argv.slice(2);
const FLAGS = {
  dryRun: args.includes("--dry-run"),
  noCommit: args.includes("--no-commit"),
  help: args.includes("--help") || args.includes("-h"),
  lang: (args.find((a) => a.startsWith("--lang=")) || "").split("=")[1] || "portugues",
};

if (FLAGS.help) {
  console.log(
    [
      "Helmo Wiki Sync - sincroniza dados, spritesheets e assets do APK com a Wiki",
      "",
      "Uso: npm run sync [-- --dry-run] [-- --no-commit] [-- --lang=<portugues|english|polish|spanish>]",
      "",
      "  --dry-run     Apenas mostra o que mudaria. Nao copia nem commita.",
      "  --no-commit   Copia imagens, atualiza JSONs e updates.json, mas nao roda git.",
      "  --lang=<...>  Idioma para cruzar nomes vindos do APK (default: portugues).",
      "  -h, --help    Mostra esta ajuda.",
    ].join("\n")
  );
  process.exit(0);
}

const SPRITE_META_VERSION = 1;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function listDirs(parent) {
  if (!fs.existsSync(parent)) return [];
  return fs
    .readdirSync(parent, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("."))
    .map((d) => d.name);
}

function listFilesRecursive(parent, exts) {
  const out = [];
  if (!fs.existsSync(parent)) return out;
  const stack = [parent];
  while (stack.length) {
    const cur = stack.pop();
    for (const entry of fs.readdirSync(cur, { withFileTypes: true })) {
      const full = path.join(cur, entry.name);
      if (entry.isDirectory()) {
        if (!entry.name.startsWith(".")) stack.push(full);
      } else if (entry.isFile()) {
        if (!exts || exts.includes(path.extname(entry.name).toLowerCase())) {
          out.push(full);
        }
      }
    }
  }
  return out;
}

function sha1(file) {
  if (!fs.existsSync(file)) return null;
  const buf = fs.readFileSync(file);
  return crypto.createHash("sha1").update(buf).digest("hex");
}

function titleCase(slug) {
  return slug
    .replace(/_/g, " ")
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function readJsonSafe(file) {
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  try {
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

function readGameJson(file) {
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "").replace(/,\s*([}\]])/g, "$1");
  try {
    return JSON.parse(raw);
  } catch (_) {
    try {
      return Function('"use strict"; return (' + raw + ");")();
    } catch (e) {
      return null;
    }
  }
}

function writeGameJson(file, obj) {
  const text = JSON.stringify(obj, null, "\t") + "\n";
  fs.writeFileSync(file, text, "utf8");
}

function nowBr() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return {
    date: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}

async function imageMeta(file) {
  try {
    const meta = await sharp(file).metadata();
    return { width: meta.width || 0, height: meta.height || 0 };
  } catch (_) {
    return { width: 0, height: 0 };
  }
}

function itemSpriteMeta(width, height) {
  const frameSize = height;
  const isSprite = width > frameSize && height > 0;
  const frames = isSprite ? Math.max(1, Math.round(width / frameSize)) : 1;
  return {
    isSprite,
    type: "item",
    sprite: "icon.png",
    frameSize: frameSize,
    frames: frames,
    spriteWidth: width,
    spriteHeight: height,
  };
}

function monsterSpriteMeta(width, height, monsterJson) {
  const directions = 4;
  const frameSize = height > 0 ? Math.max(1, Math.round(height / directions)) : 32;
  const framesPerDirection = width > 0 ? Math.max(1, Math.round(width / frameSize)) : 1;
  return {
    isSprite: framesPerDirection > 1,
    type: "monster",
    sprite: "walk_0.png",
    frameSize: frameSize,
    framesPerDirection: framesPerDirection,
    directions: directions,
    spriteWidth: width,
    spriteHeight: height,
  };
}

function mergeSpriteMeta(target, meta) {
  target.sprite = meta.sprite;
  target.spriteType = meta.type;
  target.frameSize = meta.frameSize;
  target.spriteWidth = meta.spriteWidth;
  target.spriteHeight = meta.spriteHeight;
  if (meta.type === "monster") {
    target.framesPerDirection = meta.framesPerDirection;
    target.directions = meta.directions;
  } else if (meta.type === "item") {
    target.frames = meta.frames;
  }
  target.spriteMetaVersion = SPRITE_META_VERSION;
  return target;
}

function copyFileSync({ srcFile, dstFile }) {
  ensureDir(path.dirname(dstFile));
  fs.copyFileSync(srcFile, dstFile);
}

function run(cmd) {
  if (FLAGS.dryRun) {
    console.log(`  [dry-run] $ ${cmd}`);
    return "";
  }
  return execSync(cmd, { stdio: "pipe", encoding: "utf8" }).trim();
}

function walkMobSprites() {
  const out = [];
  for (const cat of listDirs(APK_MOBS_DIR)) {
    const catDir = path.join(APK_MOBS_DIR, cat);
    for (const name of listDirs(catDir)) {
      const png = path.join(catDir, name, "walk_0.png");
      if (fs.existsSync(png)) out.push({ name, srcFile: png });
    }
  }
  return out;
}

async function syncItemSprites() {
  const stats = { copied: 0, updated: 0, jsonTouched: 0, jsonFailed: 0, isSprite: 0 };
  if (!fs.existsSync(APK_ITEMS_DIR)) return stats;
  for (const name of listDirs(APK_ITEMS_DIR)) {
    const srcFile = path.join(APK_ITEMS_DIR, name, "icon.png");
    if (!fs.existsSync(srcFile)) continue;
    const dstFile = path.join(WIKI_PUBLIC_ITEMS, name, "icon.png");
    const srcHash = sha1(srcFile);
    const dstHash = sha1(dstFile);
    if (srcHash !== dstHash) {
      if (!FLAGS.dryRun) copyFileSync({ srcFile, dstFile });
      stats.copied += 1;
    }
    const meta = await imageMeta(srcFile);
    const spriteMeta = itemSpriteMeta(meta.width, meta.height);
    if (spriteMeta.isSprite) stats.isSprite += 1;
    const jsonFile = path.join(WIKI_ITEMS_DIR, `${name}.json`);
    if (fs.existsSync(jsonFile)) {
      const obj = readGameJson(jsonFile) || {};
      const before = JSON.stringify(obj);
      mergeSpriteMeta(obj, spriteMeta);
      if (JSON.stringify(obj) !== before) {
        if (!FLAGS.dryRun) writeGameJson(jsonFile, obj);
        stats.jsonTouched += 1;
      }
    }
  }
  return stats;
}

async function syncMonsterSprites() {
  const stats = { copied: 0, jsonTouched: 0, isSprite: 0, missingJson: [] };
  const mobs = walkMobSprites();
  for (const { name, srcFile } of mobs) {
    const dstFile = path.join(WIKI_PUBLIC_MONSTERS, name, "walk_0.png");
    const srcHash = sha1(srcFile);
    const dstHash = sha1(dstFile);
    if (srcHash !== dstHash) {
      if (!FLAGS.dryRun) copyFileSync({ srcFile, dstFile });
      stats.copied += 1;
    }
    const meta = await imageMeta(srcFile);
    const jsonFile = path.join(WIKI_MONSTERS_DIR, `${name}.json`);
    const monsterJson = fs.existsSync(jsonFile) ? readGameJson(jsonFile) : null;
    if (!monsterJson) {
      stats.missingJson.push(name);
      continue;
    }
    const spriteMeta = monsterSpriteMeta(meta.width, meta.height, monsterJson);
    if (spriteMeta.isSprite) stats.isSprite += 1;
    const before = JSON.stringify(monsterJson);
    mergeSpriteMeta(monsterJson, spriteMeta);
    if (JSON.stringify(monsterJson) !== before) {
      if (!FLAGS.dryRun) writeGameJson(jsonFile, monsterJson);
      stats.jsonTouched += 1;
    }
  }
  return stats;
}

function diffDataStructures() {
  const result = { newItems: [], newMonsters: [], missingInApk: [] };
  if (fs.existsSync(APK_ITEMS_DIR)) {
    const apkItems = new Set(listDirs(APK_ITEMS_DIR));
    const wikiItems = new Set(
      fs
        .readdirSync(WIKI_ITEMS_DIR)
        .filter((f) => f.endsWith(".json"))
        .map((f) => f.replace(".json", ""))
    );
    for (const w of wikiItems) if (!apkItems.has(w)) result.missingInApk.push(w);
    for (const a of apkItems) if (!wikiItems.has(a)) result.newItems.push(a);
  }
  if (fs.existsSync(APK_MOBS_DIR)) {
    const apkMobs = new Set(walkMobSprites().map((m) => m.name));
    const wikiMonsters = new Set(
      fs
        .readdirSync(WIKI_MONSTERS_DIR)
        .filter((f) => f.endsWith(".json"))
        .map((f) => f.replace(".json", ""))
    );
    for (const w of wikiMonsters) if (!apkMobs.has(w) && w !== "desktop") result.missingInApk.push(w);
    for (const a of apkMobs) if (!wikiMonsters.has(a)) result.newMonsters.push(a);
  }
  return result;
}

function prependUpdate(entry) {
  const list = readJsonSafe(WIKI_UPDATES) || [];
  list.unshift(entry);
  if (!FLAGS.dryRun) {
    fs.writeFileSync(WIKI_UPDATES, JSON.stringify(list, null, 2) + "\n", "utf8");
  }
}

async function main() {
  if (!fs.existsSync(APK_ROOT)) {
    console.error(`[erro] Pasta do APK nao encontrada: ${APK_ROOT}`);
    console.error("       Coloque o APK descompactado em 'Helmo arquivos apk/' na raiz do projeto.");
    process.exit(1);
  }

  console.log("== Helmo Wiki Sync (Spritesheet Mode) ==");
  console.log(`APK : ${APK_ROOT}`);
  console.log(`Wiki: ${ROOT}`);
  console.log(`Modo: ${FLAGS.dryRun ? "DRY-RUN" : FLAGS.noCommit ? "WRITE (sem commit)" : "WRITE + COMMIT"}`);
  console.log(`Lang: ${FLAGS.lang}\n`);

  const itemStats = await syncItemSprites();
  const monsterStats = await syncMonsterSprites();
  const dataDiff = diffDataStructures();

  console.log(">> Spritesheets de ITENS:");
  console.log(`   copiadas:         ${itemStats.copied}`);
  console.log(`   sprites reais:    ${itemStats.isSprite}`);
  console.log(`   JSONs atualizados: ${itemStats.jsonTouched}`);

  console.log("\n>> Spritesheets de MONSTROS:");
  console.log(`   copiados:         ${monsterStats.copied}`);
  console.log(`   sprites reais:    ${monsterStats.isSprite}`);
  console.log(`   JSONs atualizados: ${monsterStats.jsonTouched}`);
  console.log(`   monstros sem JSON: ${monsterStats.missingJson.length}`);

  console.log("\n>> Diferencas estruturais:");
  console.log(`   itens novos no APK:    ${dataDiff.newItems.length}`);
  console.log(`   monstros novos no APK: ${dataDiff.newMonsters.length}`);
  console.log(`   faltando no APK:       ${dataDiff.missingInApk.length}`);
  if (dataDiff.newMonsters.length) {
    console.log("     " + dataDiff.newMonsters.sort().join(", "));
  }

  const stamp = nowBr();
  const changes = [
    `Sincronizacao automatica de spritesheets (PNG) do APK`,
    `${itemStats.copied} sprite(s) de itens e ${monsterStats.copied} de monstros foram copiadas para public/`,
    `${itemStats.isSprite + monsterStats.isSprite} sprite(s) sao spritesheets reais (multiplos frames)`,
    `Metadados de sprite (sprite, spriteFrames, spriteWidth, spriteHeight, frameWidth, frameHeight) foram injetados nos JSONs em src/data/`,
  ];
  if (dataDiff.newMonsters.length) {
    changes.push(`${dataDiff.newMonsters.length} monstro(s) novo(s) no APK sem JSON: ${dataDiff.newMonsters.join(", ")}`);
  }
  if (dataDiff.newItems.length) {
    changes.push(`${dataDiff.newItems.length} item(ns) novo(s) no APK sem JSON`);
  }

  const entry = {
    date: stamp.date,
    time: stamp.time,
    changes,
  };
  if (dataDiff.newMonsters.length) {
    entry.updatedMonsters = dataDiff.newMonsters.map(titleCase).sort();
  }
  if (!FLAGS.dryRun) prependUpdate(entry);
  console.log(`\n>> Entrada adicionada em src/data/updates.json (${stamp.date} ${stamp.time}).`);

  if (!FLAGS.dryRun) {
    console.log("\n>> Regenerando items.json e monsters.json (src/data/generate data.js)...");
    try {
      run('node "src/data/generate data.js"');
      console.log("   items.json e monsters.json atualizados.");
    } catch (e) {
      console.error("   [aviso] Falha ao regenerar consolidados. Rode manualmente: node \"src/data/generate data.js\"");
    }
  }

  if (FLAGS.noCommit || FLAGS.dryRun) {
    console.log("\n[ok] Sincronizacao concluida (sem commit).");
    return;
  }

  console.log("\n>> Git: adicionando e commitando...");
  run("git add .");
  const status = run("git status --porcelain");
  if (!status) {
    console.log("   Nenhuma alteracao para comitar.");
  } else {
    const msg = `Auto-update: Spritesheets e dados sincronizados (${stamp.date} ${stamp.time})`;
    run(`git commit -m "${msg}"`);
    console.log(`   Commit: ${msg}`);
    try {
      run("git push");
      console.log("   Push enviado. Vercel fara o deploy em seguida.");
    } catch (_) {
      console.error("   [aviso] git push falhou. Commit local criado, faca push manual.");
    }
  }
  console.log("\n[ok] Concluido.");
}

main().catch((err) => {
  console.error("\n[erro]", err && err.message ? err.message : err);
  process.exit(1);
});
