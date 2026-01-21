import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/auth';
import tradeRoutes from './routes/trades';
import capitalsRoutes from './routes/capitals';
import analyticsRoutes from './routes/analytics';
import newsRoutes from './routes/news';
import { setupCronJobs } from './jobs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected'
    });
});

// API routes
app.get('/api', (req, res) => {
    res.json({ message: 'Trade Management API v1.0' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/capitals', capitalsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/news', newsRoutes);

// Start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Setup cronjobs
        setupCronJobs();

        // Start Express server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
            console.log(`🔐 Auth routes: http://localhost:${PORT}/api/auth`);
            console.log(`💼 Trade routes: http://localhost:${PORT}/api/trades`);
            console.log(`💰 Capital routes: http://localhost:${PORT}/api/capitals`);
            console.log(`📈 Analytics routes: http://localhost:${PORT}/api/analytics`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export default app;
