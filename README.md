# 🌾 KRISHI DIGITAL — DIGITAL AGRICULTURE MISSION
> **"One Platform. Every Farmer. Smarter Agriculture."**  
> *Digital Technology for Better Farming and a Sustainable Future.*

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_Ready-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 🌟 Executive Summary

**KRISHI DIGITAL** is an original, production-ready, full-stack digital agriculture ecosystem built to empower Indian farmers, agricultural extension workers, scientists, and administrators. Inspired conceptually by national agriculture data architectures like **AgriStack** and advisory/market frameworks like **KrishiSetu**, KRISHI DIGITAL delivers a modern, unified, responsive web platform with zero third-party UI or code duplication.

The platform provides an end-to-end digital lifecycle: from farmer identity and digital land cadastral mapping, phenological crop lifecycle tracking, hyper-local agro-meteorology, N-P-K soil health radar diagnostics, AI-assisted Crop Doctor leaf scanning, IoT-driven precision irrigation scheduling, APMC Mandi real-time modal price discovery, direct farm-input marketplace e-commerce, and personalized government subsidy eligibility matching, through to a secure, role-based Admin Command Center.

---

## 🏗️ System Architecture

```text
                                🌱 KRISHI DIGITAL
                          DIGITAL AGRICULTURE MISSION
                                       │
              ┌────────────────────────┴────────────────────────┐
              │                                                 │
      👨‍🌾 FARMER PORTAL                                  🛡️ ADMIN COMMAND CENTER
              │                                                 │
    ┌─────────┴─────────┐                             ┌─────────┴─────────┐
    │  Digital Farm Map │                             │  Farmer Directory │
    │  Crop Timeline    │                             │  Mandi Price CRUD │
    │  Weather Alerts   │                             │  Product Catalog  │
    │  Soil Health Radar│                             │  Order Dispatch   │
    │  AI Crop Doctor   │                             │  Scheme Publishing│
    │  Smart Irrigation │                             │  Expert Onboard   │
    │  APMC Mandi Board │                             │  Platform Stats   │
    │  Agri-Marketplace │                             └─────────┬─────────┘
    │  Scheme Matcher   │                                       │
    │  Expert Advisory  │                                       │
    └─────────┬─────────┘                                       │
              │                                                 │
              └────────────────────────┬────────────────────────┘
                                       │
                                       ▼
                       🌐 REST API CLIENT (Axios + JWT)
                         Token Injection & Error Interceptor
                                       │
                                       ▼
                     ⚡ EXPRESS.JS REST API (TypeScript)
               ├── Authentication Middleware (JWT + bcryptjs)
               ├── Role-Based Access Control (Admin / Farmer)
               ├── 17 Modular Route Handlers & Controllers
               └── Request Sanitization & Centralized Error Handling
                                       │
                                       ▼
                         🌿 MONGOOSE ODM (TypeScript)
               ├── 15 Strong Schemas with Relational ObjectIds
               ├── Timestamps, Virtuals & Query Indexes
               └── Auto-Seeder on Fresh Deployment
                                       │
                                       ▼
                     🍃 MONGODB / MONGODB ATLAS CLOUD
               ├── Cloud: MongoDB Atlas Cluster Connection
               └── Local: Automatic In-Memory Mongo Engine Fallback
```

---

## 🎨 Visual Identity & Design System

The design reflects an authoritative government agency blended with a cutting-edge SaaS dashboard:
- **Primary Green**: `#166534` (Deep Forest Green — trust, authority, nature)
- **Secondary Accent**: `#22C55E` (Vibrant Emerald — growth, health, technology)
- **Light Green Accent**: `#DCFCE7` (Soft mint background tags and pills)
- **Warm Cream**: `#F8F7F0` (Soil-friendly, readable parchment background)
- **Dark Slate**: `#172018` (High-contrast typography)
- **Amber Warning**: `#D97706` (Weather and crop stress alerts)

---

## 🚀 Key Modules & Capabilities

### 1. Farmer Registration & Secure Authentication
- Multi-field onboarding: Full Name, Email, Mobile, Password, State, District, Village, Land Area (Acres), and Primary Crop.
- Password hashing with **`bcryptjs`** (salt rounds = 10) and stateless token issuance via **JSON Web Tokens (JWT)**.
- 1-Click Demo Login credentials directly available on the login screen.

### 2. Farmer SaaS Dashboard
- Live operational overview: Total Farm Acreage, Active Crops, Aggregate Crop Health Score (%), and Estimated Seasonal Revenue.
- Real-time weather widget, N-P-K soil summary, APMC ticker cards, urgent alerts, and fast navigation pills.

### 3. My Farm & Interactive Simulated Digital Farm Map
- Farm plot CRUD (name, village, district, state, acreage, soil classification, irrigation type, water source, latitude, and longitude).
- **Interactive SVG Cadastral Farm Map**: Interactive zones for Cotton Field, Vegetable Field, Central Water Storage Tank, and IoT Agro-Sensors with real-time telemetry modals.

### 4. Crop Management & Phenological Timeline
- Comprehensive tracking for Cotton, Wheat, Groundnut, Rice, Maize, Tomato, Onion, and Potato.
- **6-Stage Visual Phenological Lifecycle**: Planting ➔ Germination ➔ Vegetative ➔ Flowering ➔ Fruiting ➔ Harvest with automated progress indicator.
- Fertilizer management checklist and water requirement metrics.

### 5. Hyper-Local Agro-Weather Intelligence
- Real-time temperature, atmospheric humidity, wind speed, precipitation probability, UV index, sunrise, and sunset.
- 7-Day farming forecast with critical **Agricultural Alerts** (e.g., Heavy Rain alert, High Heat stress advisory, Strong Gust alert).

### 6. Soil Health Intelligence
- Soil Health Score card (82% - Excellent condition).
- N-P-K (Nitrogen, Phosphorus, Potassium), Organic Carbon, pH, and Moisture metric bars.
- Interactive Recharts **Radar Chart** and comparison bars.
- Soil test report upload simulation with tailored nutrient enrichment advisories.

### 7. AI Crop Doctor (Leaf Disease Detection)
- Camera & file drop zone for suspect leaf imagery.
- Live animated scanning diagnostic simulation.
- Returns disease identification (*Cercospora Leaf Spot*, *Late Blight*, *Powdery Mildew*), severity gauge, confidence rating (89%), and actionable organic + chemical management protocol.
- **Strict Compliance Notice**: Transparently labeled with a **Demo AI Analysis** badge.

### 8. Precision Smart Irrigation & IoT Telemetry
- Field soil moisture monitoring (32% current vs 55% target threshold) triggering an automated **"Irrigation Required"** state.
- Tailored water dosage calculator (1,200 Litres recommended between 6:00 AM – 8:00 AM).
- IoT sensor cards: Soil Probe, Air Temp, Humidity, Water Reservoir Depth, Pump Flow Rate.
- Interactive Recharts 24-hour soil moisture timeline graph.
- Automated pump simulation toggle and MongoDB-backed irrigation scheduling form.

### 9. APMC Mandi Market Price Discovery
- Real-time market directory across agricultural markets (Ahmedabad, Gondal, Rajkot, Unjha, Mehsana, Surat, Vadodara).
- Search and filtering by crop, state, and market.
- Minimum, Maximum, and Modal Price per Quintal with directional price trends.
- Recharts price movement trends and best market realization card.

### 10. Agricultural Marketplace & Shopping Cart
- 8 agricultural categories: Seeds, Fertilizers, Pest Control, Micronutrients, Irrigation, Machinery, Farm Tools, and Organic Inputs.
- Product cards with high-resolution imagery, pricing, discounts, stock indicator, star ratings, and instant cart addition.
- Interactive cart drawer & checkout modal computing subtotal, GST, and free rural delivery threshold.

### 11. Government Schemes & Eligibility Matcher
- Direct directory of central and state agricultural welfare schemes (PM-KISAN, PMFBY Crop Insurance, PM Krishi Sinchayee, Sub-Mission on Ag Mechanization, PKVY Organic Farming, etc.).
- **"Find Schemes For Me" Interactive Recommendation Engine**: Matches farmer land holding size, crop choice, and irrigation type with qualified government programs.

### 12. Expert Advisory & Consultations
- Verified agricultural scientists, soil agronomists, and irrigation specialists.
- Digital consultation ticket submission with category selection, crop affected, description, and photo attachment.
- Farmer query history with expert reply status.

### 13. Knowledge Center
- Practical agricultural knowledgebase: Crop Guides, Soil Care, Water Harvesting, Pest Management, and Policy Updates.
- Reading time, view counts, and category tags.

### 14. Multilingual Readiness
- Complete English, **ગુજરાતી (Gujarati)**, and **हिन्दी (Hindi)** interface switcher with persistent language state.

### 15. Role-Based Admin Command Center (`/admin`)
- Accessible exclusively by users with role `admin` (enforced via backend middleware and client route guards).
- Platform Analytics: Total Farmers, Total Farms, Active Crops, Marketplace Products, System Orders, Registered Experts, and Mandi Records.
- Registration growth charts and crop distribution visualizations.
- Full CRUD operations:
  - Manage and inspect Farmers
  - Create and manage Mandi price records
  - Add, edit, and update stock for Marketplace products
  - View incoming orders and update delivery status (*Pending* ➔ *Confirmed* ➔ *Processing* ➔ *Shipped* ➔ *Delivered*)
  - Publish new Government Schemes

---

## 💻 Tech Stack Overview

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS 3.4 with custom typography and curated palettes
- **Routing**: React Router DOM 6
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Radar, Line, Bar charts)
- **HTTP Client**: Axios with automatic Bearer token injection
- **State Management**: React Context (Auth, Cart, Language)

### Backend
- **Runtime**: Node.js 18+
- **Server Framework**: Express.js with TypeScript
- **Database Engine**: MongoDB / MongoDB Atlas compatible
- **Object Data Modeling (ODM)**: Mongoose 8
- **Authentication**: JSON Web Tokens (`jsonwebtoken`)
- **Password Security**: `bcryptjs`
- **CORS & Middleware**: Express JSON parser, CORS, auth protection, role enforcement
- **Development Resilience**: Integrated in-memory MongoDB fallback engine for instant zero-dependency launch if no local mongod is active.

---

## 📂 Project Directory Structure

```text
DIGITAL AGRICULTURE MISSION/
│
├── package.json                   # Root orchestrator scripts
├── test-api.cjs                   # Automated API integration verification suite
│
├── client/                        # React + TypeScript + Vite Frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── types/index.ts         # Central TypeScript interfaces
│       ├── translations/          # English, Gujarati & Hindi dictionaries
│       ├── context/               # AuthContext, CartContext, LanguageContext
│       ├── services/              # 15 Axios API service modules
│       ├── components/            # Reusable UI components
│       │   ├── Navbar.tsx
│       │   ├── Sidebar.tsx
│       │   ├── BottomNav.tsx
│       │   ├── Footer.tsx
│       │   ├── GlobalSearch.tsx
│       │   ├── DigitalFarmMap.tsx
│       │   ├── CropTimeline.tsx
│       │   ├── SkeletonLoader.tsx
│       │   └── EmptyState.tsx
│       └── pages/                 # 21 Application Pages
│           ├── HomePage.tsx
│           ├── LoginPage.tsx
│           ├── RegisterPage.tsx
│           ├── DashboardPage.tsx
│           ├── MyFarmPage.tsx
│           ├── CropsPage.tsx
│           ├── WeatherPage.tsx
│           ├── SoilHealthPage.tsx
│           ├── DiseaseDetectionPage.tsx
│           ├── IrrigationPage.tsx
│           ├── MarketPage.tsx
│           ├── MarketplacePage.tsx
│           ├── CartPage.tsx
│           ├── OrdersPage.tsx
│           ├── SchemesPage.tsx
│           ├── ExpertsPage.tsx
│           ├── KnowledgePage.tsx
│           ├── ArticleDetailPage.tsx
│           ├── AboutPage.tsx
│           ├── ProfilePage.tsx
│           ├── AdminPage.tsx
│           └── NotFoundPage.tsx
│
└── server/                        # Express + TypeScript + Mongoose Backend
    ├── package.json
    ├── tsconfig.json
    ├── .env
    ├── .env.example
    └── src/
        ├── server.ts              # Express initialization & routing
        ├── seed.ts                # Database seeder with realistic Indian data
        ├── config/
        │   └── db.ts              # MongoDB / Atlas / In-Memory connector
        ├── middleware/
        │   ├── auth.ts            # JWT verification & adminOnly guard
        │   └── error.ts           # Error handler & 404 handler
        ├── models/                # 15 Mongoose Schema Definitions
        │   ├── User.ts
        │   ├── Farm.ts
        │   ├── Crop.ts
        │   ├── SoilReport.ts
        │   ├── Weather.ts
        │   ├── MarketPrice.ts
        │   ├── Product.ts
        │   ├── Order.ts
        │   ├── Scheme.ts
        │   ├── Expert.ts
        │   ├── Consultation.ts
        │   ├── Article.ts
        │   ├── Notification.ts
        │   ├── Irrigation.ts
        │   └── DiseaseReport.ts
        ├── controllers/           # Business logic for all 17 domains
        └── routes/                # Modular Express route declarations
```

---

## ⚙️ Environment Configuration

### Backend: `server/.env`
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=krishi_digital_super_secret_jwt_key_2026

# Set your MongoDB Atlas connection string below:
MONGODB_URI=mongodb://localhost:27017/krishi_digital
```

> **Note on MongoDB**: If a local `mongod` service is not running or unreachable, KRISHI DIGITAL automatically starts an internal in-memory MongoDB engine in development mode so you can test the application immediately without installing MongoDB locally.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm (version 9 or higher)

### 1. Installation
Install all dependencies for both client and server:
```bash
# From workspace root:
npm run install:all

# Or separately:
cd server && npm install
cd ../client && npm install
```

### 2. Seed Database
Populate the database with realistic Indian agriculture records (5 users, 8 farms, 15 crops, 20 Mandi records, 20 products, 10 government schemes, 5 experts, 10 articles, and 10 irrigation telemetry entries):
```bash
# From workspace root:
npm run seed

# Or from server directory:
cd server && npm run seed
```

### 3. Run Development Servers
Open two terminal windows or run the unified dev command:

**Terminal 1 (Backend - Port 5000):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend - Port 5173):**
```bash
cd client
npm run dev
```

Open your browser and navigate to: **`http://localhost:5173`**

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@krishidigital.com` | `Admin@123` | Full access to `/admin` dashboard and all farmer services |
| **Farmer (Ramesh Patel)** | `ramesh.farmer@krishidigital.com` | `Farmer@123` | Farmer portal, personal farms, crops, orders, consultations |
| **Farmer (Suresh Kumar)** | `suresh.kumar@krishidigital.com` | `Farmer@123` | Farmer portal |

> **Convenience Feature**: The Login page features **"Demo Farmer Login"** and **"Demo Admin Login"** auto-fill buttons for instant 1-click testing!

---

## 📡 REST API Reference

| Endpoint | Method | Access | Description |
| :--- | :---: | :---: | :--- |
| `/api/health` | `GET` | Public | System status and service health check |
| `/api/auth/register` | `POST` | Public | Register new farmer account |
| `/api/auth/login` | `POST` | Public | Authenticate user & return JWT token |
| `/api/auth/me` | `GET` | Private | Get authenticated user profile |
| `/api/farms` | `GET`, `POST` | Private | List or create registered farms |
| `/api/farms/:id` | `GET`, `PUT`, `DELETE` | Private | View, update or remove farm |
| `/api/crops` | `GET`, `POST` | Private | List or register active crops |
| `/api/crops/:id` | `GET`, `PUT`, `DELETE` | Private | View, update or delete crop |
| `/api/weather` | `GET` | Public | Agro-weather & 7-day forecast |
| `/api/soil` | `GET`, `POST` | Private | Soil test metrics and report upload |
| `/api/disease/analyze` | `POST` | Public | AI Crop Doctor leaf disease analysis |
| `/api/irrigation` | `GET`, `POST` | Private | Soil telemetry & irrigation schedule |
| `/api/market` | `GET` | Public | APMC Mandi prices with filters |
| `/api/products` | `GET` | Public | Marketplace catalog with category filters |
| `/api/orders` | `GET`, `POST` | Private | List orders or create checkout order |
| `/api/schemes` | `GET` | Public | Government welfare schemes |
| `/api/schemes/recommend` | `POST` | Public | Scheme recommendation matcher |
| `/api/experts` | `GET` | Public | Agricultural scientists & specialists |
| `/api/consultations` | `GET`, `POST` | Private | Submit or review consultation tickets |
| `/api/articles` | `GET` | Public | Knowledge center articles |
| `/api/notifications` | `GET` | Private | Farmer alert notifications |
| `/api/admin/stats` | `GET` | Admin | High-level platform metrics |
| `/api/admin/farmers` | `GET` | Admin | Farmers directory and status controls |
| `/api/admin/orders/:id/status`| `PUT` | Admin | Update order fulfillment status |

---

## 🧪 Automated Testing Verification

An automated API test runner is included at `test-api.cjs`:
```bash
npm run test:api
```

This script verifies:
1. `GET /api/health` ➔ Status 200 OK
2. `POST /api/auth/login` (Farmer) ➔ Status 200 OK
3. `POST /api/auth/login` (Admin) ➔ Status 200 OK
4. `GET /api/farms` (Authenticated) ➔ Status 200 OK
5. `GET /api/crops` (Authenticated) ➔ Status 200 OK
6. `GET /api/market` ➔ Status 200 OK (20 records)
7. `GET /api/products` ➔ Status 200 OK (20 products)
8. `GET /api/schemes` ➔ Status 200 OK (10 schemes)
9. `GET /api/admin/stats` (Admin Only) ➔ Status 200 OK
10. `GET /api/admin/stats` as Farmer ➔ Status 403 Forbidden (RBAC Enforcement)

---

## 🛡️ Production Deployment

### Building for Production
```bash
# Build both frontend and backend bundles:
npm run build
```
- Client builds to `client/dist/`
- Server compiles to `server/dist/`

### Connecting to MongoDB Atlas
1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and whitelist your server IP address (or `0.0.0.0/0`).
3. Replace `MONGODB_URI` in `server/.env` with your Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/krishi_digital?retryWrites=true&w=majority
   ```
4. Run `npm run seed` to initialize your Atlas database.
5. Start the production server:
   ```bash
   cd server && node dist/server.js
   ```

---

## 📜 Future Roadmap
- [ ] Direct integration with real-time Enam / Agmarknet Mandi API feeds.
- [ ] Computer Vision PyTorch/TensorFlow leaf disease inference microservice.
- [ ] OpenWeatherMap Agro API integration with automated SMS weather alerts.
- [ ] Aadhaar e-KYC / AgriStack Farmer Registry API gateway integration.
- [ ] Razorpay / UPI payment gateway integration for marketplace transactions.
- [ ] Offline-first Progressive Web App (PWA) support with service workers.

---

## 📄 License
This project is open-source under the **MIT License**.

© 2026 **KRISHI DIGITAL — Digital Agriculture Mission**. All rights reserved.
