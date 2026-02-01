import { BookingsRepository } from '../repositories/bookings.repository';
import { RoomsRepository } from '../repositories/rooms.repository';
import { CreateBookingDTO, Booking } from '../schemas/booking.schema';

export class BookingsService {
    private bookingsRepo: BookingsRepository;
    private roomsRepo: RoomsRepository;

    constructor() {
        this.bookingsRepo = new BookingsRepository();
        this.roomsRepo = new RoomsRepository();
    }

    createBooking(data: CreateBookingDTO): Booking {
        // 1. Check if room exists
        const room = this.roomsRepo.findById(data.roomId);
        if (!room) {
            throw new Error(`Room with ID ${data.roomId} not found`);
        }

        // 2. Check for overlaps
        const overlaps = this.bookingsRepo.findOverlapping(
            data.roomId,
            data.startTime,
            data.endTime
        );

        if (overlaps.length > 0) {
            throw new Error('Booking overlaps with an existing booking');
        }

        // 3. Create booking
        return this.bookingsRepo.create(data);
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
