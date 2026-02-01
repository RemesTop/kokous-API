import { BookingsRepository } from '../repositories/bookings.repository';
import { RoomsRepository } from '../repositories/rooms.repository';
import { CreateBookingDTO, Booking } from '../schemas/booking.schema';
import db from '../config/database';
import { NotFoundError, ConflictError } from '../errors/AppError';

export class BookingsService {
    private bookingsRepo: BookingsRepository;
    private roomsRepo: RoomsRepository;

    constructor() {
        this.bookingsRepo = new BookingsRepository();
        this.roomsRepo = new RoomsRepository();
    }

    createBooking(data: CreateBookingDTO): Booking {
        const runTransaction = db.transaction(() => {

            // Check if room exists
            const room = this.roomsRepo.findById(data.roomId);
            if (!room) {
                throw new NotFoundError(`Room with ID ${data.roomId} not found`);
            }

            // Check for overlaps
            const overlaps = this.bookingsRepo.findOverlapping(
                data.roomId,
                data.startTime,
                data.endTime
            );

            if (overlaps.length > 0) {
                throw new ConflictError('Booking overlaps with an existing booking');
            }

            // Create booking
            return this.bookingsRepo.create(data);
        });
        return runTransaction();
    }

    getBookingsForRoom(roomId: string): Booking[] {
        const room = this.roomsRepo.findById(roomId);
        if (!room) {
            throw new Error(`Room with ID ${roomId} not found`);
        }
        return this.bookingsRepo.findByRoomId(roomId);
    }

    cancelBooking(id: string): boolean {
        return this.bookingsRepo.delete(id);
    }
}
