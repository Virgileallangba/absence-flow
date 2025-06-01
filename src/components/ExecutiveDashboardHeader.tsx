import { Eye, Settings, BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface ExecutiveDashboardHeaderProps {
  title: string;
  subtitle: string;
  actions?: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    variant?: "default" | "outline" | "ghost";
    onClick: () => void;
  }[];
}

const ExecutiveDashboardHeader = ({ 
  title, 
  subtitle,
  actions = []
}: ExecutiveDashboardHeaderProps) => {
  const navigate = useNavigate();

  const defaultActions = [
    {
      label: "Vue équipe",
      icon: Eye,
      variant: "outline" as const,
      onClick: () => navigate("/team-view"),
    },
    {
      label: "Analytics",
      icon: BarChart3,
      variant: "outline" as const,
      onClick: () => navigate("/analytics"),
    },
    {
      label: "Export",
      icon: Download,
      variant: "ghost" as const,
      onClick: () => console.log("Export"),
    },
  ];

  const allActions = actions.length > 0 ? actions : defaultActions;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main header */}
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <h1 className="text-display-md text-corporate-gray-900">
              {title}
            </h1>
            <Badge className="bg-corporate-blue-50 text-corporate-blue-700 border border-corporate-blue-200 hover:bg-corporate-blue-50">
              Temps réel
            </Badge>
          </div>
          <p className="text-body-lg text-corporate-gray-600 max-w-2xl">
            {subtitle}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-3">
          {allActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              onClick={action.onClick}
              className="flex items-center space-x-2 transition-all duration-200 hover:scale-105"
            >
              <action.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-corporate-gray-200 to-transparent"></div>
    </div>
  );
};

export default ExecutiveDashboardHeader;
