import { createClient, AuthError, PostgrestError } from '@supabase/supabase-js';
import type { Employee } from '@/lib/supabase';
import type { Session, AuthResponse } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Les variables d\'environnement Supabase ne sont pas définies');
}

// Création d'une seule instance de Supabase
let supabaseInstance: ReturnType<typeof createClient> | null = null;

const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};

const supabase = getSupabaseClient();

interface SignUpData {
  full_name: string;
  department: string;
  role: 'employee' | 'manager';
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface RetryError extends Error {
  status?: number;
  message?: string;
}

const getErrorMessage = (error: RetryError): string => {
  if (error.status === 429) {
    return "Trop de tentatives. Veuillez réessayer dans quelques instants.";
  }
  
  if (error.message?.includes('email')) {
    return "Cette adresse email est déjà utilisée.";
  }
  
  if (error.message?.includes('password')) {
    return "Le mot de passe doit contenir au moins 6 caractères.";
  }
  
  if (error.message?.includes('network')) {
    return "Erreur de connexion. Veuillez vérifier votre connexion internet.";
  }
  
  return "Une erreur est survenue lors de l'inscription. Veuillez réessayer.";
};

const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: RetryError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as RetryError;
      
      if (lastError.status === 429 && i < maxRetries - 1) {
        await delay(delayMs * Math.pow(2, i));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
};

// Mettre à jour l'interface Employee pour inclure les nouveaux champs de paramètres
export interface Employee {
  id: string;
  email: string;
  full_name: string;
  department: string;
  role: 'employee' | 'manager';
  avatar_url: string | null; // Ajouter si ce champ existe déjà ou est prévu
  created_at: string;
  updated_at: string | null; // Ajouter si ce champ existe déjà ou est prévu
  // Nouveaux champs pour les paramètres
  enable_in_app_notifications: boolean;
  enable_email_notifications: boolean;
  preferred_theme: string; // 'light', 'dark', 'system'
}

export const authService = {
  // Inscription d'un nouvel utilisateur
  async signUp(email: string, password: string, userData: SignUpData) {
    try {
      console.log("Starting Supabase auth signUp..."); // Log
      const { data: authData, error: authError } = await retryOperation<AuthResponse>(() =>
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: userData.role,
            },
          },
        })
      );
      console.log("Supabase auth signUp finished.", { authData, authError }); // Log

      if (authError) {
        console.error("Supabase Auth signUp error:", authError); // Log détaillé de l'erreur Auth
        throw new Error(getErrorMessage(authError as RetryError));
      }

      if (authData.user) {
        console.log("User created by auth.signUp:", authData.user.id); // Log

        // Explicitly get user session to ensure auth.uid() is available for RLS
        console.log("Fetching authenticated user after signUp..."); // Log
        const { data: userSessionData, error: userSessionError } = await supabase.auth.getUser();
        console.log("Authenticated user data:", { userSessionData, userSessionError }); // Log

        if (userSessionError) {
            console.error("Error fetching user session after signUp:", userSessionError); // Log
            // Continue anyway, but log the issue
        }

        if (!userSessionData?.user || userSessionData.user.id !== authData.user.id) {
            console.warn("Authenticated user ID mismatch or user not found after signUp.", { signedUpUserId: authData.user.id, sessionUserId: userSessionData?.user?.id }); // Log
            // This could indicate a problem with the session or RLS timing
        }

        // Création du profil avec retry - Simplifiée
        console.log("Creating user profile in 'employees' table..."); // Log
        const { error: profileError } = await retryOperation(() =>
          supabase
            .from('employees')
            .insert([
              {
                id: authData.user.id, // Should match auth.uid() based on RLS policy
                email: email,
                full_name: userData.full_name,
                department: userData.department,
                role: userData.role,
                created_at: new Date().toISOString(),
              }
            ])
        );

        if (profileError) {
          console.error("Error inserting profile into 'employees':", profileError); // Log détaillé de l'erreur d'insertion
          if ((profileError as any).details) {
               console.error("Supabase insert error details:", (profileError as any).details); // Log des détails
          }
          if ((profileError as any).hint) {
               console.error("Supabase insert error hint:", (profileError as any).hint); // Log du hint
          }
          // Vérifier si l'erreur est due à une contrainte unique (email ou ID) si le profil a déjà été créé mais la session est perdue
          if ((profileError as any).code === '23505') { // Code d'erreur pour violation de contrainte unique
               console.warn("Possible duplicate key error, profile might already exist.", profileError); // Log
               // Potential scenario: user created, but profile insertion failed on first try, then retried and hit unique constraint
               // Or user already exists with this email/ID
                throw new Error("Le profil utilisateur existe déjà ou une erreur de base de données est survenue.");
          }

          throw new Error("Erreur lors de la création du profil. Veuillez réessayer.");
        }
        console.log("User profile created successfully."); // Log
      }

      return authData;
    } catch (error) {
      const retryError = error as RetryError;
      console.error("Error during overall signUp process:", retryError); // Log
      throw new Error(getErrorMessage(retryError));
    }
  },

  // Connexion
  async signIn(email: string, password: string) {
    try {
      console.log("Starting Supabase auth signIn..."); // Log
      const { data, error } = await retryOperation<AuthResponse>(() =>
        supabase.auth.signInWithPassword({
          email,
          password,
        })
      );
      console.log("Supabase auth signIn finished.", { data, error }); // Log

      if (error) {
         console.error("Supabase Auth signIn error:", error); // Log détaillé de l'erreur Auth
        throw new Error(getErrorMessage(error as RetryError));
      }

      // Vérification immédiate du profil après connexion
      if (data.user) {
        console.log("User signed in, checking profile..."); // Log
        const profile = await this.getProfile(data.user.id);
        if (!profile) {
          console.log("Profile not found after sign-in, attempting to create default..."); // Log
          // Si le profil n'existe pas, on vérifie d'abord si l'utilisateur vient de s'inscrire
          const { data: authData } = await supabase.auth.getUser(); // Get fresh user data
          const roleFromMetadata = authData?.user?.user_metadata?.role || 'employee'; // Utiliser le rôle des metadata ou 'employee'

          console.log("Creating default profile..."); // Log
          const { error: insertError } = await supabase
            .from('employees')
            .insert([
              {
                id: data.user.id,
                email: data.user.email,
                full_name: data.user.email?.split('@')[0] || 'Utilisateur',
                department: 'Non spécifié',
                role: roleFromMetadata,
                created_at: new Date().toISOString(),
              }
            ]);

          if (insertError) {
            console.error("Error creating default profile after sign-in:", insertError); // Log détaillé de l'erreur
             if ((insertError as any).details) {
               console.error("Supabase insert error details (default profile):", (insertError as any).details); // Log des détails
            }
            if ((insertError as any).hint) {
               console.error("Supabase insert error hint (default profile):", (insertError as any).hint); // Log du hint
            }
             // Vérifier si l'erreur est due à une contrainte unique (email ou ID)
            if ((insertError as any).code === '23505') { // Code d'erreur pour violation de contrainte unique
                console.warn("Possible duplicate key error creating default profile.", insertError); // Log
                // If profile already exists, just log and continue (it means profile was created earlier)
            } else {
                 // For other errors, re-throw
                throw new Error("Erreur lors de la création du profil par défaut.");
            }

          } else {
              console.log("Default profile created successfully after sign-in."); // Log
          }
        }
        console.log("Profile check/creation finished after sign-in."); // Log
      }

      return data;
    } catch (error) {
      const retryError = error as RetryError;
      console.error("Error during overall signIn process:", retryError); // Log
      throw new Error(getErrorMessage(retryError));
    }
  },

  // Déconnexion
  async signOut() {
    console.log("Starting Supabase signOut..."); // Log
    const { error } = await supabase.auth.signOut();
    console.log("Supabase signOut finished.", { error }); // Log
    if (error) {
       console.error("Supabase signOut error:", error); // Log
       throw new Error("Erreur lors de la déconnexion.");
    }
     console.log("User signed out successfully."); // Log
  },

  // Récupérer le profil de l'utilisateur (incluant les paramètres)
  async getProfile(userId: string): Promise<Employee | null> {
     console.log("Fetching profile for user ID:", userId); // Log
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*, enable_in_app_notifications, enable_email_notifications, preferred_theme')
        .eq('id', userId)
        .single();
       console.log("Supabase getProfile finished.", { data, error }); // Log

      if (error) {
        if (error.code === 'PGRST116') {
          // Table non trouvée ou aucun enregistrement trouvé pour single()
             console.warn('Profil non trouvé pour l\'utilisateur:', userId, error); // Log avec erreur
             return null;
        }
        console.error("Error fetching profile:", error); // Log
        throw new Error("Erreur lors de la récupération du profil.");
      }
      console.log("Profile found:", data); // Log
      return data as Employee; // S'assurer que les données correspondent à l'interface
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error); // Log
      return null;
    }
  },

  // Mettre à jour le profil (incluant les paramètres)
  async updateProfile(userId: string, updates: Partial<Employee>) {
    console.log("Updating profile for user ID:", userId, "with updates:", updates); // Log
    const { data, error } = await supabase
      .from('employees')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    console.log("Supabase updateProfile finished.", { data, error }); // Log

    if (error) {
       console.error("Error updating profile:", error); // Log
       throw new Error("Erreur lors de la mise à jour du profil.");
    }
    console.log("Profile updated successfully:", data); // Log
    return data as Employee;
  },

  // Vérifier la session actuelle
  async getCurrentSession() {
    console.log("Checking current session..."); // Log
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log("Supabase getSession finished.", { session, error }); // Log
    if (error) {
      console.error("Supabase getSession error:", error); // Log
      throw new Error("Erreur lors de la vérification de la session.");
    }
     console.log("Current session:", session); // Log
    return session;
  },

  // S'abonner aux changements d'authentification
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
     console.log("Subscribing to auth state changes..."); // Log
    const { data: listener } = supabase.auth.onAuthStateChange(callback);
     // Log the listener? Might be too verbose.
    return listener;
  }
}; 