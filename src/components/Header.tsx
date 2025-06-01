import { Bell, Plus, User, LogOut, Settings, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import type { Employee } from "@/lib/supabase";

interface HeaderProps {
  activeRole: "employee" | "manager";
  onRoleChange: (role: "employee" | "manager") => void;
  onNewRequest: () => void;
}

const Header = ({
  activeRole,
  onRoleChange,
  onNewRequest
}: HeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<Employee | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (session?.user) {
          const profile = await authService.getProfile(session.user.id);
          setUser(profile);
          onRoleChange(profile.role);
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'authentification:", error);
      }
    };

    initializeAuth();

    const { data: authListener } = authService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await authService.getProfile(session.user.id);
        setUser(profile);
        onRoleChange(profile.role);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate, onRoleChange]);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-white dark:bg-corporate-gray-800 border-b border-corporate-gray-200 dark:border-corporate-gray-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between bg-white dark:bg-corporate-gray-800 transition-colors duration-300">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
            <img
              src="/logo.png"
              alt="Logo AbsenceFlow"
              className="h-8 w-auto min-w-[48px] object-contain"
            />
            <h1 className="text-2xl font-bold text-corporate-gray-900 dark:text-white transition-colors duration-300"></h1>
          </Link>
          <Badge variant="outline" className="dark:bg-corporate-green-900 text-corporate-green-700 dark:text-corporate-green-300 border-corporate-green-200 dark:border-corporate-green-800 transition-colors duration-300 bg-lime-500">
            PME Edition
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          {activeRole === "manager" && (
            <Button onClick={() => navigate("/analytics")} variant="ghost" className="text-corporate-gray-600 dark:text-corporate-gray-300 hover:text-corporate-blue-600 dark:hover:text-corporate-blue-400 transition-colors duration-300">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          )}

          {activeRole === "employee" && (
            <Button onClick={onNewRequest} size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-300">
              <Plus className="h-3 w-3 mr-1" />
              Nouvelle demande
            </Button>
          )}

          <Button variant="ghost" size="icon" className="relative text-corporate-gray-600 dark:text-corporate-gray-300 hover:text-corporate-gray-900 dark:hover:text-white transition-colors duration-300">
            <Bell className="h-5 w-5" />
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              3
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-corporate-gray-100 dark:hover:bg-corporate-gray-700 transition-colors duration-300">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar_url || "/placeholder.svg"} alt={user?.full_name || "User"} />
                  <AvatarFallback>{user?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white dark:bg-corporate-gray-800 border-corporate-gray-200 dark:border-corporate-gray-700 shadow-lg z-50 transition-colors duration-300" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-corporate-gray-900 dark:text-white transition-colors duration-300">
                    {user?.full_name || 'Utilisateur'}
                  </p>
                  <p className="text-xs leading-none text-corporate-gray-600 dark:text-corporate-gray-400 transition-colors duration-300">
                    {user?.email || 'email@exemple.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-corporate-gray-200 dark:bg-corporate-gray-700" />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center cursor-pointer text-corporate-gray-900 dark:text-white hover:bg-corporate-gray-50 dark:hover:bg-corporate-gray-700 transition-colors duration-300">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center cursor-pointer text-corporate-gray-900 dark:text-white hover:bg-corporate-gray-50 dark:hover:bg-corporate-gray-700 transition-colors duration-300">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-corporate-gray-200 dark:bg-corporate-gray-700" />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-corporate-gray-900 dark:text-white hover:bg-corporate-gray-50 dark:hover:bg-corporate-gray-700 transition-colors duration-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;