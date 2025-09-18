
<p align="center">
  <a href="https://apptit.io" target="blank">
  <img style="max-width:400px;" src="https://previews.jumpshare.com/thumb/815bc01b796dd6f1733c957c5af19493825ed196eea199123bc90f246bd017e1309cbe910374a8b450e01fe226695f6be853d26beb03ed6026933cda499e5312cd54493e3ecad05f9894464c11cfec98"></a></a>
</p>

<p align="center">
  <b>Apptit Frontend</b> – Web interface for the Apptit collective catering management system.  
  Built with <a href="https://nextjs.org/" target="_blank">Next.js</a>, <a href="https://react.dev/" target="_blank">React</a>, <a href="https://tailwindcss.com/" target="_blank">Tailwind CSS</a>, and <a href="https://shadcn.dev/" target="_blank">shadcn/ui</a>.
</p>

<p align="center">
<a href="https://github.com/rodrigopaivadev/apptit-frontend" target="_blank"><img src="https://img.shields.io/github/license/rodrigopaivadev/apptit-frontend" alt="License" /></a>
<a href="https://vercel.com" target="_blank"><img src="https://img.shields.io/badge/deploy-vercel-blue" alt="Deploy on Vercel" /></a>
<a href="https://nextjs.org" target="_blank"><img src="https://img.shields.io/badge/framework-Next.js-black" alt="Next.js" /></a>
<a href="https://tailwindcss.com" target="_blank"><img src="https://img.shields.io/badge/style-TailwindCSS-06B6D4" alt="TailwindCSS" /></a>
<a href="https://react.dev" target="_blank"><img src="https://img.shields.io/badge/library-React-61DAFB" alt="React" /></a>
</p>

---

## 📖 Description

Apptit Frontend is the web application for the **Apptit project**.  
It connects to the **GraphQL Gateway** (NestJS) and microservices, providing interfaces for:

- Product lookup and inventory management  
- Stock monitoring and audit logs  
- HACCP compliance and IoT temperature data  
- Multi-tenant kitchens and role-based access  

---

## 🛠️ Project setup

```bash
$ npm install
```

## 🚀 Run the project

```bash
# development
$ npm run dev
```

```bash
# build
$ npm run build
```

```bash
# production mode
$ npm run start
```

---

## 📡 Current Features

- ⚡ Design System
  - Built with shadcn/ui + Tailwind, with Apptit custom theme (colors, typography, icons).
- 🗂 ProductCard Component
  - Displays product info with stock, price, allergens labels (vegan, gluten, poison).
- 🔑 Auth Pages (Login / Wrong Password / Forgot Password)
  - Designed in Figma and implemented in Next.js with responsiveness (mobile + desktop).
- 🌍 Multi-language Support
  - Currently supports French (FR) and English (EN).
- 📱 Responsive Layout
  - Mobile-first, tested with React Native shared components.

## 📂 Project structure

```bash
apptit-frontend/
├─ src/
│  ├─ app/                 # Next.js App Router
│  ├─ components/          # Reusable UI components
│  │   ├─ ProductCard.tsx
│  │   ├─ forms/
│  │   └─ layout/
│  ├─ lib/                 # Utils (cn, api-client, i18n)
│  ├─ styles/              # Tailwind & global styles
│  └─ graphql/             # Apollo/urql client setup
├─ public/                 # Static assets
├─ package.json
└─ tailwind.config.ts
```

## 🎨 Design System

- Colors:
- Apptit Blue #1E40AF
- Green #16A34A
- Yellow #FACC15
- Red #DC2626
- Typography:
- Headings: font-bold
- Body: font-normal
- Icons:
Using lucide-react (Package, Tag, Layers, CheckCircle2, AlertTriangle, Leaf, Skull, Wheat).

## 🧪 Run tests

```bash
# unit tests
$ npm run test
```

```bash
# e2e tests (Playwright or Cypress depending on setup)
$ npm run test:e2e
```

## 🚀 Deployment

The frontend can be deployed with Vercel or Docker:

```bash
# Build for production
$ npm run build
```

```bash
# Start in production
$ npm run start
```

## 📚 Resources

- Next.js Documentation
- React Documentation
- ailwindCSS
- shadcn/ui

## 👤 Author

- Rodrigo Paiva – GitHub · LinkedIn

📄 License

Apptit Frontend is MIT licensed.
