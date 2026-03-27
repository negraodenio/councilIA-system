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
        // Optimize for high-DPI capture
        const canvas = await html2canvas(element, {
            scale: 2, // Retained quality
            useCORS: true,
            backgroundColor: '#050810', // Match Command Center theme
            logging: false,
            windowWidth: 794, // Fixed A4 width in px for consistent layout
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Add to PDF
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        
        // Finalize
        pdf.save(filename);
        
    } catch (error) {
        console.error('[PDF Export] Failed to generate report:', error);
        throw error;
    }
}
