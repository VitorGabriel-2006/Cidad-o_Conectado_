"use client";

import React, { useState } from "react";
import { DocumentModel } from "@/data/mockDocuments";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FileText, FileDown, AlertTriangle, File, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface DocumentCardProps {
  document: DocumentModel;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const handleMockDownload = (format: "PDF" | "DOCX") => {
    setIsDownloading(format);
    
    // Simula tempo de download
    setTimeout(() => {
      // Gera um arquivo de texto genérico contendo um aviso para provar que a feature funciona
      const content = `MOCK DOWNLOAD\n\nEste é um arquivo simulado para o formato ${format}.\nDocumento: ${document.title}\n\nO MVP "Cidadão Conectado" permite a validação do fluxo sem armazenar arquivos binários pesados no servidor atual.`;
      
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.setAttribute("download", `modelo_${document.id}_simulado.txt`);
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Download Iniciado: ${document.title}`, {
        description: `O arquivo ${format} está sendo salvo no seu computador.`
      });
      setIsDownloading(null);
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <Card className="h-full flex flex-col border-border/50 shadow-sm hover:border-primary/40 transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="p-2.5 bg-primary/10 rounded-lg shrink-0">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <CardTitle className="text-xl leading-tight">{document.title}</CardTitle>
              <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-muted text-muted-foreground">
                {document.category}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 pb-4 flex flex-col gap-4">
          <CardDescription className="text-base text-foreground/80">
            {document.description}
          </CardDescription>

          {document.requiresNotary && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 px-4 py-3 rounded-xl flex items-start gap-3 mt-2">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-bold block mb-0.5">Assinatura em Cartório Exigida</span>
                Este documento precisará de reconhecimento de firma para ter validade legal.
              </div>
            </div>
          )}

          <Accordion className="w-full mt-auto">
            <AccordionItem value="instructions" className="border-border/40">
              <AccordionTrigger className="text-sm font-medium py-3 text-muted-foreground hover:text-primary">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Como preencher e usar?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-foreground/80 leading-relaxed bg-muted/30 p-4 rounded-lg">
                {document.instructions}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>

        <CardFooter className="pt-2 border-t border-border/20 flex flex-wrap gap-3">
          {document.files.map((file) => (
            <Button
              key={file.format}
              variant={file.format === "PDF" ? "default" : "secondary"}
              className={`flex-1 min-w-[120px] shadow-sm ${
                file.format === "PDF" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:hover:bg-blue-900/60"
              }`}
              onClick={() => handleMockDownload(file.format)}
              disabled={isDownloading === file.format}
            >
              {isDownloading === file.format ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <>
                  {file.format === "PDF" ? <File className="w-4 h-4 mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                </>
              )}
              {file.format}
              <span className="ml-1 opacity-70 text-xs font-normal border-l border-current/20 pl-1.5 ml-1.5">
                {file.sizeKb} KB
              </span>
            </Button>
          ))}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
