"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface BenefitsFilterProps {
  availableGroups: string[];
  selectedGroups: string[];
  onToggleGroup: (group: string) => void;
  onClearAll: () => void;
}

export function BenefitsFilter({
  availableGroups,
  selectedGroups,
  onToggleGroup,
  onClearAll,
}: BenefitsFilterProps) {
  // Sort alphabetically as requested
  const sortedGroups = [...availableGroups].sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-6 bg-card border border-border/50 rounded-xl p-4 md:p-6 shadow-sm h-fit">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filtros</h3>
        {selectedGroups.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearAll}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
          >
            Limpar todos
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground/80">Grupos Sociais</h4>
        <div className="flex flex-col space-y-3">
          {sortedGroups.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum grupo disponível.</p>
          ) : (
            sortedGroups.map((group) => {
              const isChecked = selectedGroups.includes(group);
              return (
                <div key={group} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`filter-${group}`} 
                    checked={isChecked}
                    onCheckedChange={() => onToggleGroup(group)}
                  />
                  <Label 
                    htmlFor={`filter-${group}`}
                    className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {group}
                  </Label>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
