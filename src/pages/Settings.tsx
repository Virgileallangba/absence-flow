
import { Settings as SettingsIcon, Palette, Bell, Shield, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/Header";
import ThemeToggle from "@/components/ThemeToggle";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header 
        activeRole="employee" 
        onRoleChange={() => {}}
        onNewRequest={() => {}}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
            <SettingsIcon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Palette className="h-5 w-5" />
                  Apparence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Thème</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Choisissez votre thème préféré ou suivez le système
                    </p>
                  </div>
                  <ThemeToggle />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notifications par email</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Recevoir des notifications pour les demandes importantes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Rappels automatiques</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Rappels pour les congés à planifier
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notifications push</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Notifications instantanées dans le navigateur
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-5 w-5" />
                  Sécurité et confidentialité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Authentification à deux facteurs</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Sécurisez votre compte avec 2FA
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurer
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Sessions actives</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Gérer vos connexions actives
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Voir les sessions
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-5 w-5" />
                  Équipe et permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Délégation de validation</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Déléguer vos droits de validation temporairement
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurer
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Visibilité du calendrier</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Contrôler qui peut voir vos absences
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
