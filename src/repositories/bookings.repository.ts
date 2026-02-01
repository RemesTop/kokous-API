import db from '../config/database';
import { Booking, CreateBookingDTO } from '../schemas/booking.schema';
import { v4 as uuidv4 } from 'uuid';

export class BookingsRepository {
    create(booking: CreateBookingDTO): Booking {
        const id = uuidv4();
        const stmt = db.prepare(`
      INSERT INTO bookings (id, roomId, user, startTime, endTime)
      VALUES (@id, @roomId, @user, @startTime, @endTime)
    `);

        stmt.run({
            id,
            ...booking
        });

        return this.findById(id)!;
    }

    findById(id: string): Booking | undefined {
        return db.prepare('SELECT * FROM bookings WHERE id = ?').get(id) as Booking | undefined;
    }

    findByRoomId(roomId: string): Booking[] {
        return db.prepare('SELECT * FROM bookings WHERE roomId = ? ORDER BY startTime ASC').all(roomId) as Booking[];
    }

    delete(id: string): boolean {
        const info = db.prepare('DELETE FROM bookings WHERE id = ?').run(id);
        return info.changes > 0;
    }

    findOverlapping(roomId: string, startTime: string, endTime: string): Booking[] {
        // Conflict logic: (NewStart < ExistingEnd) AND (NewEnd > ExistingStart)
        return db.prepare(`
      SELECT * FROM bookings 
      WHERE roomId = ? 
      AND startTime < ? 
      AND endTime > ?
    `).all(roomId, endTime, startTime) as Booking[];
    }
}
