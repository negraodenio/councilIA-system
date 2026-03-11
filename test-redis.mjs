import fetch from 'node-fetch';

async function testRedis() {
    console.log("Testing Upstash Redis API...");
    const url = "https://alert-flamingo-8739.upstash.io";
    const token = "ASIjAAImcDFmZmYwZTM1ODJkNDI0NDhhYTA4NjAzMTNhNDkwOTg5OHAxODczOQ";

    const r = await fetch(`${url}/get/test_key`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!r.ok) {
        const err = await r.text();
        console.error(`Upstash Failed: ${r.status} - ${err}`);
        return;
    }

    const data = await r.json();
    console.log("Success! Redis replied:", data);
}

testRedis();
