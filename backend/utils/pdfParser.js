import fs from 'fs';
import PDFParser from 'pdf2json';

const parsePDF = (filePath) => {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(this, 1); // 1 means text content only

        pdfParser.on("pdfParser_dataError", (errData) => {
            console.error("PDF Parser Error:", errData.parserError);
            reject(new Error(errData.parserError));
        });

        pdfParser.on("pdfParser_dataReady", (pdfData) => {
            try {
                // Extract text from the raw data
                const text = pdfParser.getRawTextContent();
                resolve(text);
            } catch (err) {
                reject(err);
            }
        });

        // Load the file
        pdfParser.loadPDF(filePath);
    });
};

export default parsePDF;