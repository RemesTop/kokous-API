import { Request, Response } from 'express';
import { BookingsService } from '../services/bookings.service';
import { CreateBookingSchema } from '../schemas/booking.schema';
import { z } from 'zod';

const bookingService = new BookingsService();

export class BookingsController {
    static create(req: Request, res: Response) {
        try {
            // Validate schema
            const data = CreateBookingSchema.parse(req.body);

            // Call service
            const booking = bookingService.createBooking(data);
            res.status(201).json(booking);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ error: 'Validation Error', details: error.errors });
            } else if (error.message.includes('not found')) {
                res.status(404).json({ error: error.message });
            } else if (error.message.includes('overlaps')) {
                res.status(409).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal Server Error', details: error.message });
            }
        }
    }

    static list(req: Request, res: Response) {
        try {
            const { id } = req.params; // Room ID
            const bookings = bookingService.getBookingsForRoom(id);
            res.json(bookings);
        } catch (error: any) {
            if (error.message.includes('not found')) {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }

    static cancel(req: Request, res: Response) {
        try {
            const { id } = req.params;
            bookingService.cancelBooking(id);
            res.status(204).send();
        } catch (error: any) {
            if (error.message.includes('not found')) {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }
}
