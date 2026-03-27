import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getInitialTheme, setTheme, type Theme } from "@/lib/theme";

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    setThemeState(getInitialTheme());
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full justify-between"
      onClick={toggle}
    >
      <span className="text-sm">
        {theme === "dark" ? "Dark mode" : "Light mode"}
      </span>
      {theme === "dark" ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}

