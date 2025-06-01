
import { Calendar, Plus, Zap, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QuickRequestCardProps {
  onNewRequest: () => void;
}

const QuickRequestCard = ({ onNewRequest }: QuickRequestCardProps) => {
  const suggestions = [
    { label: "Vendredi 27 Déc", type: "Pont de Noël", popular: true },
    { label: "Lundi 6 Jan", type: "Après fêtes", popular: false },
    { label: "14-18 Fév", type: "Vacances scolaires", popular: true },
  ];

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
      
      <CardContent className="p-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-yellow-300" />
              <h2 className="text-2xl font-bold">Demande express</h2>
            </div>
            <p className="text-blue-100 text-lg">
              Créez votre demande en 30 secondes avec notre assistant intelligent
            </p>
            
            <div className="flex items-center space-x-2 text-blue-100">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Temps moyen : 28 secondes</span>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={onNewRequest}
              size="lg"
              className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold py-4 text-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouvelle demande
            </Button>

            {/* Suggestions intelligentes */}
            <div className="space-y-2">
              <div className="flex items-center text-blue-200 text-sm">
                <Users className="h-3 w-3 mr-1" />
                Suggestions populaires
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="border-blue-300 text-blue-100 hover:bg-blue-600 cursor-pointer transition-colors"
                  >
                    {suggestion.label}
                    {suggestion.popular && <span className="ml-1">🔥</span>}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickRequestCard;
