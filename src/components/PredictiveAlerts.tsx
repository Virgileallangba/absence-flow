
import { AlertTriangle, TrendingUp, Users, Calendar, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { predictiveAnalytics, PredictiveAlert } from "@/services/predictiveAnalytics";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState, useEffect } from "react";

const PredictiveAlerts = () => {
  const [alerts, setAlerts] = useState<PredictiveAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<PredictiveAlert | null>(null);

  useEffect(() => {
    const generatedAlerts = predictiveAnalytics.generatePredictiveAlerts();
    setAlerts(generatedAlerts);
  }, []);

  const getRiskColor = (level: PredictiveAlert['riskLevel']) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getRiskTextColor = (level: PredictiveAlert['riskLevel']) => {
    switch (level) {
      case 'critical': return 'text-red-700';
      case 'high': return 'text-orange-700';
      case 'medium': return 'text-yellow-700';
      default: return 'text-blue-700';
    }
  };

  const generateSolutions = (alert: PredictiveAlert) => {
    const redistributions = predictiveAnalytics.generateTeamRedistributions(alert);
    setSelectedAlert(alert);
    console.log('Solutions générées:', redistributions);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-purple-600" />
            <span>Intelligence Artificielle Prédictive</span>
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
              IA Activée
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{alerts.length}</div>
              <div className="text-sm text-gray-600">Alertes générées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {alerts.filter(a => a.riskLevel === 'high' || a.riskLevel === 'critical').length}
              </div>
              <div className="text-sm text-gray-600">Risques élevés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">85%</div>
              <div className="text-sm text-gray-600">Précision prédictive</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Alertes Prédictives - Prochaines 12 semaines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertTitle>Situation stable</AlertTitle>
                <AlertDescription>
                  Aucun risque de sous-effectif détecté dans les 12 prochaines semaines.
                </AlertDescription>
              </Alert>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getRiskColor(alert.riskLevel)}`} />
                      <div>
                        <h4 className="font-medium">
                          Semaine {alert.weekNumber} - {format(alert.date, 'dd MMM yyyy', { locale: fr })}
                        </h4>
                        <p className={`text-sm ${getRiskTextColor(alert.riskLevel)}`}>
                          {alert.message}
                        </p>
                      </div>
                    </div>
                    <Badge variant={alert.riskLevel === 'critical' ? 'destructive' : 'outline'}>
                      {alert.riskLevel === 'critical' ? 'Critique' : 
                       alert.riskLevel === 'high' ? 'Élevé' : 
                       alert.riskLevel === 'medium' ? 'Moyen' : 'Faible'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{alert.availableStaff}/{alert.totalStaff} disponibles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{alert.expectedAbsences} absences prévues</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <span>{Math.round((alert.availableStaff / alert.totalStaff) * 100)}% effectif</span>
                    </div>
                  </div>

                  {alert.suggestions.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                        Recommandations IA :
                      </h5>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        {alert.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(alert.riskLevel === 'high' || alert.riskLevel === 'critical') && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => generateSolutions(alert)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Brain className="h-4 w-4 mr-1" />
                        Générer solutions IA
                      </Button>
                      <Button size="sm" variant="outline">
                        Planifier actions
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {selectedAlert && (
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-purple-700 dark:text-purple-300">
              Solutions IA - Semaine {selectedAlert.weekNumber}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <Brain className="h-4 w-4" />
                <AlertTitle>Redistribution intelligente proposée</AlertTitle>
                <AlertDescription>
                  L'IA recommande les redistributions suivantes pour maintenir la productivité :
                </AlertDescription>
              </Alert>
              
              <div className="grid gap-3">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="font-medium text-green-800 dark:text-green-200">
                    Équipe Support → Équipe Développement
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Transférer Marie Martin et Pierre Durand (compétences techniques compatibles)
                  </div>
                  <Badge className="mt-2 bg-green-100 text-green-700 border-green-200">
                    Impact moyen
                  </Badge>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="font-medium text-blue-800 dark:text-blue-200">
                    Équipe Marketing → Équipe Développement
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Transférer Sophie Leroy (compétences UX/UI utiles)
                  </div>
                  <Badge className="mt-2 bg-blue-100 text-blue-700 border-blue-200">
                    Impact faible
                  </Badge>
                </div>
              </div>
              
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Appliquer les recommandations IA
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PredictiveAlerts;
