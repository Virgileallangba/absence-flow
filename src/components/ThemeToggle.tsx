import { Monitor, Moon, Sun, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/useTheme";

const ThemeToggle = () => {
  const { theme, setTheme, actualTheme } = useTheme();

  console.log("ThemeToggle: Render - Current theme from hook:", theme);

  const themes = [
    {
      value: "light" as const,
      label: "Clair",
      icon: Sun,
      description: "Mode clair"
    },
    {
      value: "dark" as const,
      label: "Sombre", 
      icon: Moon,
      description: "Mode sombre"
    },
    {
      value: "system" as const,
      label: "Système",
      icon: Monitor,
      description: "Suit les préférences système"
    }
  ];

  const currentTheme = themes.find(t => t.value === theme);
  const CurrentIcon = currentTheme?.icon || Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 w-auto min-w-[120px] px-3 transition-all duration-200 hover:shadow-md border-corporate-gray-200 dark:border-corporate-gray-700"
        >
          <CurrentIcon className="h-4 w-4 mr-2 transition-transform duration-200" />
          <span className="font-medium">{currentTheme?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white dark:bg-corporate-gray-800 border-corporate-gray-200 dark:border-corporate-gray-700 shadow-lg z-50 animate-in fade-in-0 zoom-in-95"
        sideOffset={8}
      >
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          const isSelected = theme === themeOption.value;
          
          console.log(`ThemeToggle: Option ${themeOption.value}, isSelected: ${isSelected}, currentTheme: ${theme}`);
          
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => {
                console.log("ThemeToggle: Calling setTheme with:", themeOption.value);
                setTheme(themeOption.value);
              }}
              className="flex items-center gap-3 cursor-pointer px-3 py-2.5 hover:bg-corporate-gray-50 dark:hover:bg-corporate-gray-700 focus:bg-corporate-gray-50 dark:focus:bg-corporate-gray-700 transition-colors duration-150"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`p-1.5 rounded-md transition-colors duration-150 ${
                  isSelected 
                    ? 'bg-corporate-blue-100 dark:bg-corporate-blue-900' 
                    : 'bg-corporate-gray-100 dark:bg-corporate-gray-700'
                }`}>
                  <Icon className={`h-4 w-4 transition-colors duration-150 ${
                    isSelected 
                      ? 'text-corporate-blue-600 dark:text-corporate-blue-400' 
                      : 'text-corporate-gray-600 dark:text-corporate-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-corporate-gray-900 dark:text-white">
                    {themeOption.label}
                  </div>
                  <div className="text-xs text-corporate-gray-500 dark:text-corporate-gray-400">
                    {themeOption.description}
                  </div>
                </div>
              </div>
              {isSelected && (
                <Check className="h-4 w-4 text-corporate-blue-600 dark:text-corporate-blue-400 transition-opacity duration-150" />
              )}
            </DropdownMenuItem>
          );
        })}
        
        {theme === "system" && (
          <div className="border-t border-corporate-gray-200 dark:border-corporate-gray-700 mt-1 pt-2 px-3 pb-2">
            <div className="text-xs text-corporate-gray-500 dark:text-corporate-gray-400 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                actualTheme === 'dark' 
                  ? 'bg-corporate-gray-800 dark:bg-white' 
                  : 'bg-yellow-400'
              }`} />
              Actuellement: {actualTheme === 'dark' ? 'Sombre' : 'Clair'}
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
