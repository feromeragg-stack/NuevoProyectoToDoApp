# ✅ To-Do App — React + Vite + Tailwind + localStorage

App de **Lista de Tareas (CRUD)** con **filtros**, **edición online**, **contador de pendientes** y **persistencia en `localStorage`**.
Diseño responsive, limpio y moderno con **Tailwind CSS**.

---

## ✨ Funcionalidades
- Crear, marcar como completa/incompleta, editar y eliminar tareas.
- Filtros: **Todas / Activas / Completadas**.
- **Contador** de tareas pendientes.
- **Persistencia** automática en `localStorage`.
- UI responsive con Tailwind (bordes redondeados, sombras suaves).

---

## 🛠️ Tecnologías
- [React](https://react.dev/) (Vite)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [gh-pages](https://github.com/tschaub/gh-pages) (deploy en GitHub Pages)

---

## 📁 Estructura mínima
.
├─ index.html
├─ package.json
├─ vite.config.mjs
├─ tailwind.config.cjs
├─ postcss.config.js
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   └─ index.css

🎨 Tailwind / Tema

El tema agrega una paleta propia:

// tailwind.config.cjs (extracto)
module.exports = {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 50:"#F8FAFC",100:"#EEF2F6",200:"#E3E8EF",300:"#CBD5E1",400:"#94A3B8",500:"#64748B",600:"#475569",700:"#334155",800:"#1E293B",900:"#0F172A" },
        brand: { 50:"#3ea07eff",100:"#20b479ff",200:"#A0EBD0",300:"#045f41ff",400:"#44D6A6",500:"#16CB91",600:"#033323ff",700:"#0E835A",800:"#0A5F40",900:"#073A27" },
        accent: { 400:"#521cf5ff", 500rgba(138, 92, 247, 1)F6", 600:"#ad84f3ff", 700rgba(96, 14, 228, 1)D9", 800:"#5B21B6" },
        success: { 500:"#10B981" },
        warning: { 500:"#F59E0B" },
        danger:  { 500:"#EF4444" }
      },
      boxShadow: { soft: "0 10px 25px rgba(0,0,0,0.08)" }
    }
  },
  plugins: []
}

🧪 Scripts disponibles
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}

👤 Créditos

Hecho por Fernando Romera.
