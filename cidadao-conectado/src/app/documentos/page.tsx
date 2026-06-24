"use client";

import { useState, useMemo } from "react";
import { FileText, Search } from "lucide-react";
import { mockDocuments } from "@/data/mockDocuments";
import { DocumentCard } from "@/components/features/documents/DocumentCard";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { DocumentManager } from "@/components/features/profile/DocumentManager";
import { RenewalManager } from "@/components/features/profile/RenewalManager";
import { AuthGuard } from "@/components/layout/AuthGuard";

export default function DocumentosPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocs = useMemo(() => {
    return mockDocuments.filter((doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <AuthGuard>
      <div className="w-full max-w-screen-2xl mx-auto py-10 px-4 md:px-8 space-y-8">
        
        {/* Document Manager and Renewal Manager Sections */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Minha Carteira Digital</h2>
          <DocumentManager />
          <div className="mt-8">
            <RenewalManager />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 select-none cursor-default">
            <div className="p-3 bg-primary/10 rounded-full">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Modelos de Documentos</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Baixe declarações e formulários padronizados para preencher e entregar em órgãos públicos. 
            Disponíveis em PDF interativo e formato Word (DOCX).
          </p>
        </div>

        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar documento... Ex: Residência, Pobreza"
            className="pl-10 h-12 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredDocs.length > 0 ? (
              filteredDocs.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-16 text-center text-muted-foreground border border-dashed rounded-xl"
              >
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg">Nenhum documento encontrado para "{searchTerm}".</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AuthGuard>
  );
}
