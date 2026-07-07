<div align="center">
  <h1>🍽️🛍️ Visika Frontend</h1>
  <p><strong>The modern client application for the Visika B2B Food Marketplace</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15+-000000.svg?logo=nextdotjs" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-61DAFB.svg?logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/TailwindCSS-4.x-38B2AC.svg?logo=tailwindcss" alt="TailwindCSS" />
  </p>
</div>

<hr>

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Key Technologies](#-key-technologies)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
- [Project Structure](#-project-structure)
- [Development Workflow](#-development-workflow)

---

## 🚀 About the Project

**Visika Frontend** is the client-facing application for the Visika B2B food marketplace. It interacts seamlessly with the Visika Django backend to provide a robust, scalable, and fully responsive user interface for business customers to order food and track their purchases.

---

## ✨ Key Technologies

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **State Management & Fetching**: Axios and React Hooks
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🛠️ Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v20+ recommended)
* npm (comes with Node.js)
* Running instance of the [Visika Backend](../visika_backend) (locally or in Docker)

### Installation & Setup

1. **Clone the repository** (if not already done) and navigate to the frontend directory:
   ```bash
   cd visika_frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   By default, the Next.js `rewrites()` rule in `next.config.ts` proxies all `/api/*` requests to the local Django backend running on `http://127.0.0.1:8000`. If your backend runs on a different host, update `next.config.ts` accordingly.

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

5. **Open the App**:
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```text
visika_frontend/
│
├── public/                 # Static assets (images, icons)
├── src/
│   ├── app/                # Next.js App Router (Pages, Layouts)
│   ├── components/         # Reusable UI components (shadcn/ui, custom components)
│   ├── hooks/              # Custom React hooks (e.g., useAuth)
│   └── lib/                # Utilities and API client configuration (Axios)
│
├── next.config.ts          # Next.js configuration and API proxies
├── package.json            # Project dependencies and scripts
└── tailwind.config.ts      # Tailwind CSS configuration
```

---

## 💻 Development Workflow

- The project heavily utilizes **shadcn/ui** components. You can add more components using the `npx shadcn-ui@latest add` command.
- For API communication, use the configured Axios instance located in `src/lib/api.ts`, which automatically handles CSRF tokens and cookies.
- Authentication state is managed via the `useAuth` hook located in `src/hooks/useAuth.ts`.

---

<div align="center">
  <p>Developed with ❤️ by <strong>Taha👑</strong></p>
</div>
