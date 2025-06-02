import { Users, CheckCircle, XCircle, Clock, AlertTriangle, Calendar, Brain, Trophy, MessageSquare, CalendarDays, Briefcase, DollarSign, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PredictiveAlerts from "./PredictiveAlerts";
import PredictiveDashboard from "./PredictiveDashboard";
import GamifiedManagerDashboard from "./GamifiedManagerDashboard";
import IntegrationSettings from "./IntegrationSettings";
import TeamPlanningView from "./TeamPlanningView";
import HRConsultant from "./HRConsultant";
import FinancialDashboard from "./FinancialDashboard";
import ComplianceDashboard from "./ComplianceDashboard";
import { absenceService } from "@/services/absenceService";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Absence } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";

interface PendingRequestData extends Absence {
  employee: {
    id: string;
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  } | null;
}

interface FormattedPendingRequest {
  id: number;
  employee: string;
  avatar: string;
  initials: string;
  dates: string;
  type: string;
  days: number;
  reason: string;
  submitted: string;
}

interface UpcomingAbsence {
  id: string;
  start_date: string;
  end_date: string;
  type: string;
  profiles: {
    full_name: string;
  };
}

const ManagerDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState<FormattedPendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [upcomingAbsences, setUpcomingAbsences] = useState<UpcomingAbsence[]>([]);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const data = (await absenceService.getPendingAbsences()) as PendingRequestData[] | null;
        const formattedRequests: FormattedPendingRequest[] = data?.map((req: PendingRequestData) => ({
          id: req.id,
          employee: req.employee?.full_name || 'N/A',
          avatar: req.employee?.avatar_url || '/placeholder.svg',
          initials: req.employee?.full_name ? req.employee.full_name.split(' ').map((n: string) => n[0]).join('') : 'N/A',
          dates: `${new Date(req.start_date).toLocaleDateString('fr-FR')} - ${new Date(req.end_date).toLocaleDateString('fr-FR')}`,
          type: req.type || 'N/A',
          days: Math.ceil((new Date(req.end_date).getTime() - new Date(req.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1,
          reason: req.reason || 'Aucune raison fournie',
          submitted: new Date(req.created_at).toLocaleDateString('fr-FR'),
        })) || [];
        setPendingRequests(formattedRequests);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les demandes en attente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();

    const fetchUpcomingAbsences = async () => {
      try {
        const { data, error } = await supabase
          .from('absences')
          .select('*, profiles(full_name)')
          .gte('start_date', new Date().toISOString().slice(0, 10));
        if (!error && data) setUpcomingAbsences(data);
      } catch (e) {
        // no-op
      }
    };
    fetchUpcomingAbsences();
  }, [toast]);

  const teamStats = [
    { label: "En congés aujourd'hui", value: 3, icon: Calendar, color: "text-blue-600 dark:text-blue-400" },
    { label: "Demandes en attente", value: pendingRequests.length, icon: Clock, color: "text-yellow-600 dark:text-yellow-400" },
    { label: "Approuvées ce mois", value: 12, icon: CheckCircle, color: "text-green-600 dark:text-green-400" },
    { label: "Taux d'absence", value: "12%", icon: Users, color: "text-purple-600 dark:text-purple-400" },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-9 bg-white dark:bg-corporate-gray-800 border border-corporate-gray-200 dark:border-corporate-gray-700">
          <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-corporate-blue-50 dark:data-[state=active]:bg-corporate-blue-900 data-[state=active]:text-corporate-blue-700 dark:data-[state=active]:text-corporate-blue-300">
            <Users className="h-3 w-3" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="planning" className="flex items-center gap-2 data-[state=active]:bg-corporate-blue-50 dark:data-[state=active]:bg-corporate-blue-900 data-[state=active]:text-corporate-blue-700 dark:data-[state=active]:text-corporate-blue-300">
            <CalendarDays className="h-3 w-3" />
            Planning
          </TabsTrigger>
          <TabsTrigger value="gamified" className="flex items-center gap-2 data-[state=active]:bg-corporate-blue-50 dark:data-[state=active]:bg-corporate-blue-900 data-[state=active]:text-corporate-blue-700 dark:data-[state=active]:text-corporate-blue-300">
            <Trophy className="h-3 w-3" />
            Gamification
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center gap-2 data-[state=active]:bg-corporate-blue-50 dark:data-[state=active]:bg-corporate-blue-900 data-[state=active]:text-corporate-blue-700 dark:data-[state=active]:text-corporate-blue-300">
            <Brain className="h-3 w-3" />
            Analyse prédictive
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2 data-[state=active]:bg-corporate-blue-50 dark:data-[state=active]:bg-corporate-blue-900 data-[state=active]:text-corporate-blue-700 dark:data-[state=active]:text-corporate-blue-300">
            <AlertTriangle className="h-3 w-3" />
            Alertes IA
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2 data-[state=active]:bg-corporate-blue-50 dark:data-[state=active]:bg-corporate-blue-900 data-[state=active]:text-corporate-blue-700 dark:data-[state=active]:text-corporate-blue-300">
            <MessageSquare className="h-3 w-3" />
            Intégrations
          </TabsTrigger>
          <TabsTrigger value="hr-consultant" className="flex items-center gap-2 data-[state=active]:bg-corporate-blue-50 dark:data-[state=active]:bg-corporate-blue-900 data-[state=active]:text-corporate-blue-700 dark:data-[state=active]:text-corporate-blue-300">
            <Briefcase className="h-3 w-3" />
            RH Virtuel
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2 data-[state=active]:bg-corporate-blue-50 dark:data-[state=active]:bg-corporate-blue-900 data-[state=active]:text-corporate-blue-700 dark:data-[state=active]:text-corporate-blue-300">
            <DollarSign className="h-3 w-3" />
            Financier
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2 data-[state=active]:bg-corporate-blue-50 dark:data-[state=active]:bg-corporate-blue-900 data-[state=active]:text-corporate-blue-700 dark:data-[state=active]:text-corporate-blue-300">
            <Shield className="h-3 w-3" />
            Conformité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamStats.map((stat, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow bg-white dark:bg-corporate-gray-800 border-corporate-gray-200 dark:border-corporate-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-corporate-gray-600 dark:text-corporate-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold mt-2 text-corporate-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pending Requests */}
          <Card className="bg-white dark:bg-corporate-gray-800 border-corporate-gray-200 dark:border-corporate-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-corporate-gray-900 dark:text-white">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Demandes en attente
                </div>
                <Badge variant="secondary">{pendingRequests.length} à traiter</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Chargement des demandes...</div>
              ) : pendingRequests.length === 0 ? (
                <div className="text-center py-4 text-corporate-gray-600 dark:text-corporate-gray-400">Aucune demande en attente.</div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 hover:bg-corporate-gray-50 dark:hover:bg-corporate-gray-700 transition-colors border-corporate-gray-200 dark:border-corporate-gray-700">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={request.avatar} alt={request.employee} />
                            <AvatarFallback>{request.initials}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-2">
                            <div>
                              <h4 className="font-medium text-corporate-gray-900 dark:text-white">{request.employee}</h4>
                              <p className="text-sm text-corporate-gray-600 dark:text-corporate-gray-400">{request.dates} • {request.days} jour{request.days > 1 ? 's' : ''}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{request.type}</Badge>
                              <span className="text-xs text-corporate-gray-500 dark:text-corporate-gray-400">Soumis le {request.submitted}</span>
                            </div>
                            <p className="text-sm text-corporate-gray-700 dark:text-corporate-gray-300 mt-2">{request.reason}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approuver
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20">
                            <XCircle className="h-4 w-4 mr-1" />
                            Refuser
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Calendar & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-corporate-gray-800 border-corporate-gray-200 dark:border-corporate-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-corporate-gray-900 dark:text-white">
                  <Calendar className="h-5 w-5 mr-2" />
                  Prochaines absences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingAbsences.map((absence, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-corporate-blue-50 dark:bg-corporate-blue-900/20 rounded-lg">
                      <div>
                        <p className="font-medium text-corporate-gray-900 dark:text-white">{absence.profiles.full_name}</p>
                        <p className="text-sm text-corporate-gray-600 dark:text-corporate-gray-400">{absence.start_date.slice(0, 10)} - {absence.end_date.slice(0, 10)}</p>
                      </div>
                      <Badge variant="outline">{absence.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-corporate-gray-800 border-corporate-gray-200 dark:border-corporate-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-corporate-gray-900 dark:text-white">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600 dark:text-yellow-400" />
                  Alertes équipe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-400 dark:border-yellow-500">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Sous-effectif prévu</p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">Semaine du 22 Déc: 40% de l'équipe en congés</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400 dark:border-blue-500">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Congés à valider</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">3 demandes urgent à traiter avant demain</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-400 dark:border-purple-500">
                    <p className="text-sm font-medium text-purple-800 dark:text-purple-200">IA activée</p>
                    <p className="text-xs text-purple-700 dark:text-purple-300">Nouvelles prédictions disponibles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="planning">
          <TeamPlanningView />
        </TabsContent>

        <TabsContent value="gamified">
          <GamifiedManagerDashboard />
        </TabsContent>

        <TabsContent value="predictive">
          <PredictiveDashboard />
        </TabsContent>

        <TabsContent value="alerts">
          <PredictiveAlerts />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationSettings />
        </TabsContent>

        <TabsContent value="hr-consultant">
          <HRConsultant />
        </TabsContent>

        <TabsContent value="financial">
          <FinancialDashboard />
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerDashboard;
