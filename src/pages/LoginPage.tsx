import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import AuthModal from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (session?.user) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la session:", error);
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-corporate-gray-900 dark:to-corporate-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img
            src="/logo.png"
            alt="Logo AbsenceFlow"
            className="mx-auto h-16 w-auto"
          />
          <h1 className="mt-6 text-3xl font-bold text-corporate-gray-900 dark:text-white">
            Bienvenue sur AbsenceFlow
          </h1>
          <p className="mt-2 text-sm text-corporate-gray-600 dark:text-corporate-gray-400">
            Gérez vos absences et congés en toute simplicité
          </p>
        </div>

        <Card className="bg-white/80 dark:bg-corporate-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">Commencer</CardTitle>
            <CardDescription className="text-center">
              Connectez-vous ou créez un compte pour accéder à l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Se connecter / S'inscrire
            </Button>
          </CardContent>
        </Card>

        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}
      </div>
    </div>
  );
};

export default LoginPage; 