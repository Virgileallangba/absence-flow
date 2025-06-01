import { useEffect, useState } from "react";
import Header from "@/components/Header";
import RequestModal from "@/components/RequestModal";
import EmployeeDashboard from "@/components/EmployeeDashboard";
import ManagerDashboard from "@/components/ManagerDashboard";
import { authService } from "@/services/authService";

const DashboardPage = () => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [activeRole, setActiveRole] = useState<"employee" | "manager" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      setLoading(true);
      try {
        const session = await authService.getCurrentSession();
        if (session?.user) {
          const profile = await authService.getProfile(session.user.id);
          setActiveRole(profile.role);
        }
      } catch (e) {
        setActiveRole("employee"); // fallback
      }
      setLoading(false);
    };
    fetchRole();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-corporate-gray-900">
      <Header
        activeRole={activeRole || "employee"}
        onRoleChange={setActiveRole}
        onNewRequest={() => setShowRequestModal(true)}
      />

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div>Chargement...</div>
        ) : activeRole === "manager" ? (
          <ManagerDashboard />
        ) : (
          <EmployeeDashboard onNewRequest={() => setShowRequestModal(true)} />
        )}
      </main>

      {showRequestModal && (
        <RequestModal onClose={() => setShowRequestModal(false)} />
      )}
    </div>
  );
};

export default DashboardPage; 