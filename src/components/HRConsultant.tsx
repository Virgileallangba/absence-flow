import { Brain, MessageSquare, AlertTriangle, CheckCircle, XCircle, HelpCircle, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface PolicyAudit {
  id: string;
  title: string;
  status: "compliant" | "warning" | "non-compliant";
  description: string;
  recommendation: string;
}

interface HRRecommendation {
  id: string;
  type: "policy" | "employee" | "team";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  priority: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const HRConsultant = () => {
  const [activeTab, setActiveTab] = useState("audit");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Bonjour ! Je suis votre consultant RH virtuel. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date().toISOString()
    }
  ]);

  // Audit de politique
  const policyAudits: PolicyAudit[] = [
    {
      id: "a1",
      title: "Délai de prévenance des congés",
      status: "warning",
      description: "Le délai de 2 semaines est inférieur au minimum légal de 1 mois",
      recommendation: "Augmenter le délai minimum à 1 mois pour les congés principaux"
    },
    {
      id: "a2",
      title: "Fractionnement des congés",
      status: "compliant",
      description: "La politique respecte les obligations de fractionnement",
      recommendation: "Maintenir la politique actuelle"
    },
    {
      id: "a3",
      title: "Congés pour événements familiaux",
      status: "non-compliant",
      description: "Absence de dispositions pour les événements familiaux",
      recommendation: "Ajouter des jours spécifiques pour mariage, naissance, etc."
    }
  ];

  // Recommandations RH
  const recommendations: HRRecommendation[] = [
    {
      id: "r1",
      type: "employee",
      title: "Flexibilité pour Julie Martin",
      description: "Julie a un taux de satisfaction de 85% mais pourrait bénéficier de plus de télétravail",
      impact: "high",
      priority: 1
    },
    {
      id: "r2",
      type: "team",
      title: "Équilibre des congés d'été",
      description: "L'équipe marketing est sous-effectif pendant les périodes estivales",
      impact: "medium",
      priority: 2
    },
    {
      id: "r3",
      type: "policy",
      title: "Mise en place du forfait jours",
      description: "Votre structure pourrait bénéficier du forfait jours pour plus de flexibilité",
      impact: "high",
      priority: 1
    }
  ];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput,
      timestamp: new Date().toISOString()
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatInput("");

    // Simuler une réponse du chatbot
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Je vais vous aider à résoudre cette question. Pouvez-vous me donner plus de détails sur la situation ?",
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="audit" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="audit" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Audit légal</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Recommandations</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Consultation</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-6">
          {/* Résumé de l'audit */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-corporate-gray-900 dark:text-white">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
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

          {/* Points d'audit */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-corporate-gray-900 dark:text-white">
                <AlertTriangle className="h-5 w-5" />
                <span>Points d'audit</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policyAudits.map((audit) => (
                  <div key={audit.id} className="p-4 bg-corporate-gray-50 dark:bg-corporate-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-corporate-gray-900 dark:text-white">{audit.title}</p>
                        <p className="text-sm text-corporate-gray-600 dark:text-corporate-gray-400 mt-1">
                          {audit.description}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          audit.status === "compliant" ? "default" :
                          audit.status === "warning" ? "secondary" : "destructive"
                        }
                      >
                        {audit.status === "compliant" ? "Conforme" :
                         audit.status === "warning" ? "Attention" : "Non conforme"}
                      </Badge>
                    </div>
                    <div className="mt-3 p-3 bg-corporate-blue-50 dark:bg-corporate-blue-900/20 rounded-lg">
                      <p className="text-sm font-medium text-corporate-blue-800 dark:text-corporate-blue-200">
                        Recommandation
                      </p>
                      <p className="text-sm text-corporate-blue-700 dark:text-corporate-blue-300 mt-1">
                        {audit.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {/* Recommandations personnalisées */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-corporate-gray-900 dark:text-white">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Recommandations</span>
                </div>
                <Badge variant="outline">3 suggestions</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="p-4 bg-corporate-gray-50 dark:bg-corporate-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-corporate-gray-900 dark:text-white">{rec.title}</p>
                          <Badge variant="outline">
                            {rec.type === "employee" ? "Salarié" :
                             rec.type === "team" ? "Équipe" : "Politique"}
                          </Badge>
                        </div>
                        <p className="text-sm text-corporate-gray-600 dark:text-corporate-gray-400 mt-1">
                          {rec.description}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          rec.impact === "high" ? "default" :
                          rec.impact === "medium" ? "secondary" : "outline"
                        }
                      >
                        Impact {rec.impact}
                      </Badge>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm">
                        En savoir plus
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          {/* Chatbot RH */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-corporate-gray-900 dark:text-white">
                <MessageSquare className="h-5 w-5" />
                <span>Consultation RH</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-[400px] overflow-y-auto space-y-4 p-4 bg-corporate-gray-50 dark:bg-corporate-gray-800/50 rounded-lg">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-corporate-blue-600 text-white"
                            : "bg-white dark:bg-corporate-gray-700 text-corporate-gray-900 dark:text-white"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Posez votre question..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    Envoyer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions fréquentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-corporate-gray-900 dark:text-white">
                <HelpCircle className="h-5 w-5" />
                <span>Questions fréquentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-corporate-gray-50 dark:bg-corporate-gray-800/50 rounded-lg">
                  <p className="font-medium text-corporate-gray-900 dark:text-white">
                    Comment gérer un refus de congés ?
                  </p>
                  <p className="text-sm text-corporate-gray-600 dark:text-corporate-gray-400 mt-1">
                    Le refus doit être motivé et notifié dans un délai raisonnable...
                  </p>
                </div>
                <div className="p-4 bg-corporate-gray-50 dark:bg-corporate-gray-800/50 rounded-lg">
                  <p className="font-medium text-corporate-gray-900 dark:text-white">
                    Quelles sont les règles de fractionnement ?
                  </p>
                  <p className="text-sm text-corporate-gray-600 dark:text-corporate-gray-400 mt-1">
                    Les congés doivent être fractionnés en au moins deux périodes...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HRConsultant; 