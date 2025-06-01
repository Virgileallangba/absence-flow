
import Tesseract from 'tesseract.js';

interface ExtractedData {
  dates: string[];
  reason: string;
  doctorName: string;
  confidence: number;
}

export class OCRService {
  static async processDocument(file: File): Promise<ExtractedData> {
    try {
      console.log('Processing document with OCR...');
      
      const { data: { text, confidence } } = await Tesseract.recognize(file, 'fra', {
        logger: m => console.log(m)
      });

      console.log('OCR text extracted:', text);
      
      return this.extractMedicalData(text, confidence);
    } catch (error) {
      console.error('OCR processing failed:', error);
      throw new Error('Échec du traitement OCR');
    }
  }

  private static extractMedicalData(text: string, confidence: number): ExtractedData {
    const cleanText = text.toLowerCase();
    
    // Extract dates (various formats)
    const datePatterns = [
      /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/g,
      /(\d{1,2}\s+\w+\s+\d{2,4})/g,
      /du\s+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\s+au\s+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/g
    ];
    
    const dates: string[] = [];
    datePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        dates.push(...matches);
      }
    });

    // Extract reason/diagnosis
    const reasonKeywords = [
      'diagnostic', 'pathologie', 'maladie', 'syndrome', 'infection',
      'grippe', 'gastro', 'bronchite', 'angine', 'covid', 'repos',
      'arrêt', 'incapacité', 'traitement'
    ];
    
    let reason = 'Arrêt maladie';
    for (const keyword of reasonKeywords) {
      if (cleanText.includes(keyword)) {
        const sentences = text.split(/[.!?]/);
        const relevantSentence = sentences.find(s => 
          s.toLowerCase().includes(keyword)
        );
        if (relevantSentence) {
          reason = relevantSentence.trim();
          break;
        }
      }
    }

    // Extract doctor name
    const doctorPatterns = [
      /dr\.?\s+([a-zA-ZÀ-ÿ\s]+)/i,
      /docteur\s+([a-zA-ZÀ-ÿ\s]+)/i,
      /médecin\s+([a-zA-ZÀ-ÿ\s]+)/i
    ];
    
    let doctorName = '';
    for (const pattern of doctorPatterns) {
      const match = text.match(pattern);
      if (match) {
        doctorName = match[1].trim();
        break;
      }
    }

    return {
      dates: [...new Set(dates)], // Remove duplicates
      reason: reason.length > 100 ? reason.substring(0, 100) + '...' : reason,
      doctorName,
      confidence
    };
  }
}
