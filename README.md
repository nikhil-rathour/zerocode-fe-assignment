# Next.js Chat Application

A modern real-time chat application built with Next.js, featuring authentication, real-time messaging, and a beautiful UI with animated backgrounds.

## 🚀 Features

- 🔐 Secure Authentication System
- 💬 Real-time Chat Functionality
- 🎨 Modern UI with Animated Backgrounds
- 📱 Responsive Design
- 🔒 Protected Routes
- 🎯 TypeScript Support
- 🎨 Tailwind CSS Styling

## 🏗️ Architecture

```
src/
├── app/                 # App router pages and layouts
├── components/          # Reusable React components
│   ├── Chat/           # Chat-related components
│   └── Navbar/         # Navigation components
├── lib/                # Utility functions and shared logic
├── pages/              # Page components
└── middleware.ts       # Authentication middleware
```

## 🛠️ Tech Stack

- **Frontend Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Prisma ORM
- **Authentication:** JWT (JSON Web Tokens)
- **3D Graphics:** Three.js, React Three Fiber
- **Animation:** Custom CSS animations

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zerocode-fe-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   JWT_SECRET="your-jwt-secret"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run database migrations
   npm run prisma:migrate
   
   # Seed the database (if needed)
   npm run prisma:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The application will be available at `http://localhost:3000`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed the database

## 🔒 Authentication Flow

1. User signs up/logs in
2. JWT token is generated and stored in cookies
3. Middleware validates token for protected routes
4. Session is maintained across page refreshes

## 🎨 UI Components

- **Navbar:** Responsive navigation bar with user authentication status
- **ChatBox:** Real-time chat interface with message history
- **Animated Background:** Beautiful gradient animations using Three.js

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

## 🔧 Development

1. **Code Style**
   - Follow TypeScript best practices
   - Use ESLint for code linting
   - Follow component-based architecture

2. **Git Workflow**
   - Create feature branches
   - Write meaningful commit messages
   - Submit PRs for review

## 📦 Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
