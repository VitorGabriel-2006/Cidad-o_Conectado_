"use client";

import { useState, useMemo } from "react";
import { BookOpen, Search } from "lucide-react";
import { mockGlossary } from "@/data/mockGlossary";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ContentFeedback } from "@/components/ui/ContentFeedback";

export default function GlossarioPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGlossary = useMemo(() => {
    return mockGlossary
      .filter((item) =>
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.simpleDefinition.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [searchTerm]);

  return (
    <div className="w-full max-w-screen-2xl mx-auto py-10 px-4 md:px-8 space-y-8">
      <div className="space-y-4 select-none cursor-default">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Glossário Cidadão</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Entenda palavras difíceis do governo de forma simples e direta. Sem complicação.
        </p>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar palavra... Ex: CadÚnico, NIS, CLT"
          className="pl-10 h-12 text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredGlossary.length > 0 ? (
            filteredGlossary.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Card className="h-full border-border/50 shadow-sm hover:border-primary/30 transition-colors">
                  <CardContent className="p-6 h-full flex flex-col">
                    <h2 className="text-xl font-bold text-primary mb-3">{item.term}</h2>
                    <p className="text-foreground leading-relaxed mb-4 flex-1">
                      {item.simpleDefinition}
                    </p>
                    {item.example && (
                      <div className="bg-muted/50 p-4 rounded-lg border border-border/50 mt-auto">
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Exemplo Prático
                        </p>
                        <p className="text-sm italic">"{item.example}"</p>
                      </div>
                    )}
                    <div className="mt-auto">
                      <ContentFeedback itemId={`glossary-${item.id}`} itemTitle={item.term} itemType="glossary" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-muted-foreground"
            >
              Nenhuma palavra encontrada para "{searchTerm}".
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
