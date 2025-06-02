import { useEffect, useState } from "react";
import ExecutiveDashboardHeader from "@/components/ExecutiveDashboardHeader";
import PremiumLeaveBalanceCard from "@/components/PremiumLeaveBalanceCard";
import PremiumQuickRequestCard from "@/components/PremiumQuickRequestCard";
import EnhancedRequestHistory from "@/components/EnhancedRequestHistory";
import PremiumStatsGrid from "@/components/PremiumStatsGrid";
import { absenceService } from "@/services/absenceService";
import { authService } from "@/services/authService";
import { useToast } from "@/components/ui/use-toast";
import type { Absence } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";

interface EmployeeDashboardProps {
  onNewRequest: () => void;
}

const EmployeeDashboard = ({ onNewRequest }: EmployeeDashboardProps) => {
  const { toast } = useToast();
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaveBalances, setLeaveBalances] = useState<any[]>([]);

  useEffect(() => {
    const fetchAbsences = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (session?.user) {
          const data = await absenceService.getEmployeeAbsences(session.user.id);
          setAbsences(data);
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger l'historique des demandes.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchBalances = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (session?.user) {
          const { data, error } = await supabase
            .from('leave_balances')
            .select('*')
            .eq('employee_id', session.user.id);
          if (!error && data) setLeaveBalances(data);
        }
      } catch (e) {
        // Optionnel : afficher une erreur
      }
    };

    fetchAbsences();
    fetchBalances();
  }, [toast]);

  const formatAbsenceForHistory = (absence: Absence) => {
    const startDate = new Date(absence.start_date);
    const endDate = new Date(absence.end_date);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return {
      date: `${startDate.toLocaleDateString('fr-FR')} - ${endDate.toLocaleDateString('fr-FR')}`,
      type: absence.type,
      days,
      status: absence.status,
      canModify: absence.status === 'pending',
      progress: absence.status === 'pending' ? 60 : absence.status === 'approved' ? 100 : 0
    };
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Executive Header */}
      <ExecutiveDashboardHeader
        title="Mon espace personnel"
        subtitle="Gérez vos congés avec intelligence et simplicité. Planifiez, suivez et optimisez vos absences en temps réel."
      />

      {/* Leave Balances - Premium Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-display-sm text-corporate-gray-900 dark:text-white transition-colors duration-300">Soldes de congés</h2>
            <p className="text-body-md text-corporate-gray-600 dark:text-corporate-gray-400 mt-1 transition-colors duration-300">Vue d'ensemble de vos jours disponibles</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leaveBalances.map((balance, index) => (
            <PremiumLeaveBalanceCard 
              key={index} 
              balance={balance}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` } as React.CSSProperties}
            />
          ))}
        </div>
      </section>

      {/* Premium Quick Request */}
      <section>
        <PremiumQuickRequestCard onNewRequest={onNewRequest} />
      </section>

      {/* Enhanced Request History */}
      <section>
        {loading ? (
          <div className="text-center py-8">Chargement de l'historique...</div>
        ) : (
          <EnhancedRequestHistory requests={absences.map(formatAbsenceForHistory)} />
        )}
      </section>

      {/* Premium Statistics Grid */}
      <section>
        <PremiumStatsGrid />
      </section>
    </div>
  );
};

export default EmployeeDashboard;
