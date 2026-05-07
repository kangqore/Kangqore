# 🚀 Kangqore Website - Local Development Setup Guide

## 📋 Prerequisites Checklist

- [ ] **Node.js** (v16 or higher)
- [ ] **Docker Desktop** (Required for Database & Backend Services)
- [ ] **npm** or **Yarn**

---

## 🚀 Step 1: Start Backend Services

1. Ensure Docker Desktop is running.
2. From the root directory:

```bash
docker-compose up -d --build
```

This will start:
- **PostgreSQL** (Database)
- **Core Backend** (Node.js on Port 3001)
- **Intelligence Layer** (Python on Port 8000)

---

## ⚙️ Step 2: Frontend Setup

1. Open a new terminal.
2. Navigate to frontend:

```bash
cd frontend
```

3. Install dependencies:

```bash
npm install
# or
yarn install
```

4. Create `.env` (if not exists):
   
   Note: We have automatically configured this to `http://localhost:3001`.

```bash
REACT_APP_BACKEND_URL=http://localhost:3001
```

5. Start the frontend:

```bash
npm start
# or
yarn start
```

Your browser should open `http://localhost:3000`.

---

## 🛠️ Typical Workflow

- **Frontend changes**: Edit `frontend/src`. Browser auto-reloads.
- **Backend logic**: Edit `core-backend/src`. Container might need restart or use local dev mode (npm run dev in core-backend).
- **AI/ML logic**: Edit `intelligence-layer`.

## 🐛 Troubleshooting

### Database Connection Failed
- Ensure Docker is running.
- Check `docker-compose logs core-backend`.

### API Errors
- Ensure Frontend points to Port 3001.
- Ensure Core Backend is running (`docker ps`).
