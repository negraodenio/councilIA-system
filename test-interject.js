async function test() {
    console.log("Testing POST to https://councilia.com/api/session/interject");
    try {
        const r = await fetch('https://councilia.com/api/session/interject', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ runId: 'test-run-id', message: 'test message' })
        });

        console.log("Status:", r.status);
        const text = await r.text();
        console.log("Response:", text);
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}
test();
