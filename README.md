# Pokemon Explorer

Simple React app for browsing Pokemon data from PokeAPI.

## Features

- Search by Pokemon name
- Multi-select type filters
- Details modal with sprite gallery, evolution chain, and locations

## Stack

- React + TypeScript + Vite
- MUI (Material UI)
- PokeAPI

## Run locally (dev)

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Run build locally (preview)

```bash
npm run build
npm run preview
```

## Project structure

App files (without config files):

- `README.md` - project documentation
- `package.json` - scripts and dependencies
- `package-lock.json` - exact dependency lockfile
- `index.html` - Vite HTML entry
- `public/favicon.svg` - browser tab icon
- `public/icons.svg` - extra SVG icon sprite
- `src/main.tsx` - React app bootstrap (mount to DOM)
- `src/index.css` - global base styles
- `src/App.tsx` - main page layout, filters, search, pagination, modal wiring
- `src/api/pokemon.ts` - PokeAPI list/details fetching and mapping to app model
- `src/constants/pokemon.ts` - shared constants (API base URL, page size)
- `src/types/pokemon.ts` - app-level TypeScript types
- `src/theme/colors.ts` - Pokemon type color palette
- `src/components/PokemonGrid.tsx` - responsive grid for Pokemon cards
- `src/components/PokemonCard.tsx` - single Pokemon card UI
- `src/components/PokemonDetailsModal.tsx` - modal with sprite gallery, evolution chain, locations
- `src/assets/poke-ball.png` - Pokeball icon used in header

## GitHub Pages

https://tyto0o.github.io/wave-assignment/
