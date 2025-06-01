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

            // Simuler des données pour la démo
            // Dans une vraie application, ces données viendraient de l'API
            const mockData = {
              totalAbsences: 156,
              pendingRequests: 12,
              approvedRequests: 134,
              rejectedRequests: 10,
              monthlyData: [
                { month: "Jan", absences: 15 },
                { month: "Fév", absences: 12 },
                { month: "Mar", absences: 18 },
                { month: "Avr", absences: 14 },
                { month: "Mai", absences: 16 },
                { month: "Jun", absences: 13 },
              ],
              departmentData: [
                { name: "IT", value: 45 },
                { name: "RH", value: 30 },
                { name: "Marketing", value: 25 },
                { name: "Finance", value: 20 },
              ],
              typeData: [
                { name: "Congés", value: 80 },
                { name: "Maladie", value: 40 },
                { name: "Formation", value: 20 },
                { name: "Autre", value: 16 },
              ],
            };

            setStats(mockData);
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