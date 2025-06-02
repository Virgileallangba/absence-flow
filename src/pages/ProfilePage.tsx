import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/lib/supabase";
import type { Employee } from "@/lib/supabase";
import AvatarUploader from "@/components/AvatarUploader";

type EmployeeRow = Database['public']['Tables']['employees']['Row'];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<Employee>>({});

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (session?.user) {
          const userProfile = await authService.getProfile(session.user.id);
          setProfile(userProfile);
          setEditedProfile(userProfile);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger votre profil.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [toast]);

  const handleSave = async () => {
    if (!profile) return;

    try {
      const updatedProfile = await authService.updateProfile(profile.id, editedProfile);
      setProfile(updatedProfile);
      setIsEditing(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil.",
        variant: "destructive",
      });
    }
  };

  const handleAvatarUpdate = (newUrl: string) => {
    if (profile) {
      const updatedProfile: Employee = {
        ...profile,
        avatar_url: newUrl,
        enable_email_notifications: profile.enable_email_notifications ?? true,
        enable_in_app_notifications: profile.enable_in_app_notifications ?? true,
        preferred_theme: profile.preferred_theme ?? "system"
      };
      setProfile(updatedProfile);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-corporate-gray-900">
        <Header
          activeRole={(profile?.role as "employee" | "manager") || "employee"}
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
        activeRole={(profile?.role as "employee" | "manager") || "employee"}
        onRoleChange={() => {}}
        onNewRequest={() => {}}
      />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-corporate-gray-900 dark:text-white mb-6">
          Profil
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {profile && (
              <div className="flex justify-center mb-6">
                <AvatarUploader
                  userId={profile.id}
                  currentAvatarUrl={profile.avatar_url ?? null}
                  fullName={profile.full_name}
                  onAvatarUpdate={handleAvatarUpdate}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                {isEditing ? (
                  <Input
                    id="fullName"
                    value={editedProfile.full_name}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, full_name: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-corporate-gray-700 dark:text-corporate-gray-300">
                    {profile?.full_name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <p className="text-corporate-gray-700 dark:text-corporate-gray-300">
                  {profile?.email}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Département</Label>
                {isEditing ? (
                  <Input
                    id="department"
                    value={editedProfile.department}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, department: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-corporate-gray-700 dark:text-corporate-gray-300">
                    {profile?.department}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <p className="text-corporate-gray-700 dark:text-corporate-gray-300">
                  {profile?.role === "manager" ? "Manager" : "Employé"}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedProfile(profile || {});
                    }}
                  >
                    Annuler
                  </Button>
                  <Button onClick={handleSave}>Enregistrer</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Modifier</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfilePage; 