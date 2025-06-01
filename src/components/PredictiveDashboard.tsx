
import { TrendingUp, Calendar, Brain, Users, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { predictiveAnalytics } from "@/services/predictiveAnalytics";
import { useState, useEffect } from "react";

const PredictiveDashboard = () => {
  const [patterns, setPatterns] = useState(predictiveAnalytics.analyzeAbsencePatterns());
  
  const predictionData = [
    { week: 'S1', predicted: 3, actual: 2, confidence: 85 },
    { week: 'S2', predicted: 5, actual: 4, confidence: 78 },
    { week: 'S3', predicted: 8, actual: 9, confidence: 82 },
    { week: 'S4', predicted: 12, actual: 11, confidence: 88 },
    { week: 'S5', predicted: 15, actual: null, confidence: 75 },
    { week: 'S6', predicted: 18, actual: null, confidence: 71 },
    { week: 'S7', predicted: 22, actual: null, confidence: 79 },
    { week: 'S8', predicted: 14, actual: null, confidence: 83 },
  ];

  const riskTrends = [
    { month: 'Jan', low: 12, medium: 3, high: 1, critical: 0 },
    { month: 'Fév', low: 10, medium: 4, high: 2, critical: 0 },
    { month: 'Mar', low: 8, medium: 6, high: 2, critical: 1 },
    { month: 'Avr', low: 6, medium: 8, high: 3, critical: 1 },
    { month: 'Mai', low: 9, medium: 5, high: 2, critical: 0 },
    { month: 'Jun', low: 4, medium: 8, high: 4, critical: 2 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Précision IA</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-2">87%</p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Prédictions actives</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-2">12</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Alertes critiques</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-2">3</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Économies RH</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-2">24h</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Prédictions vs Réalité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    value,
                    name === 'predicted' ? 'Prédit' : name === 'actual' ? 'Réel' : 'Confiance (%)'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  name="predicted"
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  name="actual"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Évolution des Risques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="low" stackId="a" fill="#3b82f6" name="Faible" />
                <Bar dataKey="medium" stackId="a" fill="#f59e0b" name="Moyen" />
                <Bar dataKey="high" stackId="a" fill="#f97316" name="Élevé" />
                <Bar dataKey="critical" stackId="a" fill="#ef4444" name="Critique" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Patterns d'Absence Détectés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patterns.map((pattern, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <div className="flex items-center justify-between mb-3">
                  <Badge className={`
                    ${pattern.type === 'school_holiday' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
                    ${pattern.type === 'bridge_day' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                    ${pattern.type === 'summer_peak' ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}
                    ${pattern.type === 'end_year' ? 'bg-purple-100 text-purple-700 border-purple-200' : ''}
                    ${pattern.type === 'seasonal' ? 'bg-pink-100 text-pink-700 border-pink-200' : ''}
                  `}>
                    {pattern.type === 'school_holiday' ? 'Vacances scolaires' :
                     pattern.type === 'bridge_day' ? 'Pont' :
                     pattern.type === 'summer_peak' ? 'Pic été' :
                     pattern.type === 'end_year' ? 'Fin d\'année' : 'Saisonnier'}
                  </Badge>
                  <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                    {Math.round(pattern.probability * 100)}%
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {pattern.period}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Historique : {pattern.historicalCount} absences moyennes
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveDashboard;
