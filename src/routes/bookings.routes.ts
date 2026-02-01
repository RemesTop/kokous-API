import { Router } from 'express';
import { BookingsController } from '../controllers/bookings.controller';

const router = Router();

// "List bookings for a specific room" -> GET /api/v1/rooms/:id/bookings
router.get('/rooms/:id/bookings', BookingsController.list);

// "Create a booking" -> POST /api/v1/bookings
router.post('/bookings', BookingsController.create);

// "Cancel a booking" -> DELETE /api/v1/bookings/:id
router.delete('/bookings/:id', BookingsController.cancel);

export default router;
