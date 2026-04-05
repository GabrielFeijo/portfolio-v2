# 🚀 Space Portfolio V2 — Gabriel Feijó

> An interactive 3D space universe where each planet is a section of the developer portfolio.

## ✨ Tech Stack

| Tech | Version | Purpose |
|------|---------|---------|
| React | ^18.3 | UI framework |
| TypeScript | ^5.7 | Type safety |
| Vite | ^6.0 | Build tool |
| Three.js | ^0.172 | 3D engine |
| @react-three/fiber | ^8.18 | React renderer for Three.js |
| @react-three/drei | ^9.122 | Three.js helpers |
| Framer Motion | ^12.6 | Animations & transitions |
| Zustand | ^5.0 | Global state management |
| react-icons | ^5.4 | Icon library |

## 🪐 Planets (Sections)

| Planet | Name | Section |
|--------|------|---------|
| 🌊 Oceanic | ORIGIN | About Me |
| 💎 Crystal | NEXUS | Skills & Technologies |
| 🔥 Lava | FORGE | Projects |
| 🪨 Rocky | CHRONOS | Experience |
| 🌌 Gas Giant | AETHER | Accomplishments |
| ❄️ Ice | BEACON | Contact |

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/GabrielFeijo/space-portfolio-v2
cd space-portfolio-v2

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173)

## API do Formulario

Defina `VITE_API_URL` para apontar para a API Nest.

Exemplo local:

```bash
VITE_API_URL=http://localhost:3333/v2
```

O formulario de contato envia `POST /contact` para essa base, resultando em `POST http://localhost:3333/v2/contact`.

## 🎮 How to Navigate

- **Look around** — move mouse to orbit the camera
- **Click a planet** — focus camera on it
- **Click again** — open the planet's detail panel
- **Left sidebar** — quick-jump to any planet
- **ESC / ✕** — close panel and return to space
- **Arrow navigation** inside panels — go to prev/next planet

## 📁 Project Structure

```
src/
├── components/
│   ├── three/              # All Three.js / R3F 3D components
│   │   ├── SpaceScene.tsx  # Main scene setup, camera, lighting
│   │   ├── Planet3D.tsx    # Interactive planet mesh + orbit
│   │   ├── Sun3D.tsx       # Central star with corona
│   │   ├── AsteroidBelt.tsx
│   │   └── Nebula.tsx      # Background nebula clouds
│   └── ui/                 # 2D HUD overlay components
│       ├── HUD.tsx          # Top/bottom bar + planet nav list
│       ├── CustomCursor.tsx # Magnetic animated cursor
│       ├── IntroSequence.tsx # Boot terminal animation
│       ├── LoadingScreen.tsx
│       ├── PlanetPanel.tsx  # Panel wrapper + navigation
│       ├── WarpEffect.tsx   # Warp speed canvas animation
│       └── panels/         # Individual section content
│           ├── AboutPanel.tsx
│           ├── SkillsPanel.tsx
│           ├── ProjectsPanel.tsx
│           ├── ExperiencePanel.tsx
│           ├── AccomplishmentsPanel.tsx
│           └── ContactPanel.tsx
├── data/
│   └── portfolio.ts        # ALL portfolio content lives here
├── store/
│   └── spaceStore.ts       # Zustand global state
├── styles/
│   └── globals.css         # CSS variables, utilities, animations
└── main.tsx
```

## 🎨 Customization

All content is in `src/data/portfolio.ts` — update `DEVELOPER`, `PLANETS`, `SKILLS`, `PROJECTS`, `EXPERIENCE`, `ACCOMPLISHMENTS`, and `CERTIFICATES`.

## 📄 License

MIT © Gabriel Feijó
