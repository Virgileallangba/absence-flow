import { useState, useEffect } from "react";
import { Calendar, X, Clock, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentUploader from "./DocumentUploader";
import { absenceService } from "@/services/absenceService";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/services/authService";

interface RequestModalProps {
  onClose: () => void;
}

interface DocumentData {
  dates: string[];
  reason: string;
  doctorName?: string;
}

const RequestModal = ({ onClose }: RequestModalProps) => {
  const { toast } = useToast();
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [hasDocument, setHasDocument] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const session = await authService.getCurrentSession();
      setCurrentUserId(session?.user?.id || null);
    };
    fetchUserId();
  }, []);

  const leaveTypes = [
    { value: "CP", label: "Congés payés", available: 25 },
    { value: "RTT", label: "RTT", available: 10 },
    { value: "Maladie", label: "Maladie", available: "Illimité" },
    { value: "Autre", label: "Autre", available: "Sur demande" }
  ];

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUserId) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la demande: ID utilisateur non disponible.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const absence = await absenceService.createAbsence({
        employee_id: currentUserId,
        start_date: startDate,
        end_date: endDate,
        type: leaveType as "CP" | "RTT" | "Maladie" | "Autre",
        status: "pending",
        reason: reason || undefined
      });

      toast({
        title: "Demande créée",
        description: "Votre demande d'absence a été enregistrée avec succès.",
      });

    onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la demande.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentData = (data: DocumentData) => {
    console.log("Document data extracted:", data);
    setHasDocument(true);
    
    if (data.dates.length >= 2) {
      const sortedDates = data.dates.sort();
      setStartDate(sortedDates[0]);
      setEndDate(sortedDates[sortedDates.length - 1]);
    }
    
    if (data.reason && data.reason !== 'Arrêt maladie') {
      setReason(data.reason);
    }
    
    if (data.doctorName || data.reason.toLowerCase().includes('médical') || 
        data.reason.toLowerCase().includes('maladie')) {
      setLeaveType('Maladie');
    }
  };

  const isMedicalLeave = leaveType === 'Maladie';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Nouvelle demande d'absence
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Saisie manuelle
              </TabsTrigger>
              <TabsTrigger value="document" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Avec justificatif
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="leave-type">Type d'absence</Label>
                  <Select value={leaveType} onValueChange={setLeaveType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le type" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center justify-between w-full">
                            <span>{type.label}</span>
                            <Badge variant="outline" className="ml-2">
                              {type.available} jours
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Date de début</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">Date de fin</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {startDate && endDate && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center text-blue-800">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="font-medium">
                        Durée: {calculateDays()} jour{calculateDays() > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="reason">Motif (optionnel)</Label>
                  <Textarea
                    id="reason"
                    placeholder="Décrivez brièvement le motif de votre absence..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    disabled={!leaveType || !startDate || !endDate || !currentUserId}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Envoyer la demande
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="document">
              <div className="space-y-6">
                <DocumentUploader onDataExtracted={handleDocumentData} />

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="leave-type-doc">Type d'absence</Label>
                    <Select value={leaveType} onValueChange={setLeaveType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le type" />
                      </SelectTrigger>
                      <SelectContent>
                        {leaveTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center justify-between w-full">
                              <span>{type.label}</span>
                              <Badge variant="outline" className="ml-2">
                                {type.available} jours
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date-doc">Date de début</Label>
                      <Input
                        id="start-date-doc"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date-doc">Date de fin</Label>
                      <Input
                        id="end-date-doc"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {startDate && endDate && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center text-blue-800">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="font-medium">
                          Durée: {calculateDays()} jour{calculateDays() > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="reason-doc">Motif</Label>
                    <Textarea
                      id="reason-doc"
                      placeholder="Motif extrait automatiquement ou saisie manuelle..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {hasDocument && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center text-green-800">
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="font-medium">Justificatif traité automatiquement</span>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      disabled={!leaveType || !startDate || !endDate || !currentUserId}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Envoyer la demande
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestModal;
