import fs from 'fs';

async function testUpload() {
    const rawForm = new FormData();
    // I don't have the user's persona ID or Auth token. 
    // Wait, testing it remotely without auth is going to fail with Unauthorized.
    // I can't hit the real production API without the user's session cookie.
}

testUpload();
