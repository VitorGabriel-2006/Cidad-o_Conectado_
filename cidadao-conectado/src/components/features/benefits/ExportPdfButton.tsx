"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExportPdfButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button 
      onClick={handlePrint} 
      variant="outline" 
      size="sm"
      className="gap-2 border-primary/20 bg-background/50 backdrop-blur-md hover:bg-primary/10 transition-all shadow-sm print:hidden"
    >
      <Printer className="h-4 w-4" />
      <span className="hidden sm:inline">Exportar Resumo (PDF)</span>
      <span className="sm:hidden">PDF</span>
    </Button>
  );
}
