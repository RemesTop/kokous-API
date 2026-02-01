
// using global fetch (Node 18+)

// If Node version < 18, this might fail without a polyfill, but assuming recent Node.
// Actually, I'll use `http` module to be safe and dependency-free, or just `fetch` assuming Node 18+. 
// User said Node LTS, which is > 18. So `fetch` global is available.

const BASE_URL = 'http://localhost:3000/api/v1';

async function verify() {
    console.log('--- Starting Verification ---');

    // Helper to wait
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
    // Wait for server to start
    await sleep(2000);

    // 1. List Bookings (Empty)
    console.log('\n[1] Listing bookings for neukkari-1...');
    const res1 = await fetch(`${BASE_URL}/rooms/neukkari-1/bookings`);
    const bookings1 = await res1.json();
    console.log('Status:', res1.status);
    console.log('Bookings:', bookings1.length);
    if (bookings1.length !== 0) throw new Error('Expected 0 bookings');

    // Dates
    const now = new Date();
    const start1 = new Date(now.getTime() + 3600000).toISOString(); // +1 hour
    const end1 = new Date(now.getTime() + 7200000).toISOString();   // +2 hours

    const startOver = new Date(now.getTime() + 5400000).toISOString(); // +1.5 hours
    const endOver = new Date(now.getTime() + 9000000).toISOString();   // +2.5 hours

    const start2 = new Date(now.getTime() + 7200000).toISOString(); // +2 hours (adjacent)
    const end2 = new Date(now.getTime() + 10800000).toISOString();  // +3 hours

    // 2. Create Booking 1
    console.log('\n[2] Creating Valid Booking (Alice)...');
    const res2 = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            roomId: 'neukkari-1',
            user: 'Alice',
            startTime: start1,
            endTime: end1
        })
    });
    const booking1 = await res2.json();
    console.log('Status:', res2.status);
    if (res2.status !== 201) throw new Error('Failed to create booking');
    console.log('Booking ID:', booking1.id);

    // 3. Create Overlapping Booking
    console.log('\n[3] Creating Overlapping Booking (Bob)...');
    const res3 = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            roomId: 'neukkari-1',
            user: 'Bob',
            startTime: startOver,
            endTime: endOver
        })
    });
    console.log('Status:', res3.status);
    if (res3.status !== 409) {
        const err = await res3.json();
        console.log(err);
        throw new Error('Expected 409 Conflict');
    } else {
        console.log('Correctly rejected logic.');
    }

    // 4. Create Adjacent Booking
    console.log('\n[4] Creating Adjacent Booking (Charlie)...');
    const res4 = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            roomId: 'neukkari-1',
            user: 'Charlie',
            startTime: start2,
            endTime: end2
        })
    });
    console.log('Status:', res4.status);
    if (res4.status !== 201) throw new Error('Failed to create adjacent booking');

    // 5. Cancel Booking 1
    console.log('\n[5] Cancelling Alice\'s booking...');
    const res5 = await fetch(`${BASE_URL}/bookings/${booking1.id}`, { method: 'DELETE' });
    console.log('Status:', res5.status);
    if (res5.status !== 204) throw new Error('Failed to cancel booking');

    // 6. List Bookings (Should leave Charlie)
    console.log('\n[6] Listing bookings again...');
    const res6 = await fetch(`${BASE_URL}/rooms/neukkari-1/bookings`);
    const bookings6 = await res6.json();
    console.log('Bookings:', bookings6.length);
    if (bookings6.length !== 1) throw new Error('Expected 1 booking');
    if (bookings6[0].user !== 'Charlie') throw new Error('Expected Charlie remaining');

    console.log('\n--- VERIFICATION SUCCESSFUL ---');
}

verify().catch(e => {
    console.error(e);
    process.exit(1);
});
