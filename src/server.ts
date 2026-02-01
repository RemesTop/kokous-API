import express from 'express';
import bookingsRouter from './routes/bookings.routes';
import { initDatabase } from './config/database';
import { seed } from './scripts/seed';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1', bookingsRouter);

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
