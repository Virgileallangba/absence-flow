import { Calendar, Users, ArrowLeftRight, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  initials: string;
  role: string;
  absences: Absence[];
}

interface Absence {
  id: string;
  startDate: string;
  endDate: string;
  type: "CP" | "RTT" | "Maladie";
  status: "pending" | "approved" | "rejected";
  reason?: string;
  isExchangeable?: boolean;
}

interface ExchangeProposal {
  id: string;
  from: TeamMember;
  to: TeamMember;
  dates: string;
  type: "CP" | "RTT";
  status: "pending" | "accepted" | "rejected";
  reason: string;
}

const TeamPlanningView = () => {
  const [activeTab, setActiveTab] = useState("planning");
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [exchangeProposals, setExchangeProposals] = useState<any[]>([]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      // Exemple : charger tous les profils et leurs absences
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*, absences(*)');
      if (!error && profiles) setTeamMembers(profiles);
    };
    fetchTeamMembers();
    // À compléter pour exchangeProposals si vous avez une table dédiée
  }, []);

  return (
    <div className="space-y-8">
      <Tabs defaultValue="planning" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="planning" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Planning équipe</span>
          </TabsTrigger>
          <TabsTrigger value="exchanges" className="flex items-center space-x-2">
            <ArrowLeftRight className="h-4 w-4" />
            <span>Échanges</span>
          </TabsTrigger>
          <TabsTrigger value="conflicts" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Conflits</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="planning" className="space-y-6">
          {/* Vue calendrier */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-corporate-gray-900 dark:text-white">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Planning de l'équipe</span>
                </div>
                <Badge variant="outline">Décembre 2024</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-4 p-4 bg-corporate-gray-50 dark:bg-corporate-gray-800/50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-corporate-gray-900 dark:text-white">{member.name}</p>
                          <p className="text-sm text-corporate-gray-600 dark:text-corporate-gray-400">{member.role}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          Voir calendrier
                        </Button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {member.absences.map((absence) => (
                          <Badge 
                            key={absence.id}
                            variant={absence.status === "approved" ? "default" : "secondary"}
                            className="flex items-center space-x-1"
                          >
                            <span>{absence.type}</span>
                            <span>•</span>
                            <span>{absence.startDate} - {absence.endDate}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Suggestions de planification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-corporate-gray-900 dark:text-white">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Suggestions de planification</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Période optimale pour les congés d'été
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Du 15 au 30 juillet : 60% de l'équipe disponible
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Équilibre de charge recommandé
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Maximum 2 personnes en congés simultanément
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exchanges" className="space-y-6">
          {/* Propositions d'échange */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-corporate-gray-900 dark:text-white">
                <div className="flex items-center space-x-2">
                  <ArrowLeftRight className="h-5 w-5" />
                  <span>Propositions d'échange</span>
                </div>
                <Button variant="outline" size="sm">
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  Nouvelle proposition
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exchangeProposals.map((proposal) => (
                  <div key={proposal.id} className="p-4 bg-corporate-gray-50 dark:bg-corporate-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={proposal.from.avatar} alt={proposal.from.name} />
                          <AvatarFallback>{proposal.from.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-corporate-gray-900 dark:text-white">
                            {proposal.from.name} → {proposal.to.name}
                          </p>
                          <p className="text-sm text-corporate-gray-600 dark:text-corporate-gray-400">
                            {proposal.dates} • {proposal.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accepter
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20">
                          <XCircle className="h-4 w-4 mr-1" />
                          Refuser
                        </Button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-corporate-gray-700 dark:text-corporate-gray-300">
                      {proposal.reason}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Jours disponibles pour échange */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-corporate-gray-900 dark:text-white">
                <Calendar className="h-5 w-5" />
                <span>Mes jours disponibles pour échange</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-corporate-gray-50 dark:bg-corporate-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-corporate-gray-900 dark:text-white">
                        15-16 Janvier 2025
                      </p>
                      <p className="text-sm text-corporate-gray-600 dark:text-corporate-gray-400">
                        2 jours de CP
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Proposer l'échange
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-6">
          {/* Alertes de conflits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-corporate-gray-900 dark:text-white">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span>Conflits de planification</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-400 dark:border-yellow-500">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Sous-effectif critique
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    Semaine du 22 décembre : 3 personnes en congés simultanément
                  </p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-400 dark:border-red-500">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    Conflit de dates
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                    Marie et Jean ont demandé les mêmes dates (20-24 décembre)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions de résolution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-corporate-gray-900 dark:text-white">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Suggestions de résolution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Proposition de décalage
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Jean pourrait décaler ses congés au 27-31 décembre
                  </p>
                  <div className="mt-3 flex space-x-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      Proposer
                    </Button>
                    <Button size="sm" variant="outline">
                      Ignorer
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamPlanningView; 