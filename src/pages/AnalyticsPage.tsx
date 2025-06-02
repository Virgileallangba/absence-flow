import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/services/authService";
import type { Employee } from "@/lib/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { supabase } from "@/lib/supabase";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AnalyticsPage = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAbsences: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    monthlyData: [],
    departmentData: [],
    typeData: [],
  });

  useEffect(() => {
    const loadData = async () => {
      console.log("AnalyticsPage: Loading data...");
      try {
        const session = await authService.getCurrentSession();
        if (session?.user) {
          const userProfile = await authService.getProfile(session.user.id);
          if (userProfile) {
            console.log("AnalyticsPage: Profile loaded.", userProfile);
            setProfile(userProfile);

            // Charger les vraies données depuis Supabase
            const { data: absences, error } = await supabase
              .from('absences')
              .select('*')
              .eq('employee_id', session.user.id);
            if (!error && absences) {
              // Calculs dynamiques
              const totalAbsences = absences.length;
              const pendingRequests = absences.filter(a => a.status === 'pending').length;
              const approvedRequests = absences.filter(a => a.status === 'approved').length;
              const rejectedRequests = absences.filter(a => a.status === 'rejected').length;
              // Exemple de monthlyData
              const monthlyData = Array.from({length: 12}, (_, i) => ({
                month: new Date(0, i).toLocaleString('fr-FR', { month: 'short' }),
                absences: absences.filter(a => new Date(a.start_date).getMonth() === i).length
              }));
              setStats({
                totalAbsences,
                pendingRequests,
                approvedRequests,
                rejectedRequests,
                monthlyData,
                departmentData: [], // À compléter selon votre structure
                typeData: [] // À compléter selon votre structure
              });
            }
          }
        } else {
          console.log("AnalyticsPage: No active session found.");
        }
      } catch (error) {
        console.error("AnalyticsPage: Erreur lors du chargement des données:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données analytiques.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        console.log("AnalyticsPage: Loading finished.");
      }
    };

    loadData();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-corporate-gray-900">
        <Header
          activeRole={profile?.role || "employee"}
          onRoleChange={() => {}}
          onNewRequest={() => {}}
        />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-corporate-gray-800 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 dark:bg-corporate-gray-800 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-corporate-gray-900">
      <Header
        activeRole={profile?.role || "employee"}
        onRoleChange={() => {}}
        onNewRequest={() => {}}
      />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-corporate-gray-900 dark:text-white mb-8">
          Analytiques
        </h1>

        <div className="grid gap-6">
          {/* Statistiques générales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total des absences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAbsences}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En attente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingRequests}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approuvées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.approvedRequests}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejetées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.rejectedRequests}</div>
              </CardContent>
            </Card>
          </div>

          {/* Graphiques */}
          <Tabs defaultValue="monthly" className="space-y-4">
            <TabsList>
              <TabsTrigger value="monthly">Par mois</TabsTrigger>
              <TabsTrigger value="department">Par département</TabsTrigger>
              <TabsTrigger value="type">Par type</TabsTrigger>
            </TabsList>

            <TabsContent value="monthly" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Absences par mois</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="absences" fill="#0088FE" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="department" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Absences par département</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.departmentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {stats.departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="type" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Absences par type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.typeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {stats.typeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage; 