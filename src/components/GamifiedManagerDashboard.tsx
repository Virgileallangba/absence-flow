import { Trophy, Users, TrendingUp, Star, Medal, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamWellbeingScore {
  score: number;
  trend: number;
  factors: {
    name: string;
    value: number;
    max: number;
  }[];
}

interface ManagerBadge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  progress: number;
  unlocked: boolean;
}

interface ManagerRanking {
  rank: number;
  name: string;
  score: number;
  avatar: string;
  initials: string;
}

const GamifiedManagerDashboard = () => {
  // Données de bien-être de l'équipe
  const teamWellbeing: TeamWellbeingScore = {
    score: 85,
    trend: 12,
    factors: [
      { name: "Répartition des congés", value: 90, max: 100 },
      { name: "Équilibre charge de travail", value: 85, max: 100 },
      { name: "Satisfaction équipe", value: 80, max: 100 },
    ]
  };

  // Badges disponibles
  const badges: ManagerBadge[] = [
    {
      id: "manager-of-year",
      name: "Manager de l'année",
      description: "Meilleure gestion des congés de l'année",
      icon: Trophy,
      progress: 75,
      unlocked: false
    },
    {
      id: "zen-team",
      name: "Équipe zen",
      description: "Équipe avec le meilleur équilibre vie pro/perso",
      icon: Star,
      progress: 90,
      unlocked: true
    },
    {
      id: "efficiency-master",
      name: "Maître de l'efficacité",
      description: "Validation rapide des demandes",
      icon: TrendingUp,
      progress: 60,
      unlocked: false
    }
  ];

  // Classement des managers
  const rankings: ManagerRanking[] = [
    { rank: 1, name: "Marie Martin", score: 92, avatar: "/placeholder.svg", initials: "MM" },
    { rank: 2, name: "Jean Dupont", score: 88, avatar: "/placeholder.svg", initials: "JD" },
    { rank: 3, name: "Sophie Leroy", score: 85, avatar: "/placeholder.svg", initials: "SL" },
  ];

  return (
    <div className="space-y-8">
      {/* Score de bien-être de l'équipe */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 border-green-200 dark:border-green-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-green-900 dark:text-green-100">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <span>Score de bien-être équipe</span>
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
              +{teamWellbeing.trend}% ce mois
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold text-green-900 dark:text-green-100">
                {teamWellbeing.score}%
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                Score global
              </div>
            </div>
            <div className="space-y-4">
              {teamWellbeing.factors.map((factor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-800 dark:text-green-200">{factor.name}</span>
                    <span className="text-green-700 dark:text-green-300">{factor.value}%</span>
                  </div>
                  <Progress value={factor.value} max={factor.max} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges et accomplissements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <Card 
            key={badge.id}
            className={`transition-all duration-300 ${
              badge.unlocked 
                ? "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700" 
                : "bg-white dark:bg-corporate-gray-800 border-corporate-gray-200 dark:border-corporate-gray-700"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${
                  badge.unlocked 
                    ? "bg-yellow-100 dark:bg-yellow-900/50" 
                    : "bg-corporate-gray-100 dark:bg-corporate-gray-700"
                }`}>
                  <badge.icon className={`h-6 w-6 ${
                    badge.unlocked 
                      ? "text-yellow-600 dark:text-yellow-400" 
                      : "text-corporate-gray-400 dark:text-corporate-gray-500"
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${
                    badge.unlocked 
                      ? "text-yellow-900 dark:text-yellow-100" 
                      : "text-corporate-gray-900 dark:text-white"
                  }`}>
                    {badge.name}
                  </h3>
                  <p className={`text-sm ${
                    badge.unlocked 
                      ? "text-yellow-700 dark:text-yellow-300" 
                      : "text-corporate-gray-600 dark:text-corporate-gray-400"
                  }`}>
                    {badge.description}
                  </p>
                  <Progress 
                    value={badge.progress} 
                    max={100} 
                    className={`mt-2 h-1 ${
                      badge.unlocked ? "bg-yellow-200 dark:bg-yellow-800" : ""
                    }`} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Classement des managers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-corporate-gray-900 dark:text-white">
            <Crown className="h-5 w-5 text-yellow-500" />
            <span>Classement des managers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rankings.map((manager) => (
              <div 
                key={manager.rank}
                className="flex items-center justify-between p-4 rounded-lg bg-corporate-gray-50 dark:bg-corporate-gray-800/50"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-corporate-blue-100 dark:bg-corporate-blue-900/50">
                    <span className="text-sm font-medium text-corporate-blue-700 dark:text-corporate-blue-300">
                      #{manager.rank}
                    </span>
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={manager.avatar} alt={manager.name} />
                    <AvatarFallback>{manager.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-corporate-gray-900 dark:text-white">
                      {manager.name}
                    </p>
                    <p className="text-sm text-corporate-gray-600 dark:text-corporate-gray-400">
                      Score: {manager.score}%
                    </p>
                  </div>
                </div>
                {manager.rank === 1 && (
                  <Medal className="h-6 w-6 text-yellow-500" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamifiedManagerDashboard; 