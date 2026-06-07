# AGENTS.md — Manual de Manutenção da Helmo Wiki

> **Propósito**: este arquivo é um *system prompt* para qualquer IA (Claude, GPT, Gemini, etc.) que for solicitada a dar manutenção, refatorar, corrigir bugs ou adicionar funcionalidades à **Helmo Wiki**. Leia **inteiro** antes de tomar qualquer ação. Se a tarefa do usuário conflitar com as regras aqui, **pergunte antes de agir**.

---

## 1. Contexto do Projeto

**Helmo Wiki** (https://helmo-wiki.vercel.app/) é uma wiki estática sobre um jogo MMORPG estilo *Tibia-like* chamado Helmo. Ela serve como referência para jogadores encontrarem informações de **monstros, itens, bosses e atualizações** do jogo.

- **Hospedagem**: [Vercel](https://vercel.com) (plano **Hobby** gratuito).
- **Domínio**: `helmo-wiki.vercel.app` (sem domínio custom).
- **Deploy**: automático a cada `git push` no branch principal (configurado no painel Vercel).
- **Monitoramento**: [Vercel Web Analytics](https://vercel.com/docs/analytics) + [Vercel Speed Insights](https://vercel.com/docs/speed-insights) (gratuitos, ambos ativados).
- **Idioma da interface**: multilíngue (`en` e `pt-BR`) controlado pelo contexto `LanguageContext`.

### Stack técnica (NÃO MUDE sem pedir)

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | React | 19.x |
| Bundler / DevServer | Create React App (react-scripts) | 5.0.1 |
| Roteamento | react-router-dom (BrowserRouter) | 7.x |
| UI | Bootstrap | 5.3.x (CSS + JS bundle) |
| Web Vitals | web-vitals | 5.x |
| Otimização | @vercel/analytics + @vercel/speed-insights | 2.x |
| Build | `npm run build` → `/build` (servido pela Vercel) |

> ⚠️ **react-scripts (CRA 5) está deprecated**. Migrar para Vite ou Next.js é possível, mas é uma decisão de longo prazo. **Não sugira migração espontaneamente** — só se o usuário pedir explicitamente.

---

## 2. Arquitetura de Dados

```
helmo-wiki/
├── public/                       # Assets estáticos servidos pela Vercel
│   ├── items/<originalName>/     # Ícones de itens: icon.png (ou download.gif)
│   └── monsters/<originalName>/  # Sprites: walk.gif + walk_0.png
├── src/
│   ├── data/                     # FONTE DE VERDADE dos dados do jogo
│   │   ├── Items/<name>.json     # JSON cru de cada item (formato de jogo; chaves podem estar sem aspas)
│   │   ├── monsters/<name>.json  # JSON cru de cada monstro
│   │   ├── items.json            # ← consolidado, gerado por `generate data.js`
│   │   ├── monsters.json         # ← consolidado, gerado por `generate data.js`
│   │   ├── bosses.json           # Lista de `originalName` que são bosses
│   │   ├── updates.json          # Histórico de mudanças (mais recente PRIMEIRO)
│   │   └── generate data.js      # Script que consolida os JSONs crus em items.json / monsters.json
│   ├── components/               # Componentes reutilizáveis (OptimizedImage, NavLink, ScrollToTop)
│   ├── contexts/LanguageContext.jsx  # i18n en/pt-BR
│   ├── elements/                 # NavBar, Popup, etc.
│   └── routes/
│       ├── monsters/             # /monsters
│       ├── bosses/               # /bosses
│       ├── items/                # /items
│       └── updates/              # /updates (renderiza src/data/updates.json)
├── scripts/sync.js               # Script de sincronização APK → Wiki
├── vercel.json                   # Config da Vercel (rewrites, cache, image opt)
├── package.json                  # Deps + scripts
└── agents.md                     # Este arquivo
```

### Regras dos caminhos

- **Itens**:
  - JSON cru: `src/data/Items/<originalName>.json` (com `I` maiúsculo — em Linux isso importa!)
  - Imagem: `public/items/<originalName>/icon.png` (ou `download.gif` para itens animados)
  - `originalName` é o slug em **snake_case** (ex: `albino_dragon_scale`).
- **Monstros**:
  - JSON cru: `src/data/monsters/<originalName>.json` (com `m` minúsculo)
  - Imagem: `public/monsters/<originalName>/walk.gif` (animado) + `walk_0.png` (estático).
  - `originalName` em snake_case; exceções notáveis mapeadas em `generate data.js` (`night_mare → Nightmare`, `dragonLord → Dragon Lord`, `slime_crow → Slime Crown`).
- **Updates**: `src/data/updates.json` é um **array de objetos**, **mais recente no topo (índice 0)**.

> 🐛 **Bug conhecido**: `generate data.js` referencia `./src/data/items` (com `i` minúsculo) mas a pasta real é `Items`. Funciona em Windows (case-insensitive) mas **quebra em Linux/Mac** (e em CI/Vercel usa Linux). Se o usuário reportar isso, corrija para `./src/data/Items`.

---

## 3. Pipeline de Dados

Quando o usuário adiciona/edita um monstro ou item, o fluxo é:

1. **Editar/Adicionar** o JSON cru em `src/data/Items/<name>.json` ou `src/data/monsters/<name>.json`.
2. **Rodar** `node "src/data/generate data.js"` para regenerar `items.json` e `monsters.json` (esses são os que os componentes importam).
3. **Adicionar imagens** em `public/items/<name>/` ou `public/monsters/<name>/`.
4. **Registrar** a mudança em `src/data/updates.json` (no topo do array).
5. **Commit + push** → Vercel faz deploy automático.

> 💡 Ou use `npm run sync` para automatizar os passos 3, 4 e 5 (ver Seção 6).

---

## 4. Componentes Importantes

| Componente | Caminho | O que faz |
|---|---|---|
| `SpriteImage` | `src/components/SpriteImage.js` | **Padrão para monstros e itens.** Renderiza spritesheets PNG via `<canvas>` desenhando 1 frame por vez com `setInterval`. Veja Seção 4.1. |
| `OptimizedImage` | `src/components/OptimizedImage.js` | Para imagens estáticas (drops na tabela, ícones auxiliares). Roteia para `/_vercel/image?…` em produção (AVIF/WebP automáticos). Em dev usa o src direto. |
| `NavLink` | `src/components/NavLink.js` | Wrapper do `<Link>` do react-router-dom com **prefetch do chunk da rota no hover/focus/touch**. Use no lugar de `<a href>` para navegação interna. |
| `ScrollToTop` | `src/components/ScrollToTop.js` | Reseta scroll ao trocar de rota. Já está montado no `App.js`. |
| `LanguageContext` | `src/contexts/LanguageContext.jsx` | Contexto i18n. Use o hook `useLanguage()` para acessar `t(chave)` e `language`. |
| `Popup` | `src/elements/popup/popup.jsx` | Modal genérico (ex: detalhes de item ao clicar num drop). |

### 4.1. Sistema de Spritesheets (regras obrigatórias)

A Wiki usa **spritesheets PNG estáticos desenhados via `<canvas>`** (não GIF, não CSS animation). O sistema separa **duas categorias** com estruturas diferentes.

#### Categoria 1 — ITENS (1 linha horizontal)

- **Estrutura do PNG:** apenas 1 linha horizontal contendo X frames quadrados.
- **Cálculo** (em `scripts/sync.js → itemSpriteMeta`):
  - `frameSize = height` (a altura é o tamanho do frame).
  - `frames = width / frameSize`.
  - Ex.: `sanguine_axe/icon.png` (96x16) → `frameSize: 16, frames: 6`.
- **JSON injetado** em `src/data/Items/<name>.json`:
  ```json
  {
    "sprite": "icon.png",
    "spriteType": "item",
    "frameSize": 16,
    "frames": 6,
    "spriteWidth": 96,
    "spriteHeight": 16,
    "spriteMetaVersion": 1
  }
  ```

#### Categoria 2 — MONSTROS (matriz 4 direções × N frames)

- **Estrutura do PNG:** 4 linhas verticais (na ordem **Sul, Norte, Leste, Oeste**) com N frames de caminhada por linha. Frames são quadrados.
- **Cálculo** (em `scripts/sync.js → monsterSpriteMeta`):
  - `frameSize = height / 4` (a altura total dividida por 4 direções).
  - `framesPerDirection = width / frameSize`.
  - `directions = 4` (fixo).
  - Ex.: `albino_dragon/walk_0.png` (192x192) → `frameSize: 48, framesPerDirection: 4, directions: 4`.
- **JSON injetado** em `src/data/monsters/<name>.json`:
  ```json
  {
    "sprite": "walk_0.png",
    "spriteType": "monster",
    "frameSize": 48,
    "framesPerDirection": 4,
    "directions": 4,
    "spriteWidth": 192,
    "spriteHeight": 192,
    "spriteMetaVersion": 1
  }
  ```

#### Componente `SpriteImage` (em `src/components/SpriteImage.js`)

O componente renderiza via **`<canvas>` HTML5** com 3 funções internas:
- `ItemSprite` / `MonsterSprite` — adaptam props para o formato genérico `SpriteCanvas`
- `SpriteCanvas` — função única que faz TODO o trabalho: carrega imagem, desenha frames, anima via `setInterval`

**Por que `<canvas>` e não CSS?** Tentamos 3 abordagens CSS antes (background-image+background-position, img+transform:translateX, img+position:absolute). Todas falharam por conflitos com CSS do Bootstrap/flex/grid. O `<canvas>` é 100% determinístico: a área de desenho é literalmente os atributos `width`/`height` do elemento, impossível mostrar mais pixels que isso.

```jsx
import SpriteImage from "../../components/SpriteImage";

// ITEM (linha horizontal unica)
<SpriteImage
  kind="item"
  name={item.originalName}
  sprite={item.sprite || "icon.png"}
  frameSize={item.frameSize || 16}      // quadrado
  frames={item.frames || 1}             // total de frames na linha
  duration="0.8s"
  alt={item.id}
/>

// MONSTER (matriz 4 direcoes x N frames)
<SpriteImage
  kind="monster"
  name={monster.originalName}
  sprite={monster.sprite || "walk_0.png"}
  frameSize={monster.frameSize}         // quadrado
  framesPerDirection={monster.framesPerDirection}
  directions={monster.directions}       // 4 (fixo para monstros)
  direction={0}                         // 0=Sul, 1=Norte, 2=Leste, 3=Oeste
  duration="0.8s"
  alt={monster.id}
/>
```

##### Como funciona o `SpriteCanvas`

1. Cria um `<canvas width={frameSize} height={frameSize}>` (área de desenho FIXA = 1 frame)
2. Carrega a spritesheet como `new Image()` com `crossOrigin = "anonymous"`
3. Quando a imagem carrega, chama `drawFrame(0)` que faz:
   ```js
   ctx.imageSmoothingEnabled = false;  // pixel art crisp
   ctx.clearRect(0, 0, fs, fs);
   ctx.drawImage(img, frame * fs, row * fs, fs, fs, 0, 0, fs, fs);
   //              ^sourceX ^sourceY  ^sw  ^sh  ^dx ^dy ^dw ^dh
   ```
4. Para itens: `row = 0` (fixo), `frame` cicla de 0 a `frames-1`
5. Para monstros: `row = direction` (fixo durante vida do componente), `frame` cicla de 0 a `framesPerDirection-1`
6. Animação via `setInterval(() => drawFrame(++frame % cols), duration_ms / cols)` — cada frame fica visível por exatamente `1/cols` da duração
7. Cleanup: `clearInterval` + `removeEventListener` no `useEffect` cleanup

#### Regras para a IA

- **Sempre** use `<SpriteImage>` para renderizar spritesheet de monstro/item. **Nunca** use `<img>` ou `<OptimizedImage>` para esse caso.
- **Nunca** adicione keyframes CSS para sprites (`spriteWalkItem`, `spriteWalkMonster`, etc) — a animação é 100% JavaScript via canvas. Se precisar animar, use o sistema existente.
- **Nunca** modifique as formulas em `itemSpriteMeta` e `monsterSpriteMeta` no `scripts/sync.js`. Se o APK mudar o layout, atualize **as duas** funcoes e incremente o `spriteMetaVersion`.
- **NUNCA** misture `kind="item"` com `framesPerDirection`/`directions` ou `kind="monster"` com `frames` — `ItemSprite` e `MonsterSprite` traduzem para o formato genérico do `SpriteCanvas`, e props erradas são ignoradas silenciosamente.
- Se adicionar uma nova rota que mostra sprites, importe `SpriteImage` de `src/components/SpriteImage.js` e passe a prop `kind` correta.
- Performance: cada `SpriteImage` rodando é 1 `setInterval`. Em páginas com 50+ sprites visíveis, considere lazy-mount ou `IntersectionObserver` para pausar animação fora do viewport (futuro).

---

## 5. Otimizações Vercel Já Configuradas

Ao modificar a configuração, preserve:

- **`vercel.json`**: tem rewrites para SPA (todas as rotas → `index.html`), headers de cache imutável (1 ano) para JS/CSS/imagens, e a config `images` (formats AVIF/WebP) que ativa o Image Optimization. **Não remova** o rewrite ou rotas como `/monsters` quebrarão (404 em vez de carregar o React Router).
- **`public/index.html`**: tem `<link rel="preconnect">` para o domínio da Vercel, meta Open Graph, Twitter Card, `lang="pt-BR"`. O `<Analytics />` e `<SpeedInsights />` estão montados em `src/index.js`.
- **Code splitting**: `App.js` usa `React.lazy()` para cada rota. Mantenha esse padrão ao adicionar rotas novas.
- **i18n**: tudo que for string visível ao usuário deve passar por `t("chave")`. Nunca hardcode texto em inglês/português direto no JSX.
- **Rota `/updates` é só de desenvolvimento**: tanto o lazy import quanto a rota quanto o link do NavBar são condicionais a `process.env.NODE_ENV === "development"`. Em produção, o módulo nem entra no bundle (tree-shaken). Se adicionar nova rota admin/dev, siga o mesmo padrão. Variável `IS_DEV` em `App.js:11` e `elements/nav/navbar.jsx:5`.

---

## 6. Script de Sincronização (`npm run sync`)

O script `scripts/sync.js` compara o conteúdo da pasta local **`Helmo arquivos apk/`** (APK descompactado) com a Wiki e aplica as mudanças.

### Como rodar

```bash
# Apenas simular (mostra o que mudaria, NÃO copia nem commita):
npm run sync -- --dry-run

# Copiar imagens e atualizar updates.json (sem commit):
npm run sync -- --no-commit

# Executar completo (copia + atualiza updates.json + git add/commit/push):
npm run sync
```

Argumentos extras:
- `--lang=<portugues|english|polish|spanish>`: idioma usado para cruzar nomes (default: `portugues`).

### O que ele faz

1. Lê a pasta `Helmo arquivos apk/assets/items/` e compara com `public/items/` por hash SHA-1:
   - **Novos**: copia `icon.png` para `public/items/<name>/icon.png`.
   - **Modificados**: sobrescreve.
2. Lê `Helmo arquivos apk/assets/entities/character/mob/` (recursivo) e compara com `public/monsters/`:
   - **Novos**: copia `walk_0.png` para `public/monsters/<name>/walk_0.png`.
3. Detecta JSONs em `src/data/Items/` e `src/data/monsters/` que **não têm contraparte no APK** (registra como aviso, não apaga).
4. Detecta nomes em `src/data/Items/` que diferem dos labels em `Helmo arquivos apk/assets/languages/<lang>/item_names.json`.
5. **Acrescenta** uma entrada nova no topo de `src/data/updates.json` com a data/hora atual, descrevendo as diferenças.
6. Roda `git add .` + `git commit -m "Update: Sincronizacao automatica de dados (DD/MM/YYYY HH:MM)"` + `git push`.

> 🔒 A pasta `Helmo arquivos apk/` está no `.gitignore`. **Nunca** comite conteúdo dela para o repo.

> ⚠️ O script não **deleta** imagens — ele só adiciona/substitui. Remoções devem ser feitas manualmente.

---

## 7. Instruções de Comportamento para a IA

### O que você DEVE fazer

1. **Preservar a estrutura existente** — não renomeie pastas, não mova arquivos para caminhos diferentes, não mude o casing (`Items` ≠ `items`).
2. **Usar `OptimizedImage`** para qualquer imagem nova de monstro/item. Sempre com `width`, `height` e `sizes` explícitos (evita CLS).
3. **Usar `NavLink`** para navegação interna — nunca `<a href>` para rotas React.
4. **Usar `t("chave")`** para todo texto visível. Adicione a chave em **todos** os idiomas no `LanguageContext` (`en` e `pt-BR`).
5. **Lazy-load** rotas novas com `React.lazy()` e adicionar `<Suspense fallback={…}>` no `App.js`.
6. **Rodar `npm run build`** após qualquer mudança para garantir que compila sem erros. Não commitar se o build falhar.
7. **Seguir o padrão visual**: cards Bootstrap com `borderRadius: "12px"`, `shadow-sm`, `border-0`, header `bg-dark text-white`, badges coloridos por tipo de stat. Veja `routes/monsters/monsters.jsx` como referência.
8. **Toda atualização DEVE ser publicada em `/updates`** — sem exceção. Antes de qualquer commit que altere dados, imagens, dependências, componentes, configuração de deploy ou qualquer outro conteúdo relevante, **acrescente uma entrada nova no topo de `src/data/updates.json`** com a data e hora atuais, e descreva objetivamente o que mudou em `changes`. Use `updatedMonsters` e `updatedItems` (Title Case) sempre que a mudança afetar monstros ou itens específicos. A entrada é renderizada automaticamente pela rota `/updates` (componente `src/routes/updates/updates.jsx`), que é a única forma dos jogadores saberem o que mudou no jogo. Formato obrigatório: array, mais recente no topo (índice 0), `date` em `DD/MM/YYYY`, `time` em `HH:MM`, `changes` como array de strings, `updatedMonsters`/`updatedItems` opcionais como arrays de nomes em Title Case.
9. **Ao adicionar um monstro/item novo**, criar o JSON cru, a imagem (se disponível), a entrada no `updates.json` e **regenerar** `items.json`/`monsters.json` rodando `node "src/data/generate data.js"`.
10. **Comitar em mensagens claras** (Português ou Inglês, mantendo consistência com o histórico `git log`).

### O que você NÃO DEVE fazer

1. ❌ **Não instalar dependências novas** sem pedir — o projeto é enxuto de propósito. Se precisar de algo, sugira a adição e explique o porquê.
2. ❌ **Não remover/renomear** `vercel.json`, o rewrite SPA, o preconnect no `index.html`, o `<Analytics />` ou `<SpeedInsights />` em `index.js`.
3. ❌ **Não trocar** `<BrowserRouter>` por outro router sem pedir.
4. ❌ **Não commitar** conteúdo de `Helmo arquivos apk/` (está no `.gitignore`).
5. ❌ **Não usar `<img>` cru** — sempre `OptimizedImage`.
6. ❌ **Não usar `<a href>`** para rotas internas — sempre `<NavLink>`.
7. ❌ **Não hardcodar texto** em JSX — sempre via `t()`.
8. ❌ **Não introduzir CSS-in-JS ou Tailwind** sem pedir — o padrão é Bootstrap 5 + inline `style` quando necessário.
9. ❌ **Não fazer migração CRA → Vite/Next.js** sem aprovação explícita.
10. ❌ **Não usar `process.env` arbitrários** — o único seguro é `process.env.NODE_ENV` (injetado pelo CRA).

### Como interagir com o usuário

- Responda em **Português** (pt-BR) por padrão, a menos que o usuário fale em outro idioma.
- Seja **conciso** e **direto** — esta é uma wiki de jogo, não um projeto enterprise.
- Quando uma tarefa envolver **múltiplos arquivos** ou **decisões de design**, faça um plano curto em bullets antes de executar.
- Ao terminar, faça um **resumo em 1-3 linhas** do que mudou e onde, com caminhos `arquivo:linha` quando relevante.
- Se o build falhar, **não commite**. Reporte o erro ao usuário.

---

## 8. Comandos Úteis (referência rápida)

```bash
npm install                          # Instalar deps
npm start                            # Dev server (http://localhost:3000)
npm run build                        # Build de produção → /build
npm test                             # Roda testes (CRA default)
npm run sync                         # Sincroniza APK → Wiki (commit + push)
npm run sync -- --dry-run            # Simula sincronização
node "src/data/generate data.js"     # Regenera items.json + monsters.json
```

---

## 9. Gotchas & Notas Históricas

- **Caminho com espaço**: `Helmo arquivos apk` tem espaço — em comandos, sempre envolva em aspas: `"Helmo arquivos apk/"`.
- **Build em Windows**: o `optimizeCss` do CRA às vezes dá warning. Pode ser ignorado.
- **Vercel Image Optimization**: o endpoint `/_vercel/image` **só existe em produção na Vercel**. Em `npm start` local, o `OptimizedImage` detecta `NODE_ENV=development` e usa o src direto. Isso é por design.
- **`web-vitals` v5**: API mudou — usa `onCLS`, `onINP`, `onFCP`, `onLCP`, `onTTFB` (não mais `getCLS`/`getFID`).
- **SPA fallback**: se você ver `404 NOT_FOUND` em produção em rotas como `/bosses`, verifique se o `vercel.json` tem o rewrite `{"source": "/(.*)", "destination": "/index.html"}`.

---

**Última atualização deste manual**: ver `git log agents.md`.
