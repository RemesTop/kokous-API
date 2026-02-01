import express, { Request, Response, NextFunction } from 'express';
import apiRouter from './routes/api.routes';
import { initDatabase } from './config/database';
import { seed } from './scripts/seed';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = '/api/v1';

// Middleware
app.use(express.json());
// logger middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });

    next();
});

// Routes
app.use(API_VERSION, apiRouter);

// Error handler
app.use(errorHandler);

// Initialize DB and Seed
try {
    initDatabase();
    console.log('Database initialized successfully');
    seed(); // Auto-seed for MVP simplicity
} catch (error) {
    console.error('Failed to initialize database:', error);
}

// Start Server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
