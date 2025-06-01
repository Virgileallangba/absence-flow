
import { BarChart3, TrendingUp, Calendar, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const Analytics = () => {
  const monthlyData = [
    { month: "Jan", conges: 12, rtt: 5, maladie: 3 },
    { month: "Fév", conges: 15, rtt: 4, maladie: 2 },
    { month: "Mar", conges: 18, rtt: 6, maladie: 4 },
    { month: "Avr", conges: 22, rtt: 8, maladie: 3 },
    { month: "Mai", conges: 25, rtt: 7, maladie: 2 },
    { month: "Jun", conges: 30, rtt: 9, maladie: 1 },
  ];

  const trendData = [
    { periode: "T1", utilisation: 65 },
    { periode: "T2", utilisation: 72 },
    { periode: "T3", utilisation: 78 },
    { periode: "T4", utilisation: 85 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header 
        activeRole="manager" 
        onRoleChange={() => {}}
        onNewRequest={() => {}}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <Badge className="bg-blue-50 text-blue-700">
              Vue équipe
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Demandes ce mois</p>
                    <p className="text-2xl font-bold text-gray-900">34</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Taux d'approbation</p>
                    <p className="text-2xl font-bold text-gray-900">92%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Équipe active</p>
                    <p className="text-2xl font-bold text-gray-900">28/32</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Utilisation moyenne</p>
                    <p className="text-2xl font-bold text-gray-900">74%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Absences par mois</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="conges" fill="#3b82f6" name="Congés" />
                    <Bar dataKey="rtt" fill="#10b981" name="RTT" />
                    <Bar dataKey="maladie" fill="#f59e0b" name="Maladie" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendance d'utilisation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periode" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="utilisation" stroke="#8b5cf6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
