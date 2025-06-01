
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MoreHorizontal, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Request {
  date: string;
  type: string;
  days: number;
  status: "approved" | "pending" | "rejected";
  canModify: boolean;
  progress: number;
}

interface EnhancedRequestHistoryProps {
  requests: Request[];
}

const EnhancedRequestHistory = ({ requests }: EnhancedRequestHistoryProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approuvé";
      case "pending":
        return "En attente";
      case "rejected":
        return "Refusé";
      default:
        return "Inconnu";
    }
  };

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Historique des demandes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {requests.map((request, index) => (
          <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {request.type}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {request.date} • {request.days} jour{request.days > 1 ? 's' : ''}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className={getStatusColor(request.status)}>
                {getStatusText(request.status)}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    Voir les détails
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
        
        <Button variant="outline" className="w-full">
          Voir tout l'historique
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnhancedRequestHistory;
