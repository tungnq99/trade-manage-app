# Trade Management System

Professional trade management application for prop traders to track trades, manage capital, enforce rules, and analyze performance.

## Project Structure

```
trade-manage-app/
├── frontend/          # React + TypeScript + Vite
├── backend/           # Node.js + Express + TypeScript
├── docs/              # Functional Design Documents
│   └── FDD/
├── .agent/            # Workflows
└── mongo-db/          # MongoDB playground
```

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Zustand (State management)
- Ant Design (UI library)
- Recharts (Charts)
- Axios (HTTP client)

### Backend  
- Node.js 20+
- Express.js + TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Socket.io (Real-time alerts)

## Getting Started

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0
- MongoDB connection (Atlas or local)

### Installation

```bash
# Install dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies  
cd ../backend && npm install
```

### Development

```bash
# Run both frontend and backend
npm run dev

# Run frontend only
npm run dev:frontend

# Run backend only
npm run dev:backend
```

Frontend: http://localhost:5173  
Backend API: http://localhost:3000

### Environment Variables

Create `.env` files:

**backend/.env:**
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

**frontend/.env:**
```
VITE_API_URL=http://localhost:3000/api
```

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e
```

## Documentation

- [FDD Documents](./docs/FDD/)
- [Implementation Plan](./artifacts/implementation_plan.md) 
- [System Design](./artifacts/system_design.md)
- [E2E Test Workflows](./docs/e2e-test-workflows.md)

## Features

- 📊 **Trading Journal**: CRUD operations, CSV import from MT5
- 💰 **Capital Management**: Risk calculator, drawdown tracking
- ⚖️ **Rules Engine**: FTMO/The5ers templates, violation detection
- 📈 **Analytics**: Equity curves, performance metrics, PDF export
- 📰 **Market Info**: Economic calendar, session clock
- 🔔 **Alert System**: In-app toasts, PWA push notifications

## Roadmap

See [Implementation Plan](./artifacts/implementation_plan.md) for detailed sprint planning (12 weeks).

## License

Private - All rights reserved
