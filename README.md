# 🌿 Growitbro – Premium Greenery Website

A beautiful, fully responsive React website for **Growitbro Agritech Pvt Ltd** — built with Vite + React and auto-deployed to GitHub Pages via GitHub Actions.

---

## 🚀 Quick Deploy to GitHub Pages

### Step 1 — Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it **`growitbro`** (or any name you like)
3. Set it to **Public**
4. Do **not** initialise with a README
5. Click **Create repository**

### Step 2 — Update the base URL

If your repository name is **not** `growitbro`, open `vite.config.js` and change:

```js
base: '/growitbro/',   // ← change this to your repo name
```

### Step 3 — Push the code

```bash
cd growitbro
git init
git add .
git commit -m "🌿 Initial Growitbro website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/growitbro.git
git push -u origin main
```

### Step 4 — Enable GitHub Pages

1. Go to your repo on GitHub
2. **Settings → Pages**
3. Under **Source**, select **GitHub Actions**
4. Save

GitHub Actions will automatically build and deploy on every push to `main`. Your site will be live at:

```
https://YOUR_USERNAME.github.io/growitbro/
```

---

## 💻 Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173/growitbro/](http://localhost:5173/growitbro/)

## 🏗️ Build for Production

```bash
npm run build
```

Output goes to `dist/` — ready for deployment.

---

## 📁 Project Structure

```
growitbro/
├── .github/
│   └── workflows/
│       └── deploy.yml      # Auto-deploy to GitHub Pages
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx            # React entry point
│   └── App.jsx             # Full website (all pages & components)
├── index.html
├── vite.config.js
└── package.json
```

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| Google Fonts | Playfair Display + DM Sans |
| GitHub Actions | CI/CD pipeline |
| GitHub Pages | Free hosting |

---

## ✏️ Customisation

- **Colours** – edit the `G` object and `:root` CSS vars at the top of `src/App.jsx`
- **Content** – all text, services, FAQs, and plant data are plain JS arrays near the top of each page component
- **Contact form** – wire up the `handle` function in `ContactPage` to your preferred backend (e.g. Formspree, EmailJS, or a custom API)

---

*© 2025 Growitbro Agritech Pvt Ltd, Gurugram*
