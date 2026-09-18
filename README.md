# Food Delivery App (Cravo) - Full Stack

A production-grade, full-stack Food Delivery platform built with **React Native (0.87 CLI)** and **NestJS 11**, backed by **PostgreSQL** and **TypeORM**. 

Designed with a modern, high-contrast visual identity inspired by industry standards (Foodpanda/Cravo theme with `#D70F64` vibrant pink and charcoal accents).

---

## Demo Video Walkthroughs

| Customer Flow (Browse, Cart & Live Tracking) | Restaurant Owner Flow (Orders, Filters & Customer Access) |
|:---:|:---:|
| <video src="https://github.com/Muhammad-Suleman-Hameed/foodDelivery/raw/main/docs/videos/customer-flow.mp4" controls="controls" muted="muted" width="100%"></video><br/><sub>Direct Link: [`customer-flow.mp4`](docs/videos/customer-flow.mp4)</sub> | <video src="https://github.com/Muhammad-Suleman-Hameed/foodDelivery/raw/main/docs/videos/owner-flow.mp4" controls="controls" muted="muted" width="100%"></video><br/><sub>Direct Link: [`owner-flow.mp4`](docs/videos/owner-flow.mp4)</sub> |

---

## Architecture & Tech Stack

### Mobile App (`/FoodDeliveryMobile`)
- **Framework**: React Native 0.87 (CLI) with TypeScript
- **Navigation**: React Navigation (`@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`)
- **State Management**: Zustand with persistent storage (`@react-native-async-storage/async-storage`)
- **Networking**: Axios instance with automated Bearer token injection and error interceptors
- **Design System**: Responsive typography and spacing (`react-native-responsive-screen`), Lucide uncolored stroke icons, Foodpanda color palette

### Backend API (`/backend`)
- **Framework**: NestJS 11 (Modular Domain Architecture)
- **Database & ORM**: PostgreSQL with TypeORM
- **Authentication**: JWT (`@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcryptjs`)
- **Validation**: Global `ValidationPipe` with `class-validator` and `class-transformer`
- **Documentation**: Swagger OpenAPI interactive docs at `http://localhost:3000/api/docs`

---

## Key Features

### 1. Dual User Roles
- **Regular User (Customer)**:
  - Browse restaurants and filter meals by category (Burgers, Pizza, Drinks, Desserts).
  - Server-synced Cart (cart items stored in database, preventing client-side desync).
  - Seamless Checkout with address, payment method (Cash on Delivery / Card), and special notes.
  - Live Order Tracking with a 4-step interactive timeline stepper.
  - Profile view with saved addresses, contact information, and order history.
- **Restaurant Owner**:
  - Dedicated 4-Tab Bottom Navigation: **Restaurants**, **Orders**, **Customers**, and **Profile**.
  - Full CRUD operations for restaurants and meals.
  - In-screen status tabs for orders: **All**, **Placed**, **Preparing**, **On the Way**, **Delivered**, and **Cancelled**.
  - One-tap status progression: *Start Preparing* &rarr; *Dispatch Order* &rarr; *Mark Delivered*.
  - Customer Access Management: Directory of all customers who ordered, with 1-tap **Block / Unblock** permissions (no manual database IDs required).

---

## Test Accounts & Credentials

The database seeder pre-configures accounts for testing and demonstrations:

| Role | Name | Email | Password | Details |
|---|---|---|---|---|
| **Restaurant Owner** | Master Chef | `chef@cravo.com` | `Password123!` | Manages 3 restaurants and orders in all statuses |
| **Customer** | Muhammad Suleman | `suleman@example.com` | `Password123!` | Has active Placed, On the Way, and Delivered orders |
| **Customer** | Ayesha Khan | `ayesha@cravo.com` | `Password123!` | Has orders in Preparing and Delivered |
| **Customer** | Bilal Ahmed | `bilal@example.com` | `Password123!` | Has orders in Preparing and Delivered |
| **Customer** | Zainab Fatima | `zainab@example.com` | `Password123!` | Has order On the Way |
| **Customer (Blocked)** | Hamza Ali | `hamza@example.com` | `Password123!` | Blocked customer with a Cancelled order |

---

## Getting Started

### Prerequisites
- **Node.js**: v18 or later
- **npm** or **yarn**
- **PostgreSQL**: Running locally on port `5432`
- **macOS**: Xcode & CocoaPods (for iOS simulator/device)
- **Android Studio & SDK**: (for Android emulator/device)

---

### Step 1: Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the `backend/` root (or copy from `.env.example`):
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=food_delivery_db
   JWT_SECRET=super_secret_food_delivery_jwt_key_2026
   JWT_EXPIRES_IN=7d
   ```

4. **Create the PostgreSQL database**:
   ```bash
   createdb food_delivery_db
   # or in psql: CREATE DATABASE food_delivery_db;
   ```

5. **Seed demo data (Users, Restaurants, Meals, Orders in all statuses)**:
   ```bash
   npm run seed:demo
   ```

6. **Start the backend development server**:
   ```bash
   npm run start:dev
   ```
   The API will start at `http://localhost:3000`.  
   Interactive Swagger documentation is available at `http://localhost:3000/api/docs`.

---

### Step 2: Mobile App Setup

1. **Navigate to the mobile directory**:
   ```bash
   cd FoodDeliveryMobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **iOS Setup (macOS only)**:
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Run on iOS Simulator**:
   ```bash
   npm run ios
   ```

5. **Run on Android Emulator**:
   Make sure an Android Virtual Device (AVD) is running, then:
   ```bash
   npm run android
   ```

> **Network Note:**  
> The app automatically routes API calls:
> - **iOS Simulator**: `http://localhost:3000`
> - **Android Emulator**: `http://10.0.2.2:3000`  
> If testing on a physical mobile device, update `baseUrl` in `src/store/useEnvironmentStore.ts` to your machine's local Wi-Fi IP.

---

## Project Structure

```text
foodDelivery/
├── backend/
│   ├── scripts/
│   │   └── seed-demo-data.js        # Automated seeder for users, restaurants & orders
│   └── src/
│       ├── common/                  # Guards, decorators & exception filters
│       ├── config/                  # Database & environment configurations
│       └── modules/
│           ├── auth/                # JWT auth, strategies & login/register DTOs
│           ├── users/               # User entities, profile & block management
│           ├── restaurants/         # Restaurant CRUD & owner listings
│           ├── meals/               # Meals CRUD & menu management
│           ├── cart/                # Server-synced persistent cart operations
│           └── orders/              # Order lifecycle, status progression & history
│
└── FoodDeliveryMobile/
    └── src/
        ├── components/              # Reusable UI components (Buttons, Inputs, Cards)
        ├── constants/               # API endpoints & app constants
        ├── hooks/                   # Custom hooks (Cart, Orders, Dashboard)
        ├── navigation/              # AppNavigator, MainTabNavigator, OwnerTabNavigator
        ├── screens/
        │   ├── auth/                # Login & Registration screens
        │   ├── home/                # Restaurant feed & category filtering
        │   ├── restaurant/          # Restaurant details & menu listing
        │   ├── cart/                # Cart summary & checkout trigger
        │   ├── checkout/            # Address & payment method selection
        │   ├── orderTracking/       # 4-stage visual timeline stepper
        │   ├── orders/              # Customer order history
        │   ├── profile/             # Customer profile & account management
        │   └── owner/               # Dedicated Owner screens (Restaurants, Orders, Customers, Profile)
        ├── store/                   # Zustand stores (Auth, Environment, Owner)
        ├── theme/                   # Colors, typography & responsive dimensions
        ├── types/                   # TypeScript entity definitions
        └── utils/                   # Axios client & human-readable formatters
```

---

## License

This project is open source and available under the MIT License.
