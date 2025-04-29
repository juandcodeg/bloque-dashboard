# 🎣 Galactic Fishing Leaderboard & Market (Bloque PWA Challenge)

A lightweight, offline-capable single-page web app built for the **Bloque Technical Test**.

---

## 🛠 Tech Stack

- ⚡️ [Vite](https://vitejs.dev/) (Build tool)
- 🧬 [Preact](https://preactjs.com/) (Ultra-light React alternative)
- 🎨 [Tailwind CSS v4](https://tailwindcss.com/) (Utility-first CSS)
- ⚙️ TypeScript (Strong typing)
- 🔌 PWA (Offline support via [vite-plugin-pwa](https://vite-plugin-pwa.netlify.app/))

---

## 🚀 Features

- ✅ Live **leaderboard** & **market** data
- ✅ **Responsive** design (mobile cards + desktop table)
- ✅ **Pagination** for large leaderboard
- ✅ **Offline support** with Service Worker + LocalStorage fallback
- ✅ **PWA installable** (Add to Home Screen)
- ✅ **Tiny bundle** (7.23 kB gzipped main file)

---

## 🌐 Live Demo

🔗 [https://bloque-pwa-technical-challenge.vercel.app](https://bloque-pwa-technical-challenge.vercel.app)

---

## 📦 Performance Highlights

| Metric             | Result |
|--------------------|--------|
| Main JS (gzipped)   | 7.23 kB ✅ |
| Total transferred   | ~51.5 kB ✅ |
| Total resources     | ~193 kB ✅ |
| Number of requests  | 16 ✅ |

---

## 📥 Installation & Local Setup

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build

# Preview production build
npx serve dist
