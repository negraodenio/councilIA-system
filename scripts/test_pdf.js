const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

async function test() {
    const filePath = 'embrapa/1.3.6.7.2. Critical Values of the Student_s-t Distribution.pdf';
    console.log(`Testing PDF parse on: ${filePath}`);
    try {
        const buffer = fs.readFileSync(filePath);
        console.log(`Buffer size: ${buffer.length} bytes`);
        const { PDFParse } = require('pdf-parse');
        const parser = new PDFParse({ data: buffer });
        const data = await parser.getText();
        console.log('PDF Data keys:', Object.keys(data));
        console.log('Text length:', data.text ? data.text.length : 'N/A');
        await parser.destroy();
    } catch (err) {
        console.error('PDF Parse Error:', err);
    }
}

test();
