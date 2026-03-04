# Hathor

Frontend for [Sobek](https://github.com/entur/sobek) — Entur's national vehicle registry (Nasjonalt Materiellregister).

## Tech Stack

- React 19 + TypeScript
- Vite
- Material UI v7
- GraphQL (`graphql-request`)
- OIDC authentication (`react-oidc-context`)

## Getting Started

```bash
npm install
npm run dev          # Dev server on http://localhost:5000
```

Requires a running [Sobek](https://github.com/entur/sobek) backend (default: `http://localhost:37999`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (uses dev API) |
| `npm run local` | Start dev server (uses local Sobek at `127.0.0.1:37999`) |
| `npm run build` | Type-check and build (`build/`) |
| `npm run lint` | ESLint |
| `npm run format` | Prettier auto-format |
| `npm run e2e:auth` | Playwright tests (auth enabled) |
| `npm run e2e:no-auth` | Playwright tests (auth disabled) |

## Customization

See [DEV_GUIDE.md](DEV_GUIDE.md) for theming, custom icons, and adding new data table pages.
