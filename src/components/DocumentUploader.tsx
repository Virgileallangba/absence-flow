
import { useState, useRef } from "react";
import { Upload, FileText, Check, AlertCircle, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OCRService } from "@/services/ocrService";
import { useToast } from "@/hooks/use-toast";

interface ExtractedData {
  dates: string[];
  reason: string;
  doctorName: string;
  confidence: number;
}

interface DocumentUploaderProps {
  onDataExtracted: (data: ExtractedData) => void;
}

const DocumentUploader = ({ onDataExtracted }: DocumentUploaderProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Format non supporté",
        description: "Veuillez sélectionner une image (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);

    try {
      const data = await OCRService.processDocument(file);
      setExtractedData(data);
      onDataExtracted(data);
      
      toast({
        title: "Document traité avec succès",
        description: `Données extraites avec ${Math.round(data.confidence)}% de confiance`,
      });
    } catch (error) {
      console.error('Document processing failed:', error);
      toast({
        title: "Erreur de traitement",
        description: "Impossible de traiter le document. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const handleDropZoneClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-100 text-green-800";
    if (confidence >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Justificatif automatisé
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Upload Zone */}
        <div className="space-y-4">
          <div 
            onClick={handleDropZoneClick}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
          >
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Glissez votre certificat ici
            </p>
            <p className="text-sm text-gray-500 mb-4">
              ou cliquez pour sélectionner un fichier
            </p>
            <Button variant="outline">
              Choisir un fichier
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-sm text-gray-500">ou</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <Button 
            onClick={handleCameraCapture}
            variant="outline" 
            className="w-full"
          >
            <Camera className="h-4 w-4 mr-2" />
            Prendre une photo
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-lg font-medium">Traitement en cours...</p>
              <p className="text-sm text-gray-600">Extraction des données du document</p>
            </div>
          </div>
        )}

        {/* Extracted Data Display */}
        {extractedData && !isProcessing && (
          <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <Check className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Données extraites automatiquement</span>
              <Badge className={getConfidenceColor(extractedData.confidence)}>
                {Math.round(extractedData.confidence)}% confiance
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Dates détectées</Label>
                <div className="mt-1">
                  {extractedData.dates.length > 0 ? (
                    extractedData.dates.map((date, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                        {date}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">Aucune date détectée</span>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Motif</Label>
                <p className="mt-1 text-sm text-gray-900">{extractedData.reason}</p>
              </div>

              {extractedData.doctorName && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Médecin</Label>
                  <p className="mt-1 text-sm text-gray-900">{extractedData.doctorName}</p>
                </div>
              )}
            </div>

            {extractedData.confidence < 60 && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded border border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Vérification recommandée</p>
                  <p className="text-xs text-yellow-700">
                    La confiance de détection est faible. Veuillez vérifier les données extraites.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;
