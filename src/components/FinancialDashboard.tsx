import { DollarSign, TrendingDown, TrendingUp, Calculator, PieChart, BarChart, AlertTriangle, ArrowRightLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface CostAnalysis {
  id: string;
  category: string;
  amount: number;
  trend: number;
  details: {
    label: string;
    value: number;
  }[];
}

interface OptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  implementation: string;
  impact: "high" | "medium" | "low";
}

interface AbsenceCost {
  id: string;
  employee: string;
  type: string;
  dates: string;
  directCost: number;
  indirectCost: number;
  totalCost: number;
}

const FinancialDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [absenceCosts, setAbsenceCosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchAbsenceCosts = async () => {
      // Exemple : charger toutes les absences et profils associés
      const { data, error } = await supabase
        .from('absences')
        .select('*, profiles(full_name)');
      if (!error && data) setAbsenceCosts(data);
    };
    fetchAbsenceCosts();
  }, []);

  // Analyse des coûts
  const costAnalysis: CostAnalysis[] = [
    {
      id: "c1",
      category: "Congés payés",
      amount: -15000,
      trend: -5,
      details: [
        { label: "Coût direct", value: -12000 },
        { label: "Perte de productivité", value: -3000 }
      ]
    },
    {
      id: "c2",
      category: "Intérim",
      amount: 25000,
      trend: 12,
      details: [
        { label: "Frais d'agence", value: 5000 },
        { label: "Salaire intérimaire", value: 20000 }
      ]
    },
    {
      id: "c3",
      category: "Formation remplaçants",
      amount: 5000,
      trend: 0,
      details: [
        { label: "Formation", value: 3000 },
        { label: "Documentation", value: 2000 }
      ]
    }
  ];

  // Suggestions d'optimisation
  const optimizationSuggestions: OptimizationSuggestion[] = [
    {
      id: "o1",
      title: "Étalement des congés d'été",
      description: "Répartir les congés sur juillet et août pour réduire les besoins en intérim",
      potentialSavings: 8000,
      implementation: "Planification prévisionnelle avec les équipes",
      impact: "high"
    },
    {
      id: "o2",
      title: "Formation croisée",
      description: "Former les équipes aux tâches critiques pour réduire la dépendance aux remplaçants",
      potentialSavings: 5000,
      implementation: "Programme de formation sur 3 mois",
      impact: "medium"
    },
    {
      id: "o3",
      title: "Optimisation des délais",
      description: "Augmenter le délai de prévenance pour mieux planifier les remplacements",
      potentialSavings: 3000,
      implementation: "Mise à jour de la politique de congés",
      impact: "low"
    }
  ];

  return (
    <div className="space-y-8">
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Vue d'ensemble</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center space-x-2">
            <Calculator className="h-4 w-4" />
            <span>Analyse détaillée</span>
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Optimisation</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Impact financier global */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-corporate-gray-900 dark:text-white">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Impact financier du trimestre</span>
                </div>
                <Badge variant="destructive">-15 000 €</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {costAnalysis.map((cost) => (
                  <div key={cost.id} className="p-4 bg-corporate-gray-50 dark:bg-corporate-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-corporate-gray-900 dark:text-white">
                        {cost.category}
                      </p>
                      <Badge 
                        variant={cost.trend < 0 ? "default" : "destructive"}
                        className="flex items-center"
                      >
                        {cost.trend < 0 ? <TrendingDown className="h-4 w-4 mr-1" /> : <TrendingUp className="h-4 w-4 mr-1" />}
                        {cost.trend}%
                      </Badge>
                    </div>
                    <p className={`text-2xl font-bold mt-2 ${
                      cost.amount < 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}>
                      {cost.amount.toLocaleString()} €
                    </p>
                    <div className="mt-2 space-y-1">
                      {cost.details.map((detail, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-corporate-gray-600 dark:text-corporate-gray-400">
                            {detail.label}
                          </span>
                          <span className="text-corporate-gray-900 dark:text-white">
                            {detail.value.toLocaleString()} €
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alertes budgétaires */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-corporate-gray-900 dark:text-white">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span>Alertes budgétaires</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-400 dark:border-yellow-500">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Dépenses intérim en hausse
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    +12% ce trimestre, principalement due aux congés d'été
                  </p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-400 dark:border-red-500">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    Perte de productivité critique
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                    3 000 € de perte due aux absences non planifiées
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {/* Analyse détaillée des coûts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-corporate-gray-900 dark:text-white">
                <div className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Coûts détaillés des absences</span>
                </div>
                <Button variant="outline" size="sm">
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {absenceCosts.map((cost) => (
                  <div key={cost.id} className="p-4 bg-corporate-gray-50 dark:bg-corporate-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-corporate-gray-900 dark:text-white">
                          {cost.employee}
                        </p>
                        <p className="text-sm text-corporate-gray-600 dark:text-corporate-gray-400">
                          {cost.dates} • {cost.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">
                          {cost.totalCost.toLocaleString()} €
                        </p>
                        <div className="flex space-x-4 text-sm">
                          <span className="text-corporate-gray-600 dark:text-corporate-gray-400">
                            Direct: {cost.directCost.toLocaleString()} €
                          </span>
                          <span className="text-corporate-gray-600 dark:text-corporate-gray-400">
                            Indirect: {cost.indirectCost.toLocaleString()} €
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Graphiques d'analyse */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-corporate-gray-900 dark:text-white">
                  <PieChart className="h-5 w-5" />
                  <span>Répartition des coûts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-corporate-gray-600 dark:text-corporate-gray-400">
                  Graphique en camembert
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-corporate-gray-900 dark:text-white">
                  <BarChart className="h-5 w-5" />
                  <span>Évolution mensuelle</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-corporate-gray-600 dark:text-corporate-gray-400">
                  Graphique en barres
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          {/* Suggestions d'optimisation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-corporate-gray-900 dark:text-white">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Optimisations suggérées</span>
                </div>
                <Badge variant="outline">
                  Économies potentielles: {optimizationSuggestions.reduce((acc, curr) => acc + curr.potentialSavings, 0).toLocaleString()} €
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizationSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-4 bg-corporate-gray-50 dark:bg-corporate-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-corporate-gray-900 dark:text-white">
                            {suggestion.title}
                          </p>
                          <Badge 
                            variant={
                              suggestion.impact === "high" ? "default" :
                              suggestion.impact === "medium" ? "secondary" : "outline"
                            }
                          >
                            Impact {suggestion.impact}
                          </Badge>
                        </div>
                        <p className="text-sm text-corporate-gray-600 dark:text-corporate-gray-400 mt-1">
                          {suggestion.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          +{suggestion.potentialSavings.toLocaleString()} €
                        </p>
                        <p className="text-sm text-corporate-gray-600 dark:text-corporate-gray-400">
                          {suggestion.implementation}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm">
                        Voir le plan d'action
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialDashboard; 