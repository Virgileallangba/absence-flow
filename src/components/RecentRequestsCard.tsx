
import { Calendar, Clock, Edit, X, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Request {
  date: string;
  type: string;
  days: number;
  status: "approved" | "pending" | "rejected";
  canModify: boolean;
  progress: number;
}

interface RecentRequestsCardProps {
  requests: Request[];
}

const RecentRequestsCard = ({ requests }: RecentRequestsCardProps) => {
  const getStatusIcon = (status: string, progress: number) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Loader className="h-4 w-4 text-yellow-600 animate-spin" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approuvé</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En attente</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Refusé</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Mes demandes récentes
          </div>
          <Button variant="ghost" size="sm" className="text-gray-500">
            Voir tout
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request, index) => (
            <div 
              key={index} 
              className={cn(
                "group relative p-4 bg-gray-50 rounded-lg border-l-4 transition-all duration-200 hover:shadow-sm hover:bg-gray-100",
                request.status === "approved" && "border-l-green-500",
                request.status === "pending" && "border-l-yellow-500",
                request.status === "rejected" && "border-l-red-500"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(request.status, request.progress)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{request.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">{request.type}</Badge>
                        <span className="text-sm text-gray-600">
                          {request.days} jour{request.days > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(request.status)}
                  
                  {/* Actions rapides */}
                  {request.canModify && (
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Barre de progression pour les demandes en attente */}
              {request.status === "pending" && (
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Progression de la validation</span>
                    <span>{request.progress}%</span>
                  </div>
                  <Progress value={request.progress} className="h-1" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentRequestsCard;
