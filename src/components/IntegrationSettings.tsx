import { Slack, MessageSquare, Bell, Settings, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface IntegrationStatus {
  connected: boolean;
  lastSync: string;
  notifications: {
    type: string;
    enabled: boolean;
  }[];
}

const IntegrationSettings = () => {
  // État des intégrations
  const slackStatus: IntegrationStatus = {
    connected: true,
    lastSync: "Il y a 5 minutes",
    notifications: [
      { type: "Demandes de congés", enabled: true },
      { type: "Validations", enabled: true },
      { type: "Absences planifiées", enabled: true },
      { type: "Alertes sous-effectif", enabled: false }
    ]
  };

  const teamsStatus: IntegrationStatus = {
    connected: true,
    lastSync: "Il y a 2 minutes",
    notifications: [
      { type: "Statut automatique", enabled: true },
      { type: "Notifications de présence", enabled: true },
      { type: "Alertes équipe", enabled: true }
    ]
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Intégration Slack */}
        <Card className="bg-white dark:bg-corporate-gray-800 border-corporate-gray-200 dark:border-corporate-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-corporate-gray-900 dark:text-white">
              <div className="flex items-center space-x-2">
                <Slack className="h-6 w-6 text-[#4A154B]" />
                <span>Slack</span>
              </div>
              <Badge variant={slackStatus.connected ? "default" : "destructive"}>
                {slackStatus.connected ? "Connecté" : "Déconnecté"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-corporate-gray-600 dark:text-corporate-gray-400">
                Dernière synchronisation
              </span>
              <span className="text-corporate-gray-900 dark:text-white">
                {slackStatus.lastSync}
              </span>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-corporate-gray-900 dark:text-white">
                Commandes disponibles
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-corporate-gray-50 dark:bg-corporate-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-corporate-gray-900 dark:text-white">
                      /conges demande
                    </p>
                    <p className="text-sm text-corporate-gray-600 dark:text-corporate-gray-400">
                      Créer une demande de congés
                    </p>
                  </div>
                  <Badge variant="outline">/conges demande 15-16 juin</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-corporate-gray-50 dark:bg-corporate-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-corporate-gray-900 dark:text-white">
                      /conges statut
                    </p>
                    <p className="text-sm text-corporate-gray-600 dark:text-corporate-gray-400">
                      Voir les congés de l'équipe
                    </p>
                  </div>
                  <Badge variant="outline">/conges statut @marie</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-corporate-gray-900 dark:text-white">
                Notifications
              </h4>
              <div className="space-y-3">
                {slackStatus.notifications.map((notification, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <Label htmlFor={`slack-notif-${index}`} className="text-corporate-gray-900 dark:text-white">
                      {notification.type}
                    </Label>
                    <Switch
                      id={`slack-notif-${index}`}
                      checked={notification.enabled}
                      className="data-[state=checked]:bg-[#4A154B]"
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Configurer l'intégration
            </Button>
          </CardContent>
        </Card>

        {/* Intégration Teams */}
        <Card className="bg-white dark:bg-corporate-gray-800 border-corporate-gray-200 dark:border-corporate-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-corporate-gray-900 dark:text-white">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-6 w-6 text-[#5059C9]" />
                <span>Microsoft Teams</span>
              </div>
              <Badge variant={teamsStatus.connected ? "default" : "destructive"}>
                {teamsStatus.connected ? "Connecté" : "Déconnecté"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-corporate-gray-600 dark:text-corporate-gray-400">
                Dernière synchronisation
              </span>
              <span className="text-corporate-gray-900 dark:text-white">
                {teamsStatus.lastSync}
              </span>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-corporate-gray-900 dark:text-white">
                Fonctionnalités
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-3 bg-corporate-gray-50 dark:bg-corporate-gray-700/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-corporate-gray-900 dark:text-white">
                      Statut automatique
                    </p>
                    <p className="text-sm text-corporate-gray-600 dark:text-corporate-gray-400">
                      Mise à jour du statut pendant les congés
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-corporate-gray-50 dark:bg-corporate-gray-700/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-corporate-gray-900 dark:text-white">
                      Notifications contextuelles
                    </p>
                    <p className="text-sm text-corporate-gray-600 dark:text-corporate-gray-400">
                      Alertes sur les absences impactant les projets
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-corporate-gray-900 dark:text-white">
                Notifications
              </h4>
              <div className="space-y-3">
                {teamsStatus.notifications.map((notification, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <Label htmlFor={`teams-notif-${index}`} className="text-corporate-gray-900 dark:text-white">
                      {notification.type}
                    </Label>
                    <Switch
                      id={`teams-notif-${index}`}
                      checked={notification.enabled}
                      className="data-[state=checked]:bg-[#5059C9]"
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Configurer l'intégration
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Guide d'utilisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-corporate-gray-900 dark:text-white">
            <Bell className="h-5 w-5" />
            <span>Guide d'utilisation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="slack" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="slack" className="flex items-center space-x-2">
                <Slack className="h-4 w-4" />
                <span>Slack</span>
              </TabsTrigger>
              <TabsTrigger value="teams" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Teams</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="slack" className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <h3>Commandes Slack</h3>
                <ul>
                  <li><code>/conges demande [dates]</code> - Créer une demande de congés</li>
                  <li><code>/conges statut [@utilisateur]</code> - Voir les congés d'un membre</li>
                  <li><code>/conges équipe</code> - Voir les congés de l'équipe</li>
                  <li><code>/conges aide</code> - Afficher l'aide</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="teams" className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <h3>Fonctionnalités Teams</h3>
                <ul>
                  <li>Statut automatique pendant les congés</li>
                  <li>Notifications contextuelles sur les projets</li>
                  <li>Intégration avec le calendrier Teams</li>
                  <li>Alertes de sous-effectif</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationSettings; 