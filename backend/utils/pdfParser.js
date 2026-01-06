import fs from 'fs';
import PDFParser from 'pdf2json';

const parsePDF = (filePath) => {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1); 

        pdfParser.on("pdfParser_dataError", (errData) => {
            console.error("PDF Parser Error:", errData.parserError);
            reject(new Error(errData.parserError));
        });

        pdfParser.on("pdfParser_dataReady", (pdfData) => {
            try {
                let text = "";
                
                pdfData.Pages.forEach((page) => {
                    page.Texts.forEach((textLine) => {
                        textLine.R.forEach((r) => {
                          
                            try {
                                text += decodeURIComponent(r.T) + " ";
                            } catch (e) {
                                
                                text += r.T + " ";
                            }
                        });
                    });
                    text += "\n"; 
                });

                if (!text.trim()) {
                    try {
                        text = pdfParser.getRawTextContent();
                    } catch (e) {
                        text = "Extraction failed. PDF may be image-only or encrypted.";
                    }
                }

                resolve(text);
            } catch (err) {
                reject(err);
            }
        });

        pdfParser.loadPDF(filePath);
    });
};

export default parsePDF;