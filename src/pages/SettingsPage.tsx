import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/services/authService";
import ThemeToggle from "@/components/ThemeToggle";
import type { Employee } from "@/lib/supabase";

const SettingsPage = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [enableInAppNotifications, setEnableInAppNotifications] = useState(true);
  const [enableEmailNotifications, setEnableEmailNotifications] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      console.log("SettingsPage: Loading settings...");
      try {
        const session = await authService.getCurrentSession();
        if (session?.user) {
          const userProfile = await authService.getProfile(session.user.id);
          if (userProfile) {
            console.log("SettingsPage: Profile loaded.", userProfile);
            setProfile(userProfile);
            setEnableInAppNotifications(userProfile.enable_in_app_notifications ?? true);
            setEnableEmailNotifications(userProfile.enable_email_notifications ?? true);
          }
        } else {
           console.log("SettingsPage: No active session found.");
        }
      } catch (error) {
        console.error("SettingsPage: Erreur lors du chargement des paramètres:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos paramètres.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        console.log("SettingsPage: Loading finished.");
      }
    };

    loadSettings();
  }, [toast]);

  const handleSaveSettings = async () => {
    if (!profile) {
      console.warn("SettingsPage: Attempted to save settings without profile.");
      return;
    }

    setIsSaving(true);
    console.log("SettingsPage: Saving settings...");

    try {
      const updatedProfile = await authService.updateProfile(profile.id, {
        enable_in_app_notifications: enableInAppNotifications,
        enable_email_notifications: enableEmailNotifications,
      });
      console.log("SettingsPage: Profile updated successfully.", updatedProfile);
      setProfile(updatedProfile);
      toast({
        title: "Paramètres sauvegardés",
        description: "Vos préférences ont été mises à jour.",
      });
    } catch (error) {
      console.error("SettingsPage: Erreur lors de la sauvegarde des paramètres:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos paramètres.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      console.log("SettingsPage: Saving finished.");
    }
  };

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
          Paramètres
        </h1>

        <div className="grid gap-6">
          {/* Apparence */}
          <Card>
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Thème</Label>
                    <p className="text-sm text-corporate-gray-500 dark:text-corporate-gray-400">
                      Choisissez le thème de l'application
                    </p>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications in-app</Label>
                    <p className="text-sm text-corporate-gray-500 dark:text-corporate-gray-400">
                      Recevoir des notifications dans l'application
                    </p>
                  </div>
                  <Switch
                    checked={enableInAppNotifications}
                    onCheckedChange={setEnableInAppNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications par email</Label>
                    <p className="text-sm text-corporate-gray-500 dark:text-corporate-gray-400">
                      Recevoir des notifications par email
                    </p>
                  </div>
                  <Switch
                    checked={enableEmailNotifications}
                    onCheckedChange={setEnableEmailNotifications}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-corporate-blue-600 hover:bg-corporate-blue-700 text-white"
          >
            {isSaving ? "Sauvegarde..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage; 