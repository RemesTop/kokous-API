import db, { initDatabase } from '../config/database';

export function seed() {
    // Initialize tables first to be sure
    initDatabase();

    const existingRooms = db.prepare('SELECT COUNT(*) as count FROM rooms').get() as { count: number };

    if (existingRooms.count === 0) {
        const insert = db.prepare('INSERT INTO rooms (id, name, capacity) VALUES (@id, @name, @capacity)');

        const rooms = [
            { id: 'neukkari-1', name: 'Neukkari 1', capacity: 4 },
            { id: 'neukkari-2', name: 'Neukkari 2', capacity: 8 },
            { id: 'aula', name: 'Aula', capacity: 20 },
        ];

        rooms.forEach(room => insert.run(room));
        console.log('Seeded rooms:', rooms.map(r => r.name).join(', '));
    } else {
        console.log('Database already seeded.');
    }
}

// Allow running directly if executed as a script
if (require.main === module) {
    seed();
}
