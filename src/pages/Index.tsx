import { useState } from "react";
import { Calendar, Clock, Users, BarChart3, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import EmployeeDashboard from "@/components/EmployeeDashboard";
import ManagerDashboard from "@/components/ManagerDashboard";
import RequestModal from "@/components/RequestModal";

const Index = () => {
  const [activeRole, setActiveRole] = useState<"employee" | "manager">("employee");
  const [showRequestModal, setShowRequestModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-corporate-blue-50 via-background to-corporate-green-50 dark:from-corporate-gray-900 dark:via-background dark:to-corporate-gray-800 transition-colors duration-300">
      <Header 
        activeRole={activeRole} 
        onRoleChange={setActiveRole} 
        onNewRequest={() => setShowRequestModal(true)} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-corporate-gray-900 dark:text-white mb-2 transition-colors duration-300">
            {activeRole === "employee" ? "Mon espace" : "Gestion d'équipe"}
          </h1>
          <p className="text-corporate-gray-600 dark:text-corporate-gray-400 transition-colors duration-300">
            {activeRole === "employee" ? "Gérez vos congés en quelques clics" : "Validez et planifiez les absences de votre équipe"}
          </p>
        </div>

        <Tabs 
          value={activeRole} 
          onValueChange={value => setActiveRole(value as "employee" | "manager")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white dark:bg-corporate-gray-800 border border-corporate-gray-200 dark:border-corporate-gray-700 transition-colors duration-300">
            <TabsTrigger 
              value="employee" 
              className="flex items-center gap-2 data-[state=active]:bg-corporate-blue-50 dark:data-[state=active]:bg-corporate-blue-900 data-[state=active]:text-corporate-blue-700 dark:data-[state=active]:text-corporate-blue-300 transition-colors duration-300"
            >
              <Clock className="h-4 w-4" />
              Employé
            </TabsTrigger>
            <TabsTrigger 
              value="manager" 
              className="flex items-center gap-2 data-[state=active]:bg-corporate-blue-50 dark:data-[state=active]:bg-corporate-blue-900 data-[state=active]:text-corporate-blue-700 dark:data-[state=active]:text-corporate-blue-300 transition-colors duration-300"
            >
              <Users className="h-4 w-4" />
              Manager
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employee" className="mt-0">
            <EmployeeDashboard onNewRequest={() => setShowRequestModal(true)} />
          </TabsContent>

          <TabsContent value="manager" className="mt-0">
            <ManagerDashboard />
          </TabsContent>
        </Tabs>
      </main>

      {showRequestModal && (
        <RequestModal onClose={() => setShowRequestModal(false)} />
      )}
    </div>
  );
};

export default Index;