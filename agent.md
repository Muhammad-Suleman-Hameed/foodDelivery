# Engineering Guidelines & Architecture Standards

This document establishes the architecture, folder conventions, and coding patterns for the **foodDelivery** full-stack project, derived directly from the reference codebases (`rems-mobile-customer-v2` and `user-service-backend`).

---

## 1. Tech Stack Overview

### Backend (`/backend`)
- **Framework**: NestJS 11
- **API Documentation**: Swagger (`@nestjs/swagger`, `swagger-ui-express`) at `/api/docs`
- **ORM / Database**: TypeORM with PostgreSQL (`pg` driver, database: `food_delivery_db`)
- **Config & Secrets**: `@nestjs/config` with `.env` / `.env.example`
- **Validation**: `class-validator`, `class-transformer` via global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })`
- **Authentication**: JWT (`@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcryptjs`)
- **Architecture**: Domain-driven modular structure (`src/modules/*`)

### Mobile App (`/FoodDeliveryMobile`)
- **Framework**: React Native 0.87 (CLI) with TypeScript
- **State Management**: `zustand` (with `zustand/middleware` `persist` via `@react-native-async-storage/async-storage`)
- **Networking**: `axios` wrapper with Bearer token injection (matching `rems-mobile-customer-v2/src/utils/axios.tsx`)
- **Navigation**: `@react-navigation/native` & `@react-navigation/native-stack`
- **Responsiveness**: `react-native-responsive-screen` (`wp`, `hp`) helper functions
- **Design System / Theme**: **Foodpanda Reference**
  - Primary Brand Pink: `#D70F64`
  - Primary Dark / Charcoal: `#212121`
  - Background Light / Off-White: `#F7F7F7`
  - Card & Surface: `#FFFFFF`
  - Border Gray: `#EBEBEB`
  - Muted Text: `#757575`
  - Accent / Success: `#008A05`

---

## 2. Directory Structure Conventions

### Backend (`backend/src`)
```text
backend/src/
├── common/
│   ├── decorators/      # @CurrentUser(), @Public()
│   ├── guards/          # JwtAuthGuard
│   └── filters/         # GlobalHttpExceptionFilter
├── config/              # Environment config & TypeORM data-source
├── database/            # Database seeders & initial data
├── modules/
│   ├── auth/            # AuthController, AuthService, JwtStrategy, DTOs
│   ├── users/           # User entity, UserService
│   ├── restaurants/     # Restaurant & MenuItem entities, Controllers, Services
│   ├── cart/            # Server-side Cart entity & Services (No local cart storage)
│   └── orders/          # Order & OrderItem entities, Order status tracking
├── app.module.ts
└── main.ts              # Global validation, CORS, Swagger setup
```

### Mobile (`FoodDeliveryMobile/src`)
```text
FoodDeliveryMobile/src/
├── theme/
│   ├── colors.ts        # Foodpanda color palette
│   ├── responsive.ts    # wp(), hp() helpers
│   └── typography.ts    # Font sizes and weights
├── components/          # Reusable UI components (atomic & isolated)
│   ├── customButton/
│   ├── customText/
│   ├── input/
│   ├── header/
│   ├── restaurantCard/
│   ├── foodItemCard/
│   └── statusBadge/
├── screens/
│   ├── auth/            # LoginScreen, RegisterScreen
│   ├── home/            # HomeScreen (Search, Categories, Restaurant Feed)
│   ├── restaurant/      # RestaurantDetailScreen (Menu sections, Item detail)
│   ├── cart/            # CartScreen (Server-synced quantities & price summary)
│   ├── checkout/        # CheckoutScreen (Address & Payment)
│   └── orders/          # OrderTrackingScreen (Live status timeline)
├── navigation/
│   ├── AppNavigator.tsx # Root stack navigation
│   └── types.ts         # NavigationParamList types
├── store/
│   ├── useAuthStore.ts  # Persisted JWT, user profile, login/logout
│   └── useEnvironmentStore.ts # Base URL configuration (e.g. http://localhost:3000)
├── utils/
│   ├── axios.tsx        # Standardized axios client with token interceptor
│   └── helpers.ts       # Price formatters & status helpers
└── constants/
    ├── api.ts           # API route constants
    └── globalConstants.ts
```

---

## 3. Implementation Rules

1. **Server-Side Only Cart**: All cart operations (adding, updating quantity, removing) MUST be synced and stored on the backend database per authenticated user. No local cart states to prevent desync.
2. **Swagger Annotated**: All backend endpoints must have `@ApiTags()`, `@ApiOperation()`, and appropriate `@ApiResponse()` annotations.
3. **Simplicity & Readability**: Keep functions short, avoid unnecessary abstractions, and write self-explanatory variable and function names.
4. **Foodpanda Visual Identity**: Vibrant `#D70F64` buttons and accents, soft rounded corners (`borderRadius: 12` to `16`), clean card elevations, and crisp contrast.
