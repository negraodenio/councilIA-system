import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * PDF Export Utility v9.2
 * Orchestrates the hidden rendering and capture of the Strategic Report.
 */
export async function exportToPDF(elementId: string, filename: string = 'CouncilIA_Executive_Report.pdf') {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`[PDF Export] Element #${elementId} not found.`);
        return;
    }

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#050810',
            logging: false,
            windowWidth: 794,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvasHeight * pdfWidth) / canvasWidth;
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        let heightLeft = pdfHeight;
        let position = 0;

        // Page 1
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;

        // Additional Pages
        while (heightLeft >= 0) {
            position = heightLeft - pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(filename);
    } catch (error) {
        console.error('[PDF Export] Failed to generate report:', error);
        throw error;
    }
}
