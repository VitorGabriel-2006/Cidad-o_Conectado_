"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { BenefitCard } from "./BenefitCard";
import { BenefitsFilter } from "./BenefitsFilter";
import { TaxImpactCard } from "./TaxImpactCard";
import { ScheduleView } from "./ScheduleView";
import { ComparisonDrawer } from "./ComparisonDrawer";
import { ComparisonModal } from "./ComparisonModal";
import { ExportPdfButton } from "./ExportPdfButton";
import { BenefitPrintView } from "./BenefitPrintView";
import { RecentlyViewed } from "./RecentlyViewed";
import { Benefit } from "@/data/mockBenefits";
import { Search, History, Lightbulb, ArrowDownAZ, Star, Scale, HeartHandshake, Calendar, GraduationCap, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store/useProfileStore";
import { useApplicationStore } from "@/store/useApplicationStore";
import { useNavigationStore } from "@/store/useNavigationStore";
import { matchBenefits, calculateRelevanceScore } from "@/lib/rulesEngine";
import { GuidedNavigationHeader } from "./GuidedNavigationHeader";
import { useRouter } from "next/navigation";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion, Variants } from "framer-motion";
import { getBenefitTimeStatus } from "@/lib/dateUtils";

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

interface BenefitsViewProps {
  initialBenefits: Benefit[];
}

export function BenefitsView({ initialBenefits }: BenefitsViewProps) {
  const profile = useProfileStore((state) => state.profile);
  const favorites = useApplicationStore((state) => state.favorites);
  const { isGuidedMode, hideIrrelevant } = useNavigationStore();
  const router = useRouter();
  
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"relevance" | "az">("relevance");
  const [mounted, setMounted] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { isListening, transcript, toggleListening, isSupported } = useVoiceSearch((finalTranscript) => {
    setSearchInput(finalTranscript);
    handleSearch(finalTranscript);
  });

  useEffect(() => {
    if (isListening && transcript) {
      setSearchInput(transcript);
    }
  }, [isListening, transcript]);

  const categoryStyles: Record<string, string> = {
    "Programas Sociais": "bg-green-900/10 border-green-500/30 text-green-600 dark:text-green-400 hover:bg-green-900/20",
    "Direitos de Educação": "bg-blue-900/10 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-900/20",
    "Leis e Proteções": "bg-purple-900/10 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-900/20",
    "Cenário Tributário": "bg-amber-900/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-900/20"
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (!profile) {
      router.push("/perfil");
    }
    const savedHistory = sessionStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, [profile, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsHistoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (query?: string) => {
    const termToSearch = query !== undefined ? query : searchInput;
    const trimmed = termToSearch.trim();
    setActiveQuery(trimmed);
    setIsHistoryOpen(false);
    
    if (trimmed) {
      setSearchHistory(prev => {
        const newHistory = [trimmed, ...prev.filter(h => h.toLowerCase() !== trimmed.toLowerCase())].slice(0, 3);
        sessionStorage.setItem("searchHistory", JSON.stringify(newHistory));
        return newHistory;
      });
      if (query !== undefined) {
        setSearchInput(trimmed);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Extract unique available groups from the ENTIRE dataset
  const availableGroups = useMemo(() => {
    const groups = new Set<string>();
    initialBenefits.forEach(b => {
      // Se estiver ocultando irrelevantes, não mostra as tags deles nos filtros vazios
      const isEligible = matchBenefits(profile, [b]).length > 0;
      if (hideIrrelevant && !isEligible) return;
      
      b.targetGroups.forEach(g => groups.add(g));
    });
    return Array.from(groups);
  }, [initialBenefits, profile, hideIrrelevant]);

  const toggleGroup = (group: string) => {
    setSelectedGroups(prev => 
      prev.includes(group) 
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const clearAllFilters = () => {
    setSelectedGroups([]);
    setSearchInput("");
    setActiveQuery("");
  };

  const filteredBenefits = useMemo(() => {
    if (!profile) return [];

    const result = initialBenefits.filter((benefit) => {
      // 1. Checagem de Elegibilidade (Motor de Regras)
      const isEligible = matchBenefits(profile, [benefit]).length > 0;
      
      // Se usuário ativou o modo focado e o benefício é incompatível, removemos
      if (hideIrrelevant && !isEligible) {
        return false;
      }
      
      // Filter by text search (Tolerant)
      if (activeQuery) {
        const normalizeText = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const normQuery = normalizeText(activeQuery);
        
        if (!normalizeText(benefit.title).includes(normQuery) && !normalizeText(benefit.description).includes(normQuery)) {
          return false;
        }
      }
      
      // Filter by groups
      if (selectedGroups.length > 0) {
        const hasMatch = benefit.targetGroups.some(g => selectedGroups.includes(g));
        if (!hasMatch) return false;
      }
      
      // Filter out benefits closed for more than 30 days
      const timeStatus = getBenefitTimeStatus(benefit.enrollmentPeriod);
      if (timeStatus.isClosedMoreThan30Days) {
        return false;
      }

      return true;
    }).map(benefit => {
      // 2. Cálculo de Relevância
      const score = calculateRelevanceScore(benefit, profile);
      return {
        ...benefit,
        relevanceScore: isGuidedMode ? score : 0
      };
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === "az") {
        return a.title.localeCompare(b.title);
      } else {
        // Ordena por pontuação de recomendação. Se igual, alfabético
        const scoreA = a.relevanceScore || 0;
        const scoreB = b.relevanceScore || 0;
        if (scoreB === scoreA) {
          return a.title.localeCompare(b.title);
        }
        return scoreB - scoreA;
      }
    });

    return result;
  }, [profile, initialBenefits, selectedGroups, activeQuery, sortBy, isGuidedMode, hideIrrelevant]);

  const { groupedPrograms, groupedLaws, educationBenefits } = useMemo(() => {
    const programs: Record<string, Benefit[]> = {
      "Programas Sociais": [],
      "Cenário Tributário": [],
      "Leis e Proteções": []
    };
    
    const laws: Record<string, Benefit[]> = {
      "Programas Sociais": [],
      "Cenário Tributário": [],
      "Leis e Proteções": []
    };

    const education: Benefit[] = [];
    
    filteredBenefits.forEach(b => {
      const isLaw = b.itemType === "law" || b.id.startsWith("lei-") || b.id.startsWith("trib-");
      const targetGroup = isLaw ? laws : programs;

      if (b.iconType === "education" || b.targetGroups.includes("Estudante")) {
        education.push(b);
      } else if (b.iconType === "money" || b.iconType === "housing") {
        targetGroup["Programas Sociais"].push(b);
      } else if (b.title.toLowerCase().includes("imposto") || b.title.toLowerCase().includes("isenção") || b.title.toLowerCase().includes("tributo")) {
        targetGroup["Cenário Tributário"].push(b);
      } else {
        targetGroup["Leis e Proteções"].push(b);
      }
    });
    
    return { groupedPrograms: programs, groupedLaws: laws, educationBenefits: education };
  }, [filteredBenefits]);

  const getSuggestions = () => {
    if (!activeQuery) return [];
    // Extrai palavras dos títulos que existem para sugerir
    const words = new Set<string>();
    filteredBenefits.forEach(b => {
      b.title.split(" ").forEach(w => {
        if (w.length > 4) words.add(w.replace(/[,.]/g, ''));
      });
    });
    return Array.from(words).slice(0, 4);
  };

  if (!mounted || !profile) {
    return null; // Return nothing while checking profile to avoid flash
  }

  const sidebarContent = (
    <>
        <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
           <h3 className="font-bold text-lg mb-4">Resumo do Perfil</h3>
           <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{profile.age} anos</Badge>
              {profile.perCapitaIncome > 0 && (
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  Renda: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(profile.perCapitaIncome)}
                </Badge>
              )}
              {profile.isStudent && <Badge variant="secondary">Estudante</Badge>}
              {profile.isPregnant && <Badge variant="secondary">Gestante</Badge>}
              {profile.isPcD && <Badge variant="secondary">PcD</Badge>}
           </div>
           <div className="flex flex-col gap-2">
             <Button variant="outline" className="w-full" onClick={() => router.push('/perfil')}>Editar Perfil</Button>
             <ExportPdfButton />
           </div>
        </div>

        <TaxImpactCard />

        <BenefitsFilter 
          availableGroups={availableGroups}
          selectedGroups={selectedGroups}
          onToggleGroup={toggleGroup}
          onClearAll={clearAllFilters}
        />
    </>
  );

  return (
    <>
      <BenefitPrintView />
      <motion.div 
        variants={pageVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 gap-8 print:hidden"
      >
      {/* Left Column */}
      <div className="w-full lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 h-fit order-2 lg:order-1">
        <Accordion className="lg:hidden bg-card border border-border/50 rounded-xl shadow-sm mb-6">
          <AccordionItem value="filters" className="border-none">
            <AccordionTrigger className="px-5 py-4 hover:no-underline">
              <span className="font-bold text-base text-left">Filtros, Resumo e Análise Tributária</span>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 space-y-6 border-t border-border/50 pt-5 mt-2">
               {sidebarContent}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="hidden lg:flex flex-col space-y-6">
          {sidebarContent}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:col-span-8 xl:col-span-9 space-y-6 min-w-0 order-1 lg:order-2">
        
        <GuidedNavigationHeader />

        <RecentlyViewed />

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-card border border-border/50 p-4 rounded-xl shadow-sm">
          <div className="relative flex-1 max-w-md" ref={searchContainerRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
            <Input 
              placeholder="Buscar leis e benefícios..." 
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                if (e.target.value === "") setActiveQuery(""); 
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsHistoryOpen(true)}
              className={`pl-9 pr-[6.5rem] bg-background relative z-0 ${isListening ? 'ring-1 ring-red-500 border-red-500' : ''}`}
            />
            {isSupported && (
              <Button
                variant="ghost"
                size="icon"
                className={`absolute right-[4.5rem] top-1/2 -translate-y-1/2 h-7 w-7 rounded-full z-10 transition-colors ${
                  isListening 
                    ? 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={toggleListening}
                title="Busca por voz"
              >
                <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
                {isListening && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-20"></span>
                )}
              </Button>
            )}
            <Button 
              size="sm" 
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 rounded px-3 z-10"
              onClick={() => handleSearch()}
            >
              Buscar
            </Button>
            
            {isHistoryOpen && searchHistory.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/30">
                  Buscas recentes
                </div>
                {searchHistory.map((item, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-3 py-2.5 text-sm hover:bg-muted flex items-center gap-2 transition-colors"
                    onClick={() => handleSearch(item)}
                  >
                    <History className="h-3.5 w-3.5 text-muted-foreground" />
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="text-sm font-medium bg-primary/10 text-primary px-3 py-2 rounded-md shrink-0 text-center">
              {filteredBenefits.length} {filteredBenefits.length === 1 ? 'resultado' : 'resultados'}
            </div>
            <div className="w-[180px] shrink-0">
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as "relevance" | "az")}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">
                    <span className="flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" /> Mais Relevantes</span>
                  </SelectItem>
                  <SelectItem value="az">
                    <span className="flex items-center gap-2"><ArrowDownAZ className="h-4 w-4" /> A-Z</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {filteredBenefits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border/50 border-dashed rounded-xl">
            <div className="bg-muted p-4 rounded-full mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhum resultado para &quot;{activeQuery}&quot;</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Não encontramos nenhum benefício com os filtros selecionados ou termo buscado. Tente termos diferentes ou limpe os filtros.
            </p>

            {getSuggestions().length > 0 && (
              <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-medium flex items-center text-foreground/80">
                  <Lightbulb className="h-4 w-4 mr-1.5 text-yellow-500" />
                  Sugestões:
                </span>
                <div className="flex flex-wrap gap-2 justify-center">
                  {getSuggestions().map(sug => (
                    <Button key={sug} variant="secondary" size="sm" onClick={() => handleSearch(sug)}>
                      {sug}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Button variant="outline" className="mt-8" onClick={clearAllFilters}>
              Limpar busca e filtros
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="benefits" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="benefits" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <HeartHandshake className="h-4 w-4 hidden sm:block" /> Programas
              </TabsTrigger>
              <TabsTrigger value="laws" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <Scale className="h-4 w-4 hidden sm:block" /> Leis
              </TabsTrigger>
              <TabsTrigger value="education" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <GraduationCap className="h-4 w-4 hidden sm:block" /> Educação
              </TabsTrigger>
            </TabsList>

            <TabsContent value="benefits" className="animate-in fade-in duration-300">
              <Accordion className="w-full space-y-4 pb-10">
                {Object.entries(groupedPrograms).map(([category, items]: [string, Benefit[]]) => {
                  if (items.length === 0) return null;
                  
                  const styles = categoryStyles[category] || categoryStyles["Leis e Proteções"];
                  
                  return (
                    <AccordionItem key={category} value={category} className="border-none">
                      <AccordionTrigger className={`flex items-center px-5 py-4 rounded-xl border transition-all duration-200 no-underline hover:no-underline data-[state=open]:rounded-b-none data-[state=open]:border-b-0 ${styles}`}>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg">{category}</span>
                          <span className="bg-background/80 text-foreground text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                            {items.length}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-6 pb-2 px-1">
                        <motion.div 
                          variants={containerVariants}
                          initial="hidden"
                          animate="show"
                          className="grid grid-cols-1 xl:grid-cols-2 gap-4"
                        >
                          {items.map(benefit => (
                            <BenefitCard key={benefit.id} benefit={benefit} searchQuery={activeQuery} />
                          ))}
                        </motion.div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </TabsContent>

            <TabsContent value="laws" className="animate-in fade-in duration-300">
              <Accordion className="w-full space-y-4 pb-10">
                {Object.entries(groupedLaws).map(([category, items]: [string, Benefit[]]) => {
                  if (items.length === 0) return null;
                  
                  const styles = categoryStyles[category] || categoryStyles["Leis e Proteções"];
                  
                  return (
                    <AccordionItem key={category} value={category} className="border-none">
                      <AccordionTrigger className={`flex items-center px-5 py-4 rounded-xl border transition-all duration-200 no-underline hover:no-underline data-[state=open]:rounded-b-none data-[state=open]:border-b-0 ${styles}`}>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg">{category}</span>
                          <span className="bg-background/80 text-foreground text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                            {items.length}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-6 pb-2 px-1">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                          {items.map(benefit => (
                            <BenefitCard key={benefit.id} benefit={benefit} searchQuery={activeQuery} />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </TabsContent>

            <TabsContent value="education" className="animate-in fade-in duration-300">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 pt-2 pb-10">
                {educationBenefits.length === 0 ? (
                  <div className="col-span-full py-12 text-center border rounded-xl border-dashed">
                    <GraduationCap className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                    <p className="text-muted-foreground">Nenhum programa educacional encontrado para os filtros atuais.</p>
                  </div>
                ) : (
                  educationBenefits.map(benefit => (
                    <BenefitCard key={benefit.id} benefit={benefit} searchQuery={activeQuery} />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      <ComparisonDrawer />
      <ComparisonModal />
      </motion.div>
    </>
  );
}
