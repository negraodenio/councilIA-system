import fetch from 'node-fetch';

async function testEmbed() {
    console.log("Testing Mistral API...");
    const r = await fetch('https://api.mistral.ai/v1/embeddings', {
        method: 'POST',
        headers: {
            Authorization: `Bearer tqxzNxOBYJY0hEfwg0gjxOP1Zs6ivQlz`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'mistral-embed',
            input: ["Apenas um teste rápido para ver limites da api da mistral.", "Segundo chunk só para teste."]
        })
    });

    if (!r.ok) {
        const err = await r.text();
        console.error(`Mistral Failed: ${r.status} - ${err}`);
        return;
    }

    const data = await r.json();
    console.log("Success! Embedded", data.data.length, "chunks");
}

testEmbed();
