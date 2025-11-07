import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

interface ChatHeaderProps {
  onToggleUserList?: () => void;
  showUserListToggle?: boolean;
}

export function ChatHeader({ onToggleUserList, showUserListToggle }: ChatHeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-lg font-semibold text-foreground" data-testid="text-room-title">
          Chat Room
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </Button>

        {showUserListToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleUserList}
            className="lg:hidden"
            data-testid="button-toggle-users"
          >
            <Users className="w-5 h-5" />
          </Button>
        )}
      </div>
    </header>
  );
}
