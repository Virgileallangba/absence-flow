
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { CSSProperties } from "react";

export interface PremiumLeaveBalanceCardProps {
  balance: {
    type: string;
    used: number;
    total: number;
    color: string;
    urgent: boolean;
  };
  className?: string;
  style?: CSSProperties;
}

const PremiumLeaveBalanceCard = ({ balance, className, style }: PremiumLeaveBalanceCardProps) => {
  const remaining = balance.total - balance.used;
  const percentage = (balance.used / balance.total) * 100;

  return (
    <Card className={`premium-card ${className}`} style={style}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">{balance.type}</h3>
          {balance.urgent && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Urgent
            </Badge>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-2xl font-bold" style={{ color: balance.color }}>
                {remaining}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                jours restants
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {balance.used}/{balance.total}
              </div>
              <div className="text-xs text-gray-500">
                utilisés
              </div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${percentage}%`,
                backgroundColor: balance.color,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumLeaveBalanceCard;
