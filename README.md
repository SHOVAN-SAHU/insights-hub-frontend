# Insights Hub — AI Document Q&A Frontend

A full React.js frontend for an AI-powered RAG document platform.

## Tech Stack

- **React 18** with Vite
- **Redux Toolkit** + redux-persist (auth persisted)
- **React Router v6**
- **Axios** with `withCredentials: true` (httpOnly cookie support)
- **Google Identity Services** (One Tap + button)

## Project Structure

```
src/
├── app/
│   └── store.js              # Redux store + persist config
├── features/
│   ├── auth/authSlice.js     # login, loadUser, logout
│   ├── spaces/spaceSlice.js  # CRUD spaces + members
│   ├── documents/documentSlice.js
│   └── ask/askSlice.js       # Q&A with RAG
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── SpaceDetailPage.jsx
│   └── SubscriptionPage.jsx
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Spinner.jsx
│   │   ├── Toast.jsx
│   │   ├── SpaceCard.jsx
│   │   ├── DocumentPanel.jsx
│   │   ├── AskPanel.jsx
│   │   ├── MemberPanel.jsx
│   │   └── ProtectedRoute.jsx
│   └── layout/
│       ├── Navbar.jsx
│       └── PageLayout.jsx
└── services/
    └── api.js                # Axios instance (withCredentials)
```

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and add your Google OAuth Client ID
```

### 3. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → Enable Google Identity API
3. Create OAuth 2.0 credentials
4. Add `http://localhost:5173` to Authorized Origins
5. Copy the Client ID into `.env`

### 4. Run development server
```bash
npm run dev
```

App runs at: `http://localhost:5173`  
Backend expected at: `http://localhost:8000`

## API Endpoints (Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/users/login` | Google login |
| GET | `/api/v1/users/me` | Load current user |
| POST | `/api/v1/users/logout` | Logout |
| GET | `/api/v1/spaces` | List spaces |
| POST | `/api/v1/spaces` | Create space |
| PATCH | `/api/v1/spaces/:id` | Update space |
| POST | `/api/v1/spaces/:id/members` | Add member |
| DELETE | `/api/v1/spaces/:id/members` | Remove member |
| GET | `/api/v1/documents/:spaceId` | List documents |
| POST | `/api/v1/documents/upload/:spaceId` | Upload document |
| DELETE | `/api/v1/documents/:id` | Delete document |
| POST | `/api/v1/ask/:spaceId` | Ask question (RAG) |
| GET | `/api/v1/plans` | Get subscription plans |
| POST | `/api/v1/subscription/create-sub` | Create subscription |
| GET | `/api/v1/search?q=&spaceId=` | Search users |

## Auth Flow

1. User clicks Google Sign In → gets `credential` token
2. Frontend POSTs to `/users/login` with `{ credential }`
3. Backend validates + sets httpOnly cookie + returns user
4. Redux stores user in persisted state
5. On app reload → `GET /users/me` to restore session
6. 401 response → auto-logout via Axios interceptor

## Build

```bash
npm run build
```
