
async function test() {
    const url = 'https://raffdev.my.id/api/upload_attendance.php';
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('GET Result:', JSON.stringify(data, null, 2).substring(0, 500));
    } catch (e: any) {
        console.error('GET Error:', e.message);
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ employee_id: 'ENG001', date: '2026-01-14' })
        });
        const data = await response.json();
        console.log('POST Result:', JSON.stringify(data, null, 2).substring(0, 500));
    } catch (e: any) {
        console.error('POST Error:', e.message);
    }
}
test();
