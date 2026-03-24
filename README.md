# 📊 Subscription Manager

> A full-stack web application for tracking and managing digital subscriptions with powerful insights into spending habits.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)
![Status](https://img.shields.io/badge/status-active-success)

## 🎯 Overview

**Subscription Manager** is a secure, user-centric platform that helps individuals take control of their digital finances by centralizing subscription tracking, analyzing spending patterns, and providing actionable insights.

### The Problem

In today's digital ecosystem, managing recurring subscriptions is chaotic:
- Users juggle dozens of streaming, software, and SaaS services
- Subscription fees accumulate invisibly across multiple platforms
- It's easy to forget about unused services and waste money
- Visualizing total monthly/annual spending is nearly impossible without manual tracking

### The Solution

Subscription Manager solves this by providing:
- ✅ **Centralized tracking** of all subscriptions in one place
- ✅ **Real-time spending insights** with interactive data visualization
- ✅ **Smart organization** using pre-defined service catalogs
- ✅ **Secure authentication** with JWT-based access control
- ✅ **Responsive, modern UI** for seamless subscription management

---

## ✨ Key Features

### 🔐 Authentication & Security
- **User Registration & Login:** Secure account creation with email/password
- **JWT-based Sessions:** Stateless authentication for scalability
- **Password Hashing:** Industry-standard bcryptjs for secure password storage
- **Protected Routes:** All subscription operations require authentication

### 📝 Subscription Management
- **Full CRUD Operations:** Create, read, update, and delete subscriptions
- **Renewal Tracking:** Monitor subscription renewal dates
- **Price Management:** Track individual subscription costs
- **User Data Isolation:** Each user sees only their own subscriptions

### 🎨 Service Catalog
- **Pre-defined Services:** Curated list of popular services (Netflix, Spotify, etc.)
- **Organized Categories:** Services grouped by type (streaming, software, productivity)
- **Brand Branding:** Service logos and brand colors for visual identification
- **Extensible Design:** Easy to add new services to the catalog

### 📊 Dashboard & Analytics
- **Total Cost Calculation:** Real-time monthly spending aggregate
- **Interactive Visualization:** Doughnut chart showing spending distribution
- **Percentage Breakdown:** Visual representation of spending by service
- **Responsive Design:** Works seamlessly on desktop and mobile devices

### 🎭 User Experience
- **Dark Theme Interface:** Modern, comfortable design that reduces eye strain
- **Modal-based Editing:** Inline subscription editing without page navigation
- **Form Validation:** Client-side validation for better UX
- **Accessibility:** Semantic HTML and keyboard navigation support

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework with hooks and latest features |
| **TypeScript** | Type-safe JavaScript for robust code |
| **Vite** | Lightning-fast build tool and dev server |
| **React Router 7** | Client-side routing and navigation |
| **Chart.js** | Interactive charts and data visualization |
| **React Select** | Accessible dropdown component |
| **Modern CSS** | Flexbox, Grid, and CSS custom properties |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime for server-side code |
| **Express.js** | Web framework for building REST APIs |
| **PostgreSQL** | Relational database for data persistence |
| **Prisma** | Next-gen ORM with type safety |
| **JWT** | Token-based authentication |
| **bcryptjs** | Password hashing and verification |
| **CORS** | Cross-origin resource sharing |

### Development & Testing
| Technology | Purpose |
|------------|---------|
| **Jest** | Testing framework for backend |
| **Supertest** | HTTP assertion library for API testing |
| **ESLint** | Code quality and consistency |
| **TypeScript** | Type checking for Node.js files |

---

## 📁 Project Structure

```
subscription-manager/
├── client/                          # React Frontend Application
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Dashboard.tsx       # Main dashboard view
│   │   │   ├── SubscriptionForm.tsx # Add/edit subscription form
│   │   │   ├── SubscriptionList.tsx # List of user subscriptions
│   │   │   ├── SubscriptionChart.tsx # Chart visualization
│   │   │   ├── Navbar.tsx          # Navigation component
│   │   │   ├── Footer.tsx          # Footer component
│   │   │   └── auth/
│   │   │       └── ProtectedRoute.tsx # Route protection wrapper
│   │   ├── pages/                  # Page-level components
│   │   │   ├── LandingPage.tsx     # Public landing page
│   │   │   ├── LoginPage.tsx       # User login
│   │   │   ├── RegisterPage.tsx    # User registration
│   │   │   └── DashboardPage.tsx   # Protected dashboard
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx     # Authentication state management
│   │   ├── hooks/
│   │   │   └── useAuth.ts          # Custom hook for auth logic
│   │   ├── services/
│   │   │   └── api.ts              # API client configuration
│   │   ├── App.tsx                 # Root component
│   │   ├── main.tsx                # App entry point
│   │   └── *.css                   # Component stylesheets
│   ├── index.html                  # HTML template
│   ├── vite.config.ts              # Vite configuration
│   ├── tsconfig.json               # TypeScript configuration
│   └── package.json                # Dependencies
│
├── server/                          # Express Backend Application
│   ├── routes/
│   │   ├── auth.js                 # Authentication endpoints
│   │   ├── subscriptions.js        # Subscription CRUD endpoints
│   │   └── services.js             # Service catalog endpoints
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT verification middleware
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema definition
│   │   ├── seed.ts                 # Database seeding script
│   │   ├── migrations/             # Database migration files
│   │   └── dbml/                   # Database diagram (DBML format)
│   ├── __tests__/                  # Jest test files
│   │   ├── auth.test.js            # Auth endpoint tests
│   │   ├── subscriptions.test.js   # Subscription tests
│   │   └── app.test.js             # App configuration tests
│   ├── generated/                  # Prisma client (auto-generated)
│   ├── app.js                      # Express app setup
│   ├── server.js                   # Server entry point
│   ├── jest.config.js              # Jest configuration
│   ├── tsconfig.json               # TypeScript configuration
│   ├── .env                        # Environment variables
│   └── package.json                # Dependencies
│
└── README.md                        # This file
```

---

## 🚀 Quick Start

### Prerequisites

Ensure you have installed:
- **Node.js** (v18+) and **npm** (v9+)
- **PostgreSQL** (v12+) running locally or accessible via connection string
- A PostgreSQL client/GUI (optional, for database inspection)

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `server/` directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/subscription_manager"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=3001
   ```

4. **Setup the database:**
   ```bash
   # Run migrations
   npx prisma migrate dev --name init
   
   # (Optional) Seed the database with sample services
   npx prisma db seed
   ```

5. **Start the backend server:**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3001`

### Frontend Setup

1. **Navigate to client directory (in a new terminal):**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

---

## 🔌 API Documentation

All API endpoints (except `/api/auth/register` and `/api/auth/login`) require the `Authorization` header with a valid JWT token:
```
Authorization: Bearer <your_jwt_token>
```

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: 201 Created
{
  "id": 1,
  "email": "user@example.com"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Subscriptions Endpoints

#### Get All User Subscriptions
```
GET /api/subscriptions
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "price": 14.99,
    "renewalDate": "2025-04-15T00:00:00Z",
    "createdAt": "2025-03-15T10:30:00Z",
    "serviceId": 1,
    "userId": 1,
    "service": {
      "id": 1,
      "name": "Netflix",
      "logoUrl": "/logos/netflix.png",
      "brandColor": "#E50914",
      "categoryId": 1,
      "category": {
        "id": 1,
        "name": "Streaming"
      }
    }
  }
]
```

#### Create Subscription
```
POST /api/subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "serviceId": 1,
  "price": 14.99,
  "renewalDate": "2025-04-15"
}

Response: 201 Created
{
  "id": 1,
  "price": 14.99,
  "renewalDate": "2025-04-15T00:00:00Z",
  "createdAt": "2025-03-15T10:30:00Z",
  "serviceId": 1,
  "userId": 1,
  "service": { ... }
}
```

#### Update Subscription
```
PUT /api/subscriptions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 19.99,
  "renewalDate": "2025-05-15"
}

Response: 200 OK
{ ... updated subscription ... }
```

#### Delete Subscription
```
DELETE /api/subscriptions/:id
Authorization: Bearer <token>

Response: 204 No Content
```

### Services Endpoints

#### Get All Services
```
GET /api/services
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "name": "Netflix",
    "logoUrl": "/logos/netflix.png",
    "brandColor": "#E50914",
    "categoryId": 1,
    "category": {
      "id": 1,
      "name": "Streaming"
    }
  }
]
```

### Categories Endpoint

#### Get All Categories
```
GET /api/categories

Response: 200 OK
[
  {
    "id": 1,
    "name": "Streaming"
  },
  {
    "id": 2,
    "name": "Software"
  }
]
```

---

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Here's the data model:

```prisma
model User {
  id              Int
  email           String (unique)
  password        String (hashed)
  createdAt       DateTime
  subscriptions   Subscription[]  // One user → many subscriptions
}

model Category {
  id              Int
  name            String (unique)
  services        Service[]       // One category → many services
}

model Service {
  id              Int
  name            String (unique)
  logoUrl         String
  brandColor      String (hex color)
  categoryId      Int
  category        Category
  subscriptions   Subscription[]  // One service → many subscriptions
}

model Subscription {
  id              Int
  price           Float
  renewalDate     DateTime
  createdAt       DateTime
  serviceId       Int
  service         Service
  userId          Int
  user            User
}
```

### Key Relationships:
- **User → Subscription:** One-to-Many (a user can have many subscriptions)
- **Service → Subscription:** One-to-Many (a service can have many subscriptions)
- **Category → Service:** One-to-Many (a category can have many services)

---

## 🧪 Testing

### Run Backend Tests
```bash
cd server
npm test
```

Tests cover:
- User authentication (registration, login)
- Subscription CRUD operations
- Authorization and data isolation
- Error handling

### Test Files
- `__tests__/auth.test.js` - Authentication tests
- `__tests__/subscriptions.test.js` - Subscription endpoint tests
- `__tests__/app.test.js` - App configuration tests

---

## 📈 Development Workflow

### Client-side Development

**Development Mode:**
```bash
cd client
npm run dev
```
- Hot Module Replacement (HMR) enabled
- TypeScript type checking
- ESLint code quality checks

**Build for Production:**
```bash
npm run build
```

**Lint Code:**
```bash
npm run lint
```

### Server-side Development

**Development Mode:**
```bash
cd server
npm start
```

**Run Tests:**
```bash
npm test
```

**Database Migrations:**
```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# View the database
npx prisma studio
```

---

## 🔐 Security Practices

- **Password Hashing:** All passwords are hashed using bcryptjs (10 salt rounds)
- **JWT Tokens:** Stateless authentication with expiring tokens
- **Input Validation:** Server-side validation of all incoming requests
- **SQL Injection Prevention:** Prisma ORM prevents SQL injection attacks
- **CORS Configuration:** Restricts cross-origin requests (configurable)
- **Data Isolation:** Users can only access their own subscriptions
- **Environment Variables:** Sensitive data stored in `.env` files (not in git)

**Security Notes:**
- Always use HTTPS in production
- Change `JWT_SECRET` to a strong, random string
- Keep dependencies updated: `npm audit` and `npm update`
- Implement rate limiting in production
- Use a `.env.example` file as a template for required variables

---

## 📱 Frontend Features in Detail

### Components

**Dashboard.tsx**
- Main application view after authentication
- Displays subscription list and summary chart
- Calculates and shows total monthly spending
- Provides controls for adding/editing subscriptions

**SubscriptionForm.tsx**
- Modal-based form for creating/editing subscriptions
- Dropdown selection for services
- Price and renewal date inputs
- Form validation and error handling

**SubscriptionChart.tsx**
- Interactive doughnut chart powered by Chart.js
- Shows spending distribution by service
- Displays percentage tooltips on hover
- Responsive sizing based on container

**SubscriptionList.tsx**
- Tabular display of all user subscriptions
- Inline edit and delete actions
- Sorting and filtering capabilities
- Service logos and brand colors

### Context & Hooks

**AuthContext.tsx**
- Global authentication state management
- JWT token storage and retrieval
- User login/logout functionality
- Protected component wrapper

**useAuth.ts**
- Custom hook for authentication logic
- Provides login, register, and logout functions
- Token management
- Error handling

---

## 🚀 Deployment

### Environment Variables for Production

Create a `.env` file with:
```env
DATABASE_URL="postgresql://prod-user:prod-password@prod-host:5432/subscription_manager"
JWT_SECRET="generate-a-strong-random-string-here"
PORT=3001
NODE_ENV="production"
CORS_ORIGIN="https://your-frontend-domain.com"
```

### Frontend Deployment

1. **Build the production bundle:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy the `dist/` folder to your hosting service:**
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - GitHub Pages
   - Any static hosting provider

### Backend Deployment

Options:
- **Heroku:** `git push heroku main`
- **Railway:** Connect Git repo, auto-deploy
- **AWS EC2/ECS:** Docker containerization recommended
- **DigitalOcean App Platform:** Simplified deployment
- **Render:** Free tier available

---

## 🔄 Data Flow

```
User (Browser)
    ↓
React Frontend (Client)
    ├── Authentication Context (JWT token management)
    ├── API Service (HTTP Client)
    └── Components (UI/UX)
    ↓
Express API (Server)
    ├── Auth Routes (register, login)
    ├── Auth Middleware (JWT verification)
    ├── Subscription Routes
    ├── Service Routes
    └── Prisma ORM
    ↓
PostgreSQL Database
    ├── Users
    ├── Categories
    ├── Services
    └── Subscriptions
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Code Standards
- Use TypeScript for type safety
- Follow existing code style
- Write meaningful commit messages
- Add tests for new functionality
- Update documentation as needed

---

## 📋 Future Enhancements

- [ ] Subscription reminders via email notifications
- [ ] Export subscription data (PDF, CSV)
- [ ] Multi-currency support
- [ ] Subscription sharing between family members
- [ ] Budget alerts and spending limits
- [ ] Advanced analytics and spending trends
- [ ] Dark/light theme toggle
- [ ] Mobile app (React Native)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Two-factor authentication (2FA)
- [ ] Social authentication (Google, GitHub)

---

## 🐛 Troubleshooting

### Database Connection Issues
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env` file
- Verify credentials are correct

### JWT Token Errors
```
Error: jwt malformed
```
- Ensure JWT_SECRET is set in `.env`
- Check token format in Authorization header
- Tokens may have expired

### Port Already in Use
```
Error: listen EADDRINUSE :::3001
```
- Change PORT in `.env` file
- Or kill existing process: `lsof -ti:3001 | xargs kill -9`

---

## 📄 License

This project is licensed under the **MIT License**. See the LICENSE file for details.

---

## 👤 Author

Created as a full-stack demonstration project.

---

## 📞 Support

For issues, questions, or feedback:
- Open a GitHub Issue
- Check existing documentation
- Review test files for usage examples

---

**Made with ❤️ for subscription management**
