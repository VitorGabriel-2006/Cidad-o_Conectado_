"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { 
  Accessibility, 
  SunMoon, 
  Contrast, 
  BookText, 
  Droplets,
  Check
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AccessibilityMenu() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Evitar hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="rounded-full w-9 h-9 p-0 border-primary/20">
        <Accessibility className="h-4 w-4 text-primary/50" />
      </Button>
    );
  }

  const themes = [
    { id: "system", name: "Padrão (Sistema)", icon: SunMoon },
    { id: "high-contrast", name: "Alto Contraste", icon: Contrast },
    { id: "sepia", name: "Sépia", icon: BookText },
    { id: "monochrome", name: "Monocromático", icon: Droplets },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
        render={
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full w-9 h-9 p-0 border-primary/20 text-primary hover:bg-primary/10 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Menu de Acessibilidade Visual"
          />
        }
      >
        <Accessibility className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2">
            <Accessibility className="h-4 w-4" />
            Temas Visuais
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {themes.map((t) => {
            const Icon = t.icon;
            const isActive = theme === t.id || (theme === "system" && t.id === "system");
            
            return (
              <DropdownMenuItem 
                key={t.id} 
                onClick={() => setTheme(t.id)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{t.name}</span>
                </div>
                {isActive && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
