import db from '../config/database';
import { Room } from '../schemas/booking.schema';

export class RoomsRepository {
    findById(id: string): Room | undefined {
        return db.prepare('SELECT * FROM rooms WHERE id = ?').get(id) as Room | undefined;
    }

    findAll(): Room[] {
        return db.prepare('SELECT * FROM rooms').all() as Room[];
    }
}
