import { Shield, FileCheck, Download, AlertTriangle, CheckCircle, XCircle, ClipboardList, FileText, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface ComplianceCheck {
  id: string;
  category: string;
  status: "compliant" | "warning" | "non-compliant";
  description: string;
  requirement: string;
  evidence: string;
}

interface AuditSimulation {
  id: string;
  title: string;
  status: "passed" | "failed" | "in-progress";
  date: string;
  findings: {
    type: "success" | "warning" | "error";
    description: string;
  }[];
}

interface RequiredRegister {
  id: string;
  name: string;
  type: "rgpd" | "travail" | "santé";
  lastUpdate: string;
  status: "up-to-date" | "outdated" | "missing";
  items: number;
}

const ComplianceDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Vérifications de conformité
  const complianceChecks: ComplianceCheck[] = [
    {
      id: "c1",
      category: "Registre des congés",
      status: "compliant",
      description: "Registre à jour avec toutes les informations requises",
      requirement: "Article L3141-1 du Code du travail",
      evidence: "Registre des congés 2024.pdf"
    },
    {
      id: "c2",
      category: "Consentement RGPD",
      status: "warning",
      description: "Mise à jour nécessaire des mentions de consentement",
      requirement: "Article 7 du RGPD",
      evidence: "Formulaire de consentement.docx"
    },
    {
      id: "c3",
      category: "Registre des accidents",
      status: "non-compliant",
      description: "Registre manquant pour le trimestre en cours",
      requirement: "Article L441-2 du Code de la sécurité sociale",
      evidence: "À compléter"
    }
  ];

  // Simulations d'audit
  const auditSimulations: AuditSimulation[] = [
    {
      id: "a1",
      title: "Contrôle Inspection du Travail",
      status: "passed",
      date: "15/12/2024",
      findings: [
        {
          type: "success",
          description: "Registre des congés conforme"
        },
        {
          type: "warning",
          description: "Délais de réponse à améliorer"
        }
      ]
    },
    {
      id: "a2",
      title: "Audit RGPD",
      status: "in-progress",
      date: "En cours",
      findings: [
        {
          type: "error",
          description: "Mentions légales à mettre à jour"
        }
      ]
    }
  ];

  // Registres obligatoires
  const requiredRegisters: RequiredRegister[] = [
    {
      id: "r1",
      name: "Registre des congés",
      type: "travail",
      lastUpdate: "01/12/2024",
      status: "up-to-date",
      items: 156
    },
    {
      id: "r2",
      name: "Registre des traitements",
      type: "rgpd",
      lastUpdate: "15/11/2024",
      status: "outdated",
      items: 23
    },
    {
      id: "r3",
      name: "Registre des accidents",
      type: "santé",
      lastUpdate: "Non renseigné",
      status: "missing",
      items: 0
    }
  ];

  return (
    <div className="space-y-8">
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Conformité</span>
          </TabsTrigger>
          <TabsTrigger value="simulation" className="flex items-center space-x-2">
            <FileCheck className="h-4 w-4" />
            <span>Simulation</span>
          </TabsTrigger>
          <TabsTrigger value="registers" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Registres</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* État de conformité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-corporate-gray-900 dark:text-white">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>État de conformité</span>
                </div>
                <Badge variant="secondary">3 points à améliorer</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">Conforme</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">8</p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Attention</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">2</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">Non conforme</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">1</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vérifications de conformité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-corporate-gray-900 dark:text-white">
                <ClipboardList className="h-5 w-5" />
                <span>Vérifications de conformité</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceChecks.map((check) => (
                  <div key={check.id} className="p-4 bg-corporate-gray-50 dark:bg-corporate-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-corporate-gray-900 dark:text-white">
                            {check.category}
                          </p>
                          <Badge 
                            variant={
                              check.status === "compliant" ? "default" :
                              check.status === "warning" ? "secondary" : "destructive"
                            }
                          >
                            {check.status === "compliant" ? "Conforme" :
                             check.status === "warning" ? "Attention" : "Non conforme"}
                          </Badge>
                        </div>
                        <p className="text-sm text-corporate-gray-600 dark:text-corporate-gray-400 mt-1">
                          {check.description}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Search className="h-4 w-4 mr-2" />
                        Voir le justificatif
                      </Button>
                    </div>
                    <div className="mt-3 p-3 bg-corporate-blue-50 dark:bg-corporate-blue-900/20 rounded-lg">
                      <p className="text-sm font-medium text-corporate-blue-800 dark:text-corporate-blue-200">
                        Base légale
                      </p>
                      <p className="text-sm text-corporate-blue-700 dark:text-corporate-blue-300 mt-1">
                        {check.requirement}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulation" className="space-y-6">
          {/* Mode audit */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-corporate-gray-900 dark:text-white">
                <div className="flex items-center space-x-2">
                  <FileCheck className="h-5 w-5" />
                  <span>Mode audit</span>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter tous les justificatifs
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditSimulations.map((simulation) => (
                  <div key={simulation.id} className="p-4 bg-corporate-gray-50 dark:bg-corporate-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-corporate-gray-900 dark:text-white">
                            {simulation.title}
                          </p>
                          <Badge 
                            variant={
                              simulation.status === "passed" ? "default" :
                              simulation.status === "failed" ? "destructive" : "secondary"
                            }
                          >
                            {simulation.status === "passed" ? "Réussi" :
                             simulation.status === "failed" ? "Échoué" : "En cours"}
                          </Badge>
                        </div>
                        <p className="text-sm text-corporate-gray-600 dark:text-corporate-gray-400">
                          Date: {simulation.date}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Lancer la simulation
                      </Button>
                    </div>
                    <div className="mt-3 space-y-2">
                      {simulation.findings.map((finding, index) => (
                        <div 
                          key={index}
                          className={`p-2 rounded-lg ${
                            finding.type === "success" ? "bg-green-50 dark:bg-green-900/20" :
                            finding.type === "warning" ? "bg-yellow-50 dark:bg-yellow-900/20" :
                            "bg-red-50 dark:bg-red-900/20"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {finding.type === "success" ? <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" /> :
                             finding.type === "warning" ? <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" /> :
                             <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />}
                            <p className="text-sm text-corporate-gray-900 dark:text-white">
                              {finding.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registers" className="space-y-6">
          {/* Registres obligatoires */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-corporate-gray-900 dark:text-white">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Registres obligatoires</span>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter tous les registres
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requiredRegisters.map((register) => (
                  <div key={register.id} className="p-4 bg-corporate-gray-50 dark:bg-corporate-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-corporate-gray-900 dark:text-white">
                            {register.name}
                          </p>
                          <Badge variant="outline">
                            {register.type === "rgpd" ? "RGPD" :
                             register.type === "travail" ? "Travail" : "Santé"}
                          </Badge>
                          <Badge 
                            variant={
                              register.status === "up-to-date" ? "default" :
                              register.status === "outdated" ? "secondary" : "destructive"
                            }
                          >
                            {register.status === "up-to-date" ? "À jour" :
                             register.status === "outdated" ? "Mise à jour nécessaire" : "Manquant"}
                          </Badge>
                        </div>
                        <p className="text-sm text-corporate-gray-600 dark:text-corporate-gray-400 mt-1">
                          Dernière mise à jour: {register.lastUpdate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-corporate-gray-600 dark:text-corporate-gray-400">
                          {register.items} entrées
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Consulter
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceDashboard; 