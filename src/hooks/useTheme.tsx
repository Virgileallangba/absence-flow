import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authService } from "@/services/authService";
import type { Employee } from "@/lib/supabase";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: "dark" | "light";
  isLoadingTheme: boolean;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  actualTheme: "light",
  isLoadingTheme: true,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  console.log("ThemeProvider: Rendering...");

  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [actualTheme, setActualTheme] = useState<"dark" | "light">("light");
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);

  useEffect(() => {
    const loadThemePreference = async () => {
      setIsLoadingTheme(true);
      console.log("ThemeProvider useEffect: Loading theme preference...");
      try {
        const session = await authService.getCurrentSession();
        let storedTheme: Theme = defaultTheme;

        if (session?.user) {
          console.log("ThemeProvider useEffect: Fetching profile for theme preference...");
          try {
            const userProfile = await authService.getProfile(session.user.id);
            console.log("ThemeProvider useEffect: Profile loaded:", JSON.stringify(userProfile, null, 2));
            
            if (!userProfile) {
              console.log("ThemeProvider useEffect: No profile found");
            } else if (userProfile.preferred_theme) {
              storedTheme = userProfile.preferred_theme as Theme;
              console.log("ThemeProvider useEffect: Theme loaded from profile:", storedTheme);
            } else {
              console.log("ThemeProvider useEffect: No theme preference in profile, checking localStorage.");
              const localTheme = localStorage.getItem(storageKey) as Theme | null;
              if (localTheme) {
                storedTheme = localTheme;
                console.log("ThemeProvider useEffect: Theme loaded from localStorage:", storedTheme);
              } else {
                console.log("ThemeProvider useEffect: No theme preference in profile or localStorage, using default:", defaultTheme);
              }
            }
          } catch (profileError) {
            console.error("ThemeProvider useEffect: Error loading profile:", profileError);
            const localTheme = localStorage.getItem(storageKey) as Theme | null;
            storedTheme = localTheme || defaultTheme;
          }
        } else {
          console.log("ThemeProvider useEffect: No active session, checking localStorage for theme.");
          const localTheme = localStorage.getItem(storageKey) as Theme | null;
          if (localTheme) {
            storedTheme = localTheme;
            console.log("ThemeProvider useEffect: Theme loaded from localStorage (no session):", storedTheme);
          } else {
            console.log("ThemeProvider useEffect: No theme preference anywhere, using default:", defaultTheme);
          }
        }

        console.log("ThemeProvider useEffect: Setting theme state to:", storedTheme);
        setThemeState(storedTheme);
        console.log("ThemeProvider useEffect: Theme state updated.");

      } catch (error) {
        console.error("ThemeProvider useEffect: Error loading theme preference:", error);
        const localTheme = localStorage.getItem(storageKey) as Theme | null;
        setThemeState(localTheme || defaultTheme);
      } finally {
        setIsLoadingTheme(false);
        console.log("ThemeProvider useEffect: Theme loading finished.");
      }
    };

    loadThemePreference();
  }, [defaultTheme, storageKey]);

  useEffect(() => {
    console.log("ThemeProvider useEffect [theme]: Theme state changed to:", theme);
  }, [theme]);

  useEffect(() => {
    console.log("ThemeProvider useEffect [actualTheme]: Actual theme changed to:", actualTheme);
  }, [actualTheme]);

  useEffect(() => {
    console.log("ThemeProvider useEffect [theme]: Applying theme:", theme);
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = (currentTheme: Theme) => {
      root.classList.remove("light", "dark");

      let resolvedTheme: "dark" | "light";

      if (currentTheme === "system") {
        resolvedTheme = mediaQuery.matches ? "dark" : "light";
      } else {
        resolvedTheme = currentTheme;
      }

      console.log("ThemeProvider useEffect [theme]: Resolved theme:", resolvedTheme);
      root.classList.add(resolvedTheme);
      setActualTheme(resolvedTheme);

      if (!root.style.transition) {
        root.style.transition = "color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease";
      }

      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          "content",
          resolvedTheme === "dark" ? "#1a1a1a" : "#ffffff"
        );
      }
    };

    updateTheme(theme);

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        updateTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  const setTheme = useCallback(async (newTheme: Theme) => {
      console.log("ThemeProvider useCallback setTheme: Called with:", newTheme);
      setThemeState(newTheme);
      console.log("ThemeProvider useCallback setTheme: State updated to:", newTheme);
      localStorage.setItem(storageKey, newTheme);

      try {
          const session = await authService.getCurrentSession();
          if (session?.user) {
              console.log("ThemeProvider useCallback setTheme: Saving theme preference to profile...");
              await authService.updateProfile(session.user.id, { preferred_theme: newTheme });
              console.log("ThemeProvider useCallback setTheme: Theme preference saved to profile.");
          }
      } catch (error) {
          console.error("ThemeProvider useCallback setTheme: Error saving theme preference to profile:", error);
      }

  }, [storageKey]);

  const value = {
    theme,
    actualTheme,
    setTheme,
    isLoadingTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
