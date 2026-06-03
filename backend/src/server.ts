import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth';
import studentRoutes from './routes/student';
import internshipRoutes from './routes/internship';
import applicationRoutes from './routes/application';
import adminRoutes from './routes/admin';
import notificationRoutes from './routes/notification';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Start server
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API ready at http://localhost:${PORT}/api`);
  });
};

start();
export default app;
