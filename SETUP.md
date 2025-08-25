# DietSurvey Platform - Setup Guide

This guide will help you set up and run the DietSurvey platform on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

## Quick Start

### 1. Install Dependencies

Run the following command from the project root to install all dependencies:

```bash
npm run install-all
```

This will install dependencies for:
- Root project
- Backend server
- Frontend client

### 2. Database Setup

Navigate to the server directory and set up the database:

```bash
cd server

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### 3. Start the Application

From the project root, start both the backend and frontend:

```bash
npm run dev
```

This will start:
- **Backend server** on http://localhost:5000
- **Frontend client** on http://localhost:3000

## Manual Setup (Alternative)

If you prefer to set up each part separately:

### Backend Setup

```bash
cd server

# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database
npm run db:seed

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start development server
npm start
```

## Database Management

### Prisma Studio

To view and manage your database through a web interface:

```bash
cd server
npm run db:studio
```

This will open Prisma Studio at http://localhost:5555

### Database Reset

To reset the database and start fresh:

```bash
cd server

# Delete the database file
rm prisma/dev.db

# Run migrations again
npm run db:migrate

# Seed with sample data
npm run db:seed
```

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the server directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret (change in production)
JWT_SECRET="your-secret-key-change-in-production"

# Server Port
PORT=5000

# Environment
NODE_ENV="development"
```

### Frontend Configuration

The frontend is configured to proxy API requests to the backend. This is set in `client/package.json`:

```json
"proxy": "http://localhost:5000"
```

## Project Structure

```
DietSurvey/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── index.tsx      # Entry point
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind CSS config
├── server/                 # Node.js backend
│   ├── src/               # Source code
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── index.ts       # Server entry point
│   ├── prisma/            # Database schema
│   ├── package.json       # Backend dependencies
│   └── tsconfig.json      # TypeScript config
├── package.json           # Root package.json
├── README.md              # Project overview
└── SETUP.md              # This file
```

## Available Scripts

### Root Level
- `npm run install-all` - Install all dependencies
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build frontend for production
- `npm start` - Start production server

### Backend (server/)
- `npm run dev` - Start development server
- `npm run build` - Build TypeScript
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

### Frontend (client/)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Features

### ✅ Implemented
- User authentication (login/register)
- Participant management
- Survey creation and management
- Response collection
- Basic dashboard
- Responsive design
- Database schema and API endpoints

### 🚧 Coming Soon
- Advanced data visualization
- Chart components
- Report generation
- Health advisory system
- Data export functionality
- Survey form builder

## Demo Credentials

For testing purposes, you can use these demo credentials:

**Email:** Any valid email format (e.g., `test@example.com`)
**Password:** `password123`

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the port in server/.env or kill the process using the port

2. **Database connection errors**
   - Make sure you've run `npm run db:generate` and `npm run db:migrate`
   - Check that the database file exists in server/prisma/

3. **Frontend not connecting to backend**
   - Verify the backend is running on port 5000
   - Check the proxy setting in client/package.json

4. **Prisma errors**
   - Run `npm run db:generate` to regenerate the Prisma client
   - Make sure your database schema is up to date with `npm run db:migrate`

### Getting Help

If you encounter issues:

1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure the database is properly set up
4. Check that both servers are running

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Use a production database (PostgreSQL, MySQL)
3. Set a strong JWT_SECRET
4. Build the frontend: `npm run build`
5. Use a process manager like PM2 for the backend
6. Set up proper CORS origins
7. Use HTTPS in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

**Happy Surveying! 🎉**

For more information, check out the main [README.md](README.md) file.
