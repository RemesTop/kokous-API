
const BASE_URL = 'http://localhost:3000/api/v1';

async function verifyEmptyUser() {
    const now = new Date();
    const start = new Date(now.getTime() + 10000000).toISOString();
    const end = new Date(now.getTime() + 11000000).toISOString();

    try {
        const res = await fetch(`${BASE_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                roomId: 'neukkari-1',
                user: '',
                startTime: start,
                endTime: end
            })
        });

        console.log(`Status: ${res.status}`);
        if (res.status === 201) {
            const b = await res.json();
            console.log('Result: Created booking with empty user. ID:', b.id);
            // clean up
            await fetch(`${BASE_URL}/bookings/${b.id}`, { method: 'DELETE' });
        } else {
            const err = await res.json();
            console.log('Result: Rejected.', err);
        }
    } catch (e) {
        console.error(e);
    }
}

verifyEmptyUser();
