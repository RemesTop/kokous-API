/**
 * API Routes
 * Contains all routes for the booking system
 */

import { Router } from 'express';
import { BookingsController } from '../controllers/bookings.controller';

const router = Router();

// Room bookings
router.get('/rooms/:id/bookings', BookingsController.list);

// Bookings
router.post('/bookings', BookingsController.create);
router.delete('/bookings/:id', BookingsController.cancel);

export default router;
