
const BASE_URL = 'http://localhost:3000/api/v1';

async function analyze() {
    console.log('--- Analyze Flaws ---');
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
    await sleep(1000); // Wait for server warmup if needed

    // Helper for requests
    const post = async (path: string, body: any) => {
        const res = await fetch(`${BASE_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return res;
    };

    // 1. Empty User Name
    console.log('\n[1] Testing Empty User Name...');
    const now = new Date();
    const start1 = new Date(now.getTime() + 10000000).toISOString();
    const end1 = new Date(now.getTime() + 11000000).toISOString();

    const res1 = await post('/bookings', {
        roomId: 'neukkari-1',
        user: '', // Empty string
        startTime: start1,
        endTime: end1
    });
    console.log(`Status (Empty User): ${res1.status}`);
    if (res1.status === 201) {
        console.log('XXX FLAW FOUND: Created booking with empty username');
        // Cleanup
        const b = await res1.json();
        await fetch(`${BASE_URL}/bookings/${b.id}`, { method: 'DELETE' });
    } else {
        console.log('OK: Rejected empty user');
    }

    // 2. Idempotent Delete
    console.log('\n[2] Testing Idempotent Delete...');
    // Create a dummy booking first
    const res2 = await post('/bookings', {
        roomId: 'neukkari-1',
        user: 'DeleteMe',
        startTime: start1,
        endTime: end1
    });
    const booking2 = await res2.json();
    if (res2.status === 201) {
        // Delete once
        const del1 = await fetch(`${BASE_URL}/bookings/${booking2.id}`, { method: 'DELETE' });
        console.log(`Delete 1 Status: ${del1.status}`);

        // Delete twice
        const del2 = await fetch(`${BASE_URL}/bookings/${booking2.id}`, { method: 'DELETE' });
        console.log(`Delete 2 Status: ${del2.status}`);

        if (del2.status === 404) {
            console.log('XXX FLAW FOUND: Delete is NOT idempotent (returns 404 on second attempt instead of 200/204)');
        } else if (del2.status === 204 || del2.status === 200) {
            console.log('OK: Delete is idempotent');
        } else {
            console.log(`Unknown status: ${del2.status}`);
        }
    }

    // 3. Past Booking
    console.log('\n[3] Testing Past Booking...');
    const pastStart = new Date(now.getTime() - 10000000).toISOString();
    const pastEnd = new Date(now.getTime() - 9000000).toISOString();
    const res3 = await post('/bookings', {
        roomId: 'neukkari-1',
        user: 'Marty McFly',
        startTime: pastStart,
        endTime: pastEnd
    });
    console.log(`Status (Past Booking): ${res3.status}`);
    if (res3.status === 201) {
        console.log('XXX FLAW FOUND: Allowed booking in the past');
    } else {
        const json = await res3.json();
        console.log('OK: Rejected past booking', JSON.stringify(json));
    }

    // 4. Non-existent Room
    console.log('\n[4] Testing Non-existent Room...');
    const res4 = await post('/bookings', {
        roomId: 'room-666',
        user: 'Satan',
        startTime: start1,
        endTime: end1
    });
    console.log(`Status (Bad Room): ${res4.status}`);
    if (res4.status === 201) {
        console.log('XXX FLAW FOUND: Created booking for non-existent room');
    } else if (res4.status === 404) {
        console.log('OK: Correctly returned 404');
    } else {
        console.log(`Unexpected status: ${res4.status}`);
    }

    // 5. Zero Duration (Start == End)
    console.log('\n[5] Testing Zero Duration...');
    const res5 = await post('/bookings', {
        roomId: 'neukkari-1',
        user: 'Quick',
        startTime: start1,
        endTime: start1
    });
    console.log(`Status (Zero Duration): ${res5.status}`);
    if (res5.status === 201) {
        console.log('XXX FLAW FOUND: Created booking with zero duration');
    } else {
        console.log('OK: Rejected zero duration');
    }

    console.log('--- Analysis Complete ---');
}

analyze().catch(console.error);
