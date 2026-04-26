# 🚀 Space Portfolio V2 - Portfólio Interativo 3D

> Portfólio full-stack em formato de universo espacial interativo, com navegação orbital, shaders customizados, painéis dinâmicos e formulário de contato integrado.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.169-black?logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## 📋 Sobre o Projeto

O **Space Portfolio V2** é um portfólio imersivo construído com React + Three.js, onde cada planeta representa uma seção do conteúdo profissional (sobre, habilidades, projetos, experiência, conquistas e contato).

A aplicação combina cena 3D em tempo real, shaders GLSL, overlays de acessibilidade, estado global com presets de performance e componentes de UI com design system próprio.

### 🎯 Destaques Técnicos

- **Experiência 3D Interativa**: cena orbital com planetas clicáveis, sol central e câmera inteligente
- **Shaders Customizados**: materiais próprios para planetas e atmosfera com ruído procedural (GLSL)
- **Navegação Cinematográfica**: transições de câmera com efeito warp e foco por seção
- **Sistema de Presets**: modos `cinematic`, `balanced`, `performance` e `minimal`
- **HUD + Overlays**: ajuda, configurações globais e fallback robusto para WebGL indisponível
- **Painéis Dinâmicos**: lazy loading por seção com navegação anterior/próximo
- **Formulário de Contato Real**: validação com Zod + React Hook Form + envio via Axios
- **Performance Frontend**: code splitting manual no Vite para vendors críticos (3D, motion, forms, state)

---

## 🌐 Demonstração Online

### Aplicações em Produção

| Serviço       | URL                                                      | Descrição                           |
| ------------- | -------------------------------------------------------- | ----------------------------------- |
| **Portfólio** | [v2.gabrielfeijo.com.br](https://v2.gabrielfeijo.com.br)       | Experiência completa do portfólio   |

### 🪐 Seções Navegáveis (Planetas)

- **Sobre** (`about`)
- **Habilidades** (`skills`)
- **Projetos** (`projects`)
- **Experiência** (`experience`)
- **Conquistas** (`accomplishments`)
- **Contato** (`contact`)

---

## 📦 Estrutura do Projeto

```text
portfolio-v2/
├── public/
│   ├── audio/
│   │   └── space-music.mp3               # Trilha ambiente
│   ├── favicon.svg
│   └── gabrielfeijo.png                  # Avatar principal
│
├── src/
│   ├── app.tsx                           # Shell da aplicação + Canvas + overlays
│   ├── main.tsx                          # Bootstrap React
│   ├── data/
│   │   └── portfolio.ts                  # Conteúdo central (perfil, projetos, experiência...)
│   ├── store/
│   │   └── space-store.ts                # Estado global (Zustand)
│   ├── components/
│   │   ├── three/
│   │   │   ├── scene/
│   │   │   │   ├── space-scene.tsx       # Cena 3D principal
│   │   │   │   └── camera-controller.tsx # Órbita/foco da câmera
│   │   │   ├── objects/
│   │   │   │   ├── planet-3d.tsx         # Planeta interativo por seção
│   │   │   │   ├── sun-3d.tsx            # Sol clicável (abre ajuda)
│   │   │   │   ├── nebula.tsx            # Nebulosas procedurais
│   │   │   │   ├── asteroid-belt.tsx     # Cinturões de asteroides
│   │   │   │   ├── orbit-particles.tsx   # Partículas orbitais
│   │   │   │   └── small-moon.tsx        # Lua secundária dinâmica
│   │   │   └── shaders/
│   │   │       ├── planet-material.ts    # Shader custom de planeta
│   │   │       └── atmosphere-material.ts # Shader de atmosfera
│   │   └── ui/
│   │       ├── hud/                      # HUD, loading, cursor, warp, música
│   │       ├── overlays/                 # Help, settings e fallback WebGL
│   │       ├── panels/                   # Conteúdo de cada seção
│   │       └── planet-panel.tsx          # Drawer lateral com navegação
│   ├── hooks/                            # Hooks de câmera, interação e acessibilidade
│   ├── lib/
│   │   └── contact-api.ts                # Cliente Axios para formulário
│   ├── schemas/
│   │   └── contact-form-schema.ts        # Schema Zod do contato
│   ├── constants/                        # Configs de câmera, animação, cena e cursor
│   ├── styles/                           # Sistema visual global e painéis
│   └── utils/                            # Geometria, WebGL check, texturas, datas
│
├── vite.config.ts                        # Build/chunks/aliases
├── tsconfig.json
├── package.json
└── README.md
```