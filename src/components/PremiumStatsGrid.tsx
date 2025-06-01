
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Calendar, Users } from "lucide-react";

const PremiumStatsGrid = () => {
  const stats = [
    {
      label: "Demandes ce mois",
      value: "12",
      change: "+15%",
      trend: "up",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      label: "Équipe présente",
      value: "28/32",
      change: "87%",
      trend: "up",
      icon: Users,
      color: "text-green-600"
    },
    {
      label: "Temps de validation",
      value: "2.4j",
      change: "-0.5j",
      trend: "down",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="premium-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              {stat.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${
                stat.trend === "up" ? "text-green-600" : "text-red-600"
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PremiumStatsGrid;
