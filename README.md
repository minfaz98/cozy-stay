# Cozy Stay - Hotel Reservation System

A modern, full-stack hotel reservation system built with React, Node.js, and Prisma. This application provides a seamless experience for both guests and hotel management.

## 📋 Table of Contents

- [Features](#-features)
- [Detailed Setup Guide](#-detailed-setup-guide)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Technology Stack](#-technology-stack)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)

## 🌟 Features

### Guest Features

- **Room Browsing & Booking**

  - View detailed room information with high-quality images
  - Real-time availability checking
  - Dynamic pricing based on room type and dates
  - Secure online booking with credit card processing
  - Special requests handling
  - Automatic email confirmations

- **Bulk Booking for Travel Companies**

  - Special bulk booking interface for travel companies
  - Tiered discounts based on number of rooms:
    - 30% off for 10+ rooms
    - 20% off for 5-9 rooms
    - 15% off for 3-4 rooms
    - 10% off for 2 rooms

- **Room Types**

  - Single Room: Perfect for solo travelers
  - Double Room: Ideal for couples
  - Family Room: Spacious accommodation for families
  - Deluxe Room: Premium amenities and views
  - Executive Suite: Luxury accommodation with exclusive services

- **User Account Management**
  - Personal dashboard
  - Booking history
  - Profile management
  - Reservation modifications
  - Cancellation handling

### Management Features

- **Admin Dashboard**

  - Room management
  - Reservation tracking
  - User management
  - Revenue analytics
  - Occupancy reports

- **Reservation System**
  - Automatic confirmation for credit card bookings
  - Pending status for non-credit card bookings
  - Automatic cancellation at 7 PM for pending reservations
  - Real-time availability updates

## 📥 Detailed Setup Guide

### Prerequisites Installation

1. **Node.js and npm**

   ```bash
   # Windows: Download and install from https://nodejs.org/

   # macOS (using Homebrew)
   brew install node

   # Linux (Ubuntu/Debian)
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **PostgreSQL Database**

   ```bash
   # Windows: Download and install from https://www.postgresql.org/download/windows/

   # macOS
   brew install postgresql
   brew services start postgresql

   # Linux (Ubuntu/Debian)
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

### Database Setup

1. **Access PostgreSQL**

   ```bash
   # Windows
   psql -U postgres

   # macOS/Linux
   sudo -u postgres psql
   ```

2. **Create Database and User**

   ```sql
   -- Create a new user
   CREATE USER cozy_user WITH PASSWORD 'your_password';

   -- Create the database
   CREATE DATABASE cozy_stay;

   -- Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE cozy_stay TO cozy_user;

   -- Connect to the database
   \c cozy_stay

   -- Grant schema privileges
   GRANT ALL ON SCHEMA public TO cozy_user;
   ```

### Backend Setup

1. **Clone and Navigate**

   ```bash
   git clone https://github.com/yourusername/cozy-stay.git
   cd cozy-stay/hotel-reservation-backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   # Create .env file
   cp .env.example .env

   # Edit .env with your configuration
   PORT=8082
   DATABASE_URL="postgresql://cozy_user:your_password@localhost:5432/cozy_stay"
   JWT_SECRET="your-secure-jwt-secret"
   SMTP_HOST="your-smtp-host"
   SMTP_PORT=587
   SMTP_USER="your-smtp-user"
   SMTP_PASS="your-smtp-password"
   ```

4. **Database Migration and Seeding**

   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # Seed the database
   npx prisma db seed
   ```

5. **Start Backend Server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm run build
   npm start
   ```

### Frontend Setup

1. **Navigate to Frontend Directory**

   ```bash
   cd ../cozy-stay-ai
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   # Create .env file
   cp .env.example .env

   # Edit .env with your configuration
   VITE_API_URL=http://localhost:8082
   ```

4. **Start Frontend Development Server**

   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   npm run preview  # To preview production build
   ```

### Verifying Installation

1. **Check Backend Status**

   - Open http://localhost:8082/health
   - Should return: `{"status": "ok"}`

2. **Check Frontend**

   - Open http://localhost:5173
   - Should see the homepage

3. **Test Admin Access**
   - Login with default admin credentials:
     - Email: admin@cozystay.com
     - Password: admin123

## 🔧 Development Tools

### Database Management

1. **Prisma Studio (Database GUI)**

   ```bash
   cd hotel-reservation-backend
   npx prisma studio
   ```

   Access at http://localhost:5555

2. **Database Reset**
   ```bash
   npx prisma migrate reset  # Resets DB and runs seeds
   ```

### Common Development Commands

**Backend:**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Run linter
```

**Frontend:**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Run linter
```

## 📝 API Documentation

### Core Endpoints

1. **Authentication**

   ```
   POST /api/auth/login
   POST /api/auth/register
   POST /api/auth/logout
   ```

2. **Rooms**

   ```
   GET /api/rooms
   GET /api/rooms/:id
   POST /api/rooms (Admin)
   PUT /api/rooms/:id (Admin)
   DELETE /api/rooms/:id (Admin)
   ```

3. **Reservations**

   ```
   GET /api/reservations
   POST /api/reservations
   GET /api/reservations/:id
   PUT /api/reservations/:id
   DELETE /api/reservations/:id
   ```

4. **Users**
   ```
   GET /api/users/profile
   PUT /api/users/profile
   GET /api/users (Admin)
   PUT /api/users/:id (Admin)
   ```

Complete API documentation is available at http://localhost:8082/api-docs when running in development mode.

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Issues**

   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql

   # Restart PostgreSQL
   sudo systemctl restart postgresql
   ```

2. **Port Conflicts**

   ```bash
   # Check ports in use
   netstat -ano | findstr :8082  # Windows
   lsof -i :8082                 # macOS/Linux
   ```

3. **Prisma Issues**
   ```bash
   # Reset Prisma
   npx prisma generate
   npx prisma migrate reset
   ```

### Error Logs

- Backend logs: `hotel-reservation-backend/logs/`
- Frontend logs: Browser console (F12)

## 🔐 Security Best Practices

1. **Environment Variables**

   - Never commit .env files
   - Use strong passwords
   - Rotate JWT secrets regularly

2. **Database**

   - Regular backups
   - Use connection pooling in production
   - Implement rate limiting

3. **API Security**
   - CORS configuration
   - Input validation
   - Request size limits

## 📱 Deployment

### Production Considerations

1. **Backend**

   ```bash
   # Build
   npm run build

   # Start with PM2
   pm2 start npm --name "cozy-backend" -- start
   ```

2. **Frontend**

   ```bash
   # Build
   npm run build

   # Deploy dist/ folder to your hosting service
   ```

3. **Database**
   - Set up regular backups
   - Configure connection pooling
   - Set up monitoring

## 🔐 Security Features

- JWT authentication
- Password hashing
- CSRF protection
- Rate limiting
- Input validation
- Secure credit card handling

## 💻 Technology Stack

### Frontend

- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Shadcn UI components
- React Router for navigation
- Axios for API requests
- React Query for data fetching
- Date-fns for date manipulation

### Backend

- Node.js with Express
- Prisma ORM
- PostgreSQL database
- JWT for authentication
- Zod for validation
- Nodemailer for emails
- Express Rate Limit
- CORS enabled

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:

- Desktop computers
- Tablets
- Mobile phones

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Shadcn UI for the beautiful components
- The React team for the amazing framework
- The open-source community for their invaluable tools
