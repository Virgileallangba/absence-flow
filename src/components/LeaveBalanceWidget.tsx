
import { AlertCircle, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LeaveBalance {
  type: string;
  used: number;
  total: number;
  color: string;
  urgent: boolean;
}

interface LeaveBalanceWidgetProps {
  balance: LeaveBalance;
}

const LeaveBalanceWidget = ({ balance }: LeaveBalanceWidgetProps) => {
  const remaining = balance.total - balance.used;
  const usagePercentage = (balance.used / balance.total) * 100;
  const isLowBalance = remaining <= 2;

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-105",
      balance.urgent && "ring-2 ring-orange-200",
      isLowBalance && "ring-2 ring-red-200"
    )}>
      <div className={cn("absolute top-0 left-0 w-full h-1", balance.color)}></div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
          <div className="flex items-center">
            <div className={cn("w-3 h-3 rounded-full mr-2", balance.color)}></div>
            {balance.type}
          </div>
          {(balance.urgent || isLowBalance) && (
            <AlertCircle className="h-4 w-4 text-orange-500" />
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Affichage principal avec emphase visuelle */}
        <div className="text-center">
          <div className={cn(
            "text-4xl font-bold transition-colors",
            isLowBalance ? "text-red-600" : "text-gray-900"
          )}>
            {remaining}
          </div>
          <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
            <span>jours restants</span>
            {remaining < (balance.total / 4) ? (
              <TrendingDown className="h-3 w-3 text-red-500" />
            ) : (
              <TrendingUp className="h-3 w-3 text-green-500" />
            )}
          </div>
        </div>

        {/* Barre de progression avec gradient */}
        <div className="space-y-2">
          <Progress 
            value={usagePercentage} 
            className={cn(
              "h-3 transition-all duration-300",
              usagePercentage > 80 && "bg-red-100"
            )}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{balance.used} utilisés</span>
            <span>/ {balance.total} total</span>
          </div>
        </div>

        {/* Indicateurs d'alerte */}
        {isLowBalance && (
          <Badge variant="destructive" className="w-full justify-center">
            Solde faible
          </Badge>
        )}
        
        {balance.urgent && !isLowBalance && (
          <Badge variant="outline" className="w-full justify-center border-orange-200 text-orange-700">
            À utiliser avant fin d'année
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaveBalanceWidget;
