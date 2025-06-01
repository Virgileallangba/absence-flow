
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Clock, Plane } from "lucide-react";

interface PremiumQuickRequestCardProps {
  onNewRequest: () => void;
}

const PremiumQuickRequestCard = ({ onNewRequest }: PremiumQuickRequestCardProps) => {
  const quickActions = [
    {
      type: "Congés payés",
      icon: Plane,
      color: "bg-blue-500",
      description: "Demande de congés"
    },
    {
      type: "RTT",
      icon: Clock,
      color: "bg-green-500",
      description: "Récupération"
    },
    {
      type: "Maladie",
      icon: Calendar,
      color: "bg-orange-500",
      description: "Arrêt maladie"
    }
  ];

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nouvelle demande
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action) => (
          <Button
            key={action.type}
            variant="outline"
            className="w-full justify-start h-auto p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={onNewRequest}
          >
            <div className={`p-2 rounded-md ${action.color} mr-3`}>
              <action.icon className="h-4 w-4 text-white" />
            </div>
            <div className="text-left">
              <div className="font-medium">{action.type}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {action.description}
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default PremiumQuickRequestCard;
