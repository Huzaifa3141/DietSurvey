import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import participantRoutes from './routes/participants';
import surveyRoutes from './routes/surveys';
import responseRoutes from './routes/responses';
import analysisRoutes from './routes/analysis';
import advisoryRoutes from './routes/advisory';
import authRoutes from './routes/auth';
import surveySubmissionRoutes from './routes/survey';
import { errorHandler } from './middleware/errorHandler';
import { validateToken } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Prisma
export const prisma = new PrismaClient();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/advisory', advisoryRoutes);
app.use('/api/survey', surveySubmissionRoutes);

// Protected routes (require authentication)
app.use('/api/admin', validateToken, (req, res) => {
  res.json({ message: 'Admin access granted' });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Database connected successfully`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
});

export default app;
