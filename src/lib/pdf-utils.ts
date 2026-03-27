import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * PDF Export Utility v9.2
 * Orchestrates the hidden rendering and capture of the Strategic Report.
 */
export async function exportToPDF(elementId: string, filename: string = 'CouncilIA_Executive_Report.pdf') {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#050810',
            logging: false,
            windowWidth: 794,
            windowHeight: element.scrollHeight, // Capture full height
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        const imgWidth = pdfWidth;
        const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;
        
        let heightLeft = imgHeight;
        let position = 0;
        let pageCount = 0;

        // Multi-page loop
        while (heightLeft > 0) {
            if (pageCount > 0) {
                pdf.addPage();
            }
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pdfHeight;
            position -= pdfHeight;
            pageCount++;
        }

        pdf.save(filename);
    } catch (error) {
        console.error('[PDF Export] Critical error:', error);
        throw error;
    }
}
