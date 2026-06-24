"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDocumentStore, UserDocument } from "@/store/useDocumentStore";
import { calculateDocumentStatus } from "@/lib/documents";
import { AlertOctagon, Clock, CheckCircle2, Plus, Trash2, ShieldCheck, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockBenefits } from "@/data/mockBenefits";

export function DocumentManager() {
  const { documents, addDocument, updateDocumentDate, removeDocument } = useDocumentStore();
  const [mounted, setMounted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [newDocDate, setNewDocDate] = useState("");
  const [selectedBenefit, setSelectedBenefit] = useState("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleAdd = () => {
    if (!newDocName || !newDocDate) return;
    
    // Simplification for the MVP: Map to a specific benefit or all
    let affectedBenefits: string[] = [];
    if (selectedBenefit !== "all") {
      affectedBenefits = [selectedBenefit];
    } else {
      // By default, a document like RG affects almost everything, but let's just pick top 5
      affectedBenefits = mockBenefits.slice(0, 5).map(b => b.id);
    }

    addDocument({
      id: crypto.randomUUID(),
      name: newDocName,
      expirationDate: newDocDate,
      affectedBenefits,
    });
    
    setNewDocName("");
    setNewDocDate("");
    setSelectedBenefit("all");
    setIsAdding(false);
  };

  const commonDocuments = ["RG", "CNH", "Comprovante de Residência", "CadÚnico", "Laudo Médico (PcD)"];

  return (
    <Card className="border-border/50 shadow-sm mt-8">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> 
              Carteira de Documentos
            </CardTitle>
            <CardDescription className="mt-1">
              Cadastre a validade dos seus documentos e receba alertas antes que eles vençam, 
              evitando o bloqueio de benefícios.
            </CardDescription>
          </div>
          <Button 
            variant={isAdding ? "outline" : "default"} 
            size="sm" 
            onClick={() => setIsAdding(!isAdding)}
            className="shrink-0"
          >
            {isAdding ? "Cancelar" : <><Plus className="w-4 h-4 mr-1" /> Adicionar</>}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, height: 0, overflow: "hidden" }}
              animate={{ opacity: 1, height: "auto", overflow: "visible" }}
              exit={{ opacity: 0, height: 0, overflow: "hidden" }}
              className="mb-6 p-4 bg-muted/30 border border-border rounded-xl space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="docName">Nome do Documento *</Label>
                  <Select onValueChange={(val) => val && setNewDocName(val)} value={newDocName}>
                    <SelectTrigger id="docName">
                      <SelectValue placeholder="Selecione ou digite..." />
                    </SelectTrigger>
                    <SelectContent>
                      {commonDocuments.map(doc => (
                         <SelectItem key={doc} value={doc}>{doc}</SelectItem>
                      ))}
                      <SelectItem value="Outro">Outro Documento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="docDate">Data de Vencimento *</Label>
                  <Input 
                    id="docDate"
                    type="date" 
                    value={newDocDate} 
                    onChange={(e) => setNewDocDate(e.target.value)} 
                    className="w-full"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="docBenefit">Benefício Afetado Principal</Label>
                  <Select onValueChange={(val) => val && setSelectedBenefit(val)} value={selectedBenefit}>
                    <SelectTrigger id="docBenefit">
                      <SelectValue placeholder="Aplicável a todos (Padrão)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Aplicável a vários / Padrão</SelectItem>
                      {mockBenefits.map(b => (
                        <SelectItem key={b.id} value={b.id}>{b.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">Se vencer, bloqueia avisos para este benefício.</p>
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <Button onClick={handleAdd} disabled={!newDocName || !newDocDate}>
                  Salvar Documento
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {documents.length === 0 ? (
          <div className="text-center py-8 bg-muted/10 border border-dashed border-border rounded-xl">
            <ShieldCheck className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">Sua carteira está vazia.</p>
            <p className="text-sm text-muted-foreground mt-1">Adicione documentos para ser alertado sobre o vencimento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => {
              const status = calculateDocumentStatus(doc.expirationDate);
              
              let styleClasses = "bg-card border-border";
              let icon = <CheckCircle2 className="w-5 h-5 text-green-500" />;
              let statusText = "Válido";
              let textClasses = "text-green-600 dark:text-green-400";
              
              if (status === "expired") {
                styleClasses = "bg-red-950/30 border-red-500/50";
                icon = <AlertOctagon className="w-5 h-5 text-red-500" />;
                statusText = "Expirado";
                textClasses = "text-red-600 dark:text-red-400 font-bold";
              } else if (status === "attention") {
                styleClasses = "bg-amber-500/10 border-amber-500/30";
                icon = <Clock className="w-5 h-5 text-amber-500" />;
                statusText = "Próximo do Vencimento";
                textClasses = "text-amber-600 dark:text-amber-500 font-bold";
              }

              return (
                <div key={doc.id} className={`flex flex-col p-4 rounded-xl border ${styleClasses} transition-all`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {icon}
                      <h4 className="font-semibold text-foreground">{doc.name}</h4>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      aria-label="Remover documento"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-1"
                      onClick={() => removeDocument(doc.id)}
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-auto space-y-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground mb-1">Data de Validade:</span>
                      <Input 
                        type="date" 
                        value={doc.expirationDate} 
                        onChange={(e) => updateDocumentDate(doc.id, e.target.value)}
                        className={`h-8 text-sm ${status === "expired" ? "border-red-500/50" : status === "attention" ? "border-amber-500/50" : ""}`}
                      />
                    </div>
                    
                    <div className={`text-xs ${textClasses} flex items-center justify-between`}>
                      <span>{statusText}</span>
                      {status !== 'valid' && (
                        <span className="text-[10px] uppercase tracking-wider bg-background/50 px-2 py-0.5 rounded-full border">
                          Requer Ação
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
