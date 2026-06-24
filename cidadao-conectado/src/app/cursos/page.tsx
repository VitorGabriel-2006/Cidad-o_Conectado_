"use client";

import { useState, useMemo } from "react";
import { Briefcase, Search, Filter } from "lucide-react";
import { mockCourses } from "@/data/mockCourses";
import { CourseCard } from "@/components/features/courses/CourseCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useProfileStore } from "@/store/useProfileStore";
import { Button } from "@/components/ui/button";

const BRAZILIAN_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export default function CursosPage() {
  const profile = useProfileStore((state) => state.profile);
  const isUnemployed = profile?.occupation === "Desempregado";

  const [searchTerm, setSearchTerm] = useState("");
  const [modalityFilter, setModalityFilter] = useState("Todas");
  const [stateFilter, setStateFilter] = useState("Todos");

  const filteredCourses = useMemo(() => {
    return mockCourses.filter((course) => {
      // 1. Text Search
      const matchesSearch = 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.provider.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Modality Filter
      if (modalityFilter !== "Todas" && course.modality !== modalityFilter) return false;

      // 3. State Filter (If Presencial and a specific state is selected)
      if (stateFilter !== "Todos" && course.modality === "Presencial" && course.state !== stateFilter) return false;

      return true;
    }).sort((a, b) => {
      // Sort EAD first (Nacional), then Presencial
      if (a.modality === "EAD" && b.modality !== "EAD") return -1;
      if (a.modality !== "EAD" && b.modality === "EAD") return 1;
      return 0;
    });
  }, [searchTerm, modalityFilter, stateFilter]);

  return (
    <div className="w-full max-w-screen-2xl mx-auto py-10 px-4 md:px-8 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3 select-none cursor-default">
          <div className="p-3 bg-primary/10 rounded-full">
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Qualificação Profissional</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-3xl">
          Encontre cursos gratuitos de instituições como SENAI, Pronatec e Institutos Federais. 
          Turbine o seu currículo e aumente as suas chances no mercado de trabalho.
        </p>

        {isUnemployed && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl max-w-3xl mt-4">
            <h4 className="font-bold text-blue-800 dark:text-blue-400">💡 Dica para quem busca emprego</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Como você declarou estar desempregado, recomendamos focar em cursos rápidos de **Empreendedorismo** ou nas vagas do **SENAI** que costumam pagar Auxílio-Transporte para você estudar sem custos.
            </p>
          </div>
        )}
      </div>

      <div className="bg-card border border-border/50 rounded-xl p-4 md:p-6 shadow-sm flex flex-col md:flex-row gap-4 relative z-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por curso, área ou instituição..."
            className="pl-9 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4 md:w-[400px]">
          <Select value={modalityFilter} onValueChange={(val) => setModalityFilter(val || "Todas")}>
            <SelectTrigger className="h-11 flex-1">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Modalidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas Modalidades</SelectItem>
              <SelectItem value="EAD">EAD (Nacional)</SelectItem>
              <SelectItem value="Presencial">Presencial</SelectItem>
            </SelectContent>
          </Select>

          <Select value={stateFilter} onValueChange={(val) => setStateFilter(val || "Todos")} disabled={modalityFilter === "EAD"}>
            <SelectTrigger className="h-11 flex-1">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todo Brasil</SelectItem>
              {BRAZILIAN_STATES.map(uf => (
                <SelectItem key={uf} value={uf}>{uf}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-16 text-center text-muted-foreground border border-dashed rounded-xl"
            >
              <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg">Nenhum curso encontrado com esses filtros.</p>
              <Button variant="link" onClick={() => { setSearchTerm(""); setModalityFilter("Todas"); setStateFilter("Todos"); }}>
                Limpar Filtros
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
