
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, TrendingUp, Award } from "lucide-react";

const PersonalStatsGrid = () => {
  const stats = [
    {
      label: "Jours pris cette année",
      value: "18",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900"
    },
    {
      label: "Demandes approuvées",
      value: "12/13",
      icon: Award,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900"
    },
    {
      label: "Temps de validation moyen",
      value: "1.2j",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900"
    },
    {
      label: "Planification optimale",
      value: "92%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="premium-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PersonalStatsGrid;
