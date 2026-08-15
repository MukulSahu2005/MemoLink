# 🧠 MemoLink

MemoLink is a full-stack "second brain" application that lets you capture, organize, and revisit notes, links, tweets, and YouTube videos in one place — and share any note with the world through a single public link.

🔗 **Live App:** [memo-link-sigma.vercel.app](https://memo-link-sigma.vercel.app)

---

## 📖 Overview

Modern browsing generates a constant stream of useful content — articles, tweets, videos, half-formed ideas — that gets lost across tabs, bookmarks, and chat threads. MemoLink solves this by giving every user a personal, searchable vault for that content, with secure authentication (including Google Sign-In), per-note sharing, and a clean, distraction-free interface.

---

## ✨ Features

- 🔐 **Secure Authentication** – Email/password signup and login with JWT stored in httpOnly cookies, plus bcrypt password hashing
- 🟢 **Google OAuth 2.0 Login** – One-click sign-in via Google, with automatic account linking for existing users
- 📝 **Multi-format Notes** – Save content as a `document`, `tweet`, `youtube` video, or generic `link`, each tagged for easy filtering
- 🔗 **Public Sharing** – Toggle any note to "shared" and get a unique public URL viewable without login
- 🏷️ **Tagging & Organization** – Attach custom tags to notes and index them for fast lookup
- 👤 **Ownership-based Access Control** – Users can only view, edit, or delete their own notes
- 🛡️ **Protected Routes** – Frontend route guarding via a `ProtectedRoute` wrapper tied to auth state
- 🎨 **Modern, Responsive UI** – Built with React 19, Tailwind CSS, and Framer Motion for smooth transitions
- ⚡ **Toast Notifications** – Real-time feedback for actions using Sonner

---

## 🛠️ Tech Stack

**Frontend**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router v7
- Axios
- Framer Motion
- Sonner (toasts)
- Lucide React (icons)

**Backend**
- Node.js + Express 5
- TypeScript
- MongoDB + Mongoose
- JWT (jsonwebtoken) for auth
- bcryptjs for password hashing
- express-session + cookie-parser
- Google OAuth 2.0 (manual authorization-code flow)

**Deployment**
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## 📂 Project Structure

```
MemoLink/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Request handlers (notes, users)
│   │   ├── db/                # MongoDB connection setup
│   │   ├── middlewares/       # JWT auth middleware
│   │   ├── models/            # Mongoose schemas (User, Note)
│   │   ├── routes/            # Express routers (auth, users, notes)
│   │   ├── utils/             # ApiError, ApiResponse, asyncHandler
│   │   ├── app.ts             # Express app config (CORS, sessions, routes)
│   │   ├── constants.ts       # DB name and shared constants
│   │   └── index.ts           # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                # Axios instance + endpoint definitions
│   │   ├── components/
│   │   │   ├── cards/           # NoteCard
│   │   │   ├── layout/          # CreateNoteDrawer, EditNoteModal
│   │   │   ├── shared/          # GuestBanner, ProtectedRoute
│   │   │   └── ui/              # Button, Input, Badge
│   │   ├── context/            # AuthContext (global auth state)
│   │   ├── pages/               # Landing, SignIn, SignUp, Dashboard, Share
│   │   ├── types/                # Shared TypeScript types
│   │   └── App.tsx              # Route definitions
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm
- A MongoDB Atlas cluster (or local MongoDB instance)
- A Google Cloud OAuth 2.0 Client ID/Secret (for Google Sign-In)

### 1. Clone the repository

```bash
git clone https://github.com/MukulSahu2005/MemoLink.git
cd MemoLink
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:

```env
PORT=3004
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=1d
SESSION_SECRET=your_session_secret
FRONTEND_URL=http://localhost:5174
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3004/api/v1/auth/google/callback
NODE_ENV=development
```

Run the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/` with:

```env
VITE_API_BASE_URL=http://localhost:3004
```

Run the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite assigns), with the API running at `http://localhost:3004`.

---

## 🔑 Environment Variables

| Variable | Location | Description |
|---|---|---|
| `MONGODB_URI` | backend | MongoDB Atlas connection string |
| `JWT_SECRET` | backend | Secret used to sign JWTs |
| `JWT_EXPIRY` | backend | Access token expiry (e.g. `1d`) |
| `SESSION_SECRET` | backend | Secret for express-session |
| `FRONTEND_URL` | backend | Deployed frontend origin, used for CORS + OAuth redirects |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | backend | Google OAuth 2.0 credentials |
| `GOOGLE_REDIRECT_URI` | backend | OAuth callback URL registered with Google |
| `NODE_ENV` | backend | `development` or `production` (controls cookie security settings) |
| `VITE_API_BASE_URL` | frontend | Base URL of the backend API |

---

## 📡 API Endpoints

**Auth & Users** — `/api/v1/users`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Register a new user |
| POST | `/signin` | Log in with username/password |
| POST | `/logout` | Log out (requires auth) |

**Google OAuth** — `/api/v1/auth`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/google` | Redirects to Google's consent screen |
| GET | `/google/callback` | Handles the OAuth callback, issues a JWT |

**Notes** — `/api/v1/notes`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create a note (requires auth) |
| GET | `/` | Get all notes for the logged-in user |
| GET | `/:id` | Get a single note by ID |
| PATCH | `/:id` | Update a note (owner only) |
| DELETE | `/:id` | Delete a note (owner only) |
| PATCH | `/:id/share` | Enable/toggle public sharing for a note |
| GET | `/public/share/:shareableId` | View a shared note publicly (no auth) |

---

## 🗺️ Roadmap

- [ ] Full-text search across notes
- [ ] Rich-text / Markdown editor for document notes
- [ ] Folder-based note organization
- [ ] Note collaboration / multi-user sharing
- [ ] Browser extension for one-click capture

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

**Mukul Sahu**
- GitHub: [@MukulSahu2005](https://github.com/MukulSahu2005)
