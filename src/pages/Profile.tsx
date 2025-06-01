
import { User, Settings, Briefcase, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-corporate-blue-50 via-background to-corporate-green-50 dark:from-corporate-gray-900 dark:via-background dark:to-corporate-gray-800 transition-colors duration-300">
      <Header 
        activeRole="employee" 
        onRoleChange={() => {}}
        onNewRequest={() => {}}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-corporate-gray-900 dark:text-white transition-colors duration-300">Mon Profil</h1>
            <Button variant="outline" className="border-corporate-gray-200 dark:border-corporate-gray-700 text-corporate-gray-900 dark:text-white hover:bg-corporate-gray-50 dark:hover:bg-corporate-gray-800 transition-colors duration-300">
              <Settings className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-2 premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 premium-text">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium premium-text-muted">Nom</label>
                    <p className="premium-text">Jean Dupont</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium premium-text-muted">Email</label>
                    <p className="premium-text">jean.dupont@entreprise.fr</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium premium-text-muted">Département</label>
                    <p className="premium-text">Développement</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium premium-text-muted">Manager</label>
                    <p className="premium-text">Marie Martin</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 premium-text">
                  <Briefcase className="h-5 w-5" />
                  Statut
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Badge className="w-full justify-center bg-corporate-green-50 dark:bg-corporate-green-600 text-corporate-green-700 dark:text-white border-corporate-green-100 dark:border-corporate-green-500 transition-colors duration-300">
                  Actif
                </Badge>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="premium-text-muted">Date d'embauche</span>
                    <span className="premium-text">15/03/2022</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="premium-text-muted">Ancienneté</span>
                    <span className="premium-text">2 ans</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 premium-text">
                <Clock className="h-5 w-5" />
                Droits aux congés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-corporate-blue-600 dark:text-corporate-blue-400 transition-colors duration-300">25</div>
                  <div className="text-sm premium-text-muted">Congés payés annuels</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-corporate-green-600 dark:text-corporate-green-400 transition-colors duration-300">8</div>
                  <div className="text-sm premium-text-muted">RTT annuels</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-corporate-orange-600 dark:text-corporate-orange-400 transition-colors duration-300">4</div>
                  <div className="text-sm premium-text-muted">Jours de récupération</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
