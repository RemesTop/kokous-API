import { Request, Response, NextFunction } from 'express';
import { BookingsService } from '../services/bookings.service';
import { CreateBookingSchema } from '../schemas/booking.schema';

const bookingService = new BookingsService();

export class BookingsController {
    static create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = CreateBookingSchema.parse(req.body);
            const booking = bookingService.createBooking(data);
            res.status(201).json(booking);
        } catch (error) {
            next(error); // Välitetään keskitetylle virheenkäsittelijälle
        }
    }

    static list(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const bookings = bookingService.getBookingsForRoom(id);
            res.json(bookings);
        } catch (error) {
            next(error);
        }
    }

    static cancel(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            bookingService.cancelBooking(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
