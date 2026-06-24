"use client";

import { useState, useRef, useEffect } from "react";
import { useGoalsStore, CitizenshipGoal } from "@/store/useGoalsStore";
import { useProfileStore } from "@/store/useProfileStore";
import { Lock, Unlock, Trophy, Upload, CheckCircle2, Circle, Image as ImageIcon, Lightbulb, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

export function CitizenshipDashboard() {
  const [showCelebration, setShowCelebration] = useState(false);

  const { goals, toggleGoalStatus, uploadProtocol, addGoal } = useGoalsStore();
  const { profile } = useProfileStore();

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleToggleStatus = (goal: CitizenshipGoal) => {
    toggleGoalStatus(goal.id);
    if (goal.status === 'pretendido') {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 4000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, goalId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        uploadProtocol(goalId, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const conqueredGoals = goals.filter(g => g.status === 'conquistado');
  const pendingGoals = goals.filter(g => g.status === 'pretendido');
  const progressPercentage = goals.length === 0 ? 0 : Math.round((conqueredGoals.length / goals.length) * 100);

  // Lógica de Sugestão Inteligente (Apenas se a renda for preenchida e for baixa)
  const isLowIncome = profile?.totalFamilyIncome === "Até 1 salário mínimo" || profile?.totalFamilyIncome === "1 a 2 salários mínimos";
  const hasBolsaFamilia = goals.some(g => g.benefitName === "Bolsa Família");

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 relative">
      
      {/* Celebração (Confete Virtual) */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
          >
            <div className="bg-emerald-600/90 backdrop-blur-md text-white p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center border-4 border-emerald-400">
              <Trophy className="w-20 h-20 text-yellow-300 mb-4 drop-shadow-md" />
              <h2 className="text-3xl font-extrabold mb-2">Parabéns!</h2>
              <p className="text-lg opacity-90 max-w-md">Você conquistou mais um direito fundamental e avançou na sua jornada cidadã!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cabeçalho e Barra de Progresso */}
      <div className="bg-card/40 backdrop-blur-md p-6 rounded-3xl border border-border/50 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Seu Progresso Cidadão</h2>
            <p className="text-muted-foreground mt-1">Acompanhe suas conquistas e organize seus protocolos.</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-extrabold text-primary">{progressPercentage}%</span>
            <span className="text-muted-foreground ml-2 text-sm font-medium">concluído</span>
          </div>
        </div>
        <div className="h-4 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Coluna 1: Pretendidos */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2 text-muted-foreground">
            <Circle className="w-5 h-5" /> Direitos que estou buscando
          </h3>
          {pendingGoals.length === 0 ? (
            <div className="p-6 border border-dashed border-border/60 rounded-2xl text-center bg-card/10">
              <p className="text-muted-foreground text-sm">Nenhuma meta pendente no momento.</p>
            </div>
          ) : (
            pendingGoals.map(goal => (
              <Card key={goal.id} className="bg-card/60 backdrop-blur-sm border-border/50 shadow-sm transition-all hover:shadow-md">
                <CardContent className="p-4 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-lg leading-tight">{goal.benefitName}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="shrink-0 h-8 text-xs font-medium border-primary/30 hover:bg-primary/10 text-primary"
                      onClick={() => handleToggleStatus(goal)}
                    >
                      Marcar Conquistado
                    </Button>
                  </div>
                  
                  {/* Upload Section */}
                  <div className="bg-muted/30 p-3 rounded-xl border border-border/40">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5" /> 
                        {goal.protocolImage ? "Comprovante Anexado" : "Anexar Protocolo"}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs px-2"
                        onClick={() => fileInputRefs.current[goal.id]?.click()}
                      >
                        <Upload className="w-3 h-3 mr-1.5" /> Upload
                      </Button>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={(el) => { fileInputRefs.current[goal.id] = el; }}
                        onChange={(e) => handleFileUpload(e, goal.id)}
                      />
                    </div>
                    {goal.protocolImage && (
                      <div className="mt-3 relative aspect-video bg-black/5 rounded-lg overflow-hidden border border-border/50">
                        <img src={goal.protocolImage} alt="Protocolo" className="object-cover w-full h-full" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Coluna 2: Conquistados */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" /> Direitos Conquistados
          </h3>
          {conqueredGoals.length === 0 ? (
            <div className="p-6 border border-dashed border-emerald-500/20 rounded-2xl text-center bg-emerald-500/5">
              <p className="text-emerald-600/60 dark:text-emerald-400/60 text-sm">Suas vitórias aparecerão aqui.</p>
            </div>
          ) : (
            conqueredGoals.map(goal => (
              <Card key={goal.id} className="bg-emerald-500/10 border-emerald-500/30 shadow-none">
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-emerald-800 dark:text-emerald-300 line-through opacity-80">{goal.benefitName}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-7 text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-500/20"
                      onClick={() => handleToggleStatus(goal)}
                    >
                      Desfazer
                    </Button>
                  </div>
                  {goal.protocolImage && (
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" /> Protocolo salvo em segurança
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Motor de Sugestão Inteligente */}
      {isLowIncome && !hasBolsaFamilia && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0">
              <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg text-blue-900 dark:text-blue-300">Sugestão para o seu perfil</h4>
              <p className="text-sm text-blue-800/80 dark:text-blue-400/80 mt-1">
                Com base na sua renda declarada, você pode ter direito ao <strong>Bolsa Família</strong>. Deseja adicionar este objetivo ao seu painel?
              </p>
            </div>
            <Button 
              className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => addGoal("Bolsa Família")}
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Meta
            </Button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
