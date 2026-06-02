# RecipeHub - Full-Stack Architecture

A beautiful, high-fidelity recipe exploration application with custom recipe manager, shopping lists, bookmark capabilities, active cooking timers, and dynamic cooking streaks.

## Project Structure

```
recipe-hub/
├── frontend/             # React (Vite) Single Page Application
│   ├── src/
│   │   ├── assets/       # Styles, images, and fonts
│   │   ├── components/   # Modular React components
│   │   ├── config/       # Axios configuration (api.js)
│   │   ├── contexts/     # Context providers (AuthContext.jsx)
│   │   ├── hooks/        # Custom React hooks (useAuth.js, useFavorites.js, etc.)
│   │   ├── layouts/      # Layout wrapper components (MainLayout.jsx)
│   │   ├── pages/        # Core page routing targets (Home.jsx, AddRecipe.jsx, etc.)
│   │   ├── routes/       # Unified routing declarations (AppRoutes.jsx)
│   │   └── utils/        # Utility arrays and helper definitions (mockData.js)
│   └── ...
│
└── backend/              # Node.js + Express.js backend API
    ├── config/           # Database configurations (db.js)
    ├── controllers/      # Route logic controller files
    ├── middleware/       # Express route protections and middleware
    ├── models/           # Mongoose MongoDB schemas
    ├── routes/           # Routing definitions
    ├── services/         # Achievement streak and reward services
    ├── utils/            # JWT helper and signing functions
    └── server.js         # Entrypoint file
```

## Running the Application

### 1. Prerequisites
Ensure you have **Node.js** and **MongoDB** installed and running on your host machine.

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Run the backend Express server:
   ```bash
   npm start
   ```
   The backend API will run on `http://localhost:5000/api`.

### 3. Frontend Setup
1. Open a separate terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   Open the application in your browser at `http://localhost:5174/` (or the active port displayed in your terminal).
