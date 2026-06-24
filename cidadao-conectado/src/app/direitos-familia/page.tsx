"use client";

import { motion } from "framer-motion";
import { useQuickExit } from "@/hooks/useQuickExit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Baby, HeartHandshake, Phone, AlertTriangle, LogOut, CheckCircle2, ChevronRight, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function DireitosFamiliaPage() {
  const { triggerExit } = useQuickExit();

  return (
    <div className="w-full max-w-screen-2xl mx-auto p-4 md:p-6 lg:p-8 min-h-[calc(100vh-4rem)] dark bg-slate-950 text-slate-200">
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        
        {/* COLUNA ESQUERDA: PAINEL DE SEGURANÇA E AMAPARO (STICKY) */}
        <div className="lg:col-span-4 h-full relative">
          <div className="sticky top-6 flex flex-col gap-6">
            
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/40 text-rose-300 border border-rose-800/30 text-sm font-medium">
                <HeartHandshake className="h-4 w-4" /> Amparo e Proteção
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                Seus Direitos, <br/>Sua Segurança.
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Este espaço foi desenhado para não deixar rastros em seu histórico de navegação interna. Sinta-se segura para ler.
              </p>
            </motion.div>

            {/* BOTÃO DE SAÍDA RÁPIDA (BENTO BLOCK) */}
            <motion.div variants={itemVariants}>
              <div className="bg-rose-950/30 backdrop-blur-md border border-rose-900/50 p-6 rounded-3xl shadow-xl relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 bg-rose-600/10 w-32 h-32 rounded-full blur-3xl group-hover:bg-rose-600/20 transition-all duration-700"></div>
                <h3 className="text-xl font-bold text-rose-100 flex items-center gap-2 mb-3 relative z-10">
                  <Shield className="h-5 w-5 text-rose-400" />
                  Privacidade Imediata
                </h3>
                <p className="text-sm text-rose-200/70 mb-5 relative z-10">
                  Use o botão abaixo ou aperte a tecla <kbd className="bg-rose-900/50 px-1.5 py-0.5 rounded font-mono text-rose-300">ESC 2 vezes</kbd> rápidas para fechar este site imediatamente e limpar a tela.
                </p>
                <Button 
                  onClick={triggerExit}
                  className="w-full bg-rose-700 hover:bg-rose-600 text-white shadow-lg shadow-rose-900/20 h-14 rounded-2xl text-lg font-bold transition-all hover:scale-[1.02] active:scale-95"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Sair Rápido
                </Button>
              </div>
            </motion.div>

            {/* EMERGÊNCIA (BENTO BLOCK) */}
            <motion.div variants={itemVariants}>
              <div className="bg-indigo-950/30 backdrop-blur-md border border-indigo-800/50 p-6 rounded-3xl shadow-xl">
                <h3 className="font-bold text-indigo-100 flex items-center gap-2 mb-4">
                  <Phone className="h-5 w-5 text-indigo-400" />
                  Canais de Urgência
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center justify-between p-3 bg-indigo-900/20 rounded-xl border border-indigo-800/30">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-lg">Ligue 180</span>
                      <span className="text-xs text-indigo-300">Central da Mulher</span>
                    </div>
                    <Button size="icon" variant="ghost" className="text-indigo-400 hover:text-white hover:bg-indigo-500/20">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </li>
                  <li className="flex items-center justify-between p-3 bg-indigo-900/20 rounded-xl border border-indigo-800/30">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-lg">Ligue 190</span>
                      <span className="text-xs text-indigo-300">Polícia Militar (Urgência Imediata)</span>
                    </div>
                    <Button size="icon" variant="ghost" className="text-indigo-400 hover:text-white hover:bg-indigo-500/20">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </li>
                </ul>
              </div>
            </motion.div>

          </div>
        </div>

        {/* COLUNA DIREITA: GRID DE CARDS DE CONTEÚDO (BENTO BOX) */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* MARIA DA PENHA */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-6 md:p-8 rounded-3xl shadow-lg hover:border-slate-700/50 transition-colors h-full">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-500/10 p-3 rounded-2xl shrink-0">
                    <AlertTriangle className="h-6 w-6 text-amber-400" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-white">Medidas Protetivas (Lei Maria da Penha)</h2>
                    <p className="text-slate-400 text-sm">Garantias legais para proteger você de violência física, psicológica, sexual, moral ou patrimonial.</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                      <li className="flex items-start gap-2 text-sm text-slate-300 bg-slate-800/30 p-3 rounded-xl">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Afastamento imediato do agressor da sua casa.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-300 bg-slate-800/30 p-3 rounded-xl">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Proibição de qualquer contato (físico ou online) do agressor com você e familiares.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-300 bg-slate-800/30 p-3 rounded-xl">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Você pode solicitar na Delegacia (de preferência DEAM), <strong>sem advogado</strong>.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-300 bg-slate-800/30 p-3 rounded-xl">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>O Juiz tem o prazo de até <strong>48 horas</strong> para aprovar a medida.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* PENSÃO ALIMENTÍCIA */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <div className="bg-indigo-950/20 backdrop-blur-md border border-indigo-900/30 p-6 md:p-8 rounded-3xl shadow-lg hover:border-indigo-800/40 transition-colors h-full flex flex-col">
                <div className="bg-indigo-500/10 p-3 rounded-2xl w-fit mb-4">
                  <Baby className="h-6 w-6 text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Pensão Alimentícia</h2>
                <p className="text-slate-400 text-sm mb-4">Como exigir o direito dos seus filhos de forma ágil.</p>
                <ul className="space-y-3 mt-auto">
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <ChevronRight className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span><strong>Idade:</strong> Até os 18 anos, ou até 24 anos caso esteja cursando ensino superior/técnico.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <ChevronRight className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span><strong>Gratuidade:</strong> Vá até a <strong>Defensoria Pública</strong> com certidão de nascimento, endereço do pai e comprovante das despesas da criança.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <ChevronRight className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <span><strong>Atraso:</strong> Apenas <strong>1 mês</strong> de atraso permite acionar a justiça para penhora ou ordem de prisão.</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* MATERNIDADE E CRECHES */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <div className="bg-rose-950/20 backdrop-blur-md border border-rose-900/30 p-6 md:p-8 rounded-3xl shadow-lg hover:border-rose-800/40 transition-colors h-full flex flex-col">
                <div className="bg-rose-500/10 p-3 rounded-2xl w-fit mb-4">
                  <BriefcaseIcon className="h-6 w-6 text-rose-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Trabalho, Lactação e Creches</h2>
                <p className="text-slate-400 text-sm mb-4">Direitos essenciais da mãe na volta ao mercado de trabalho.</p>
                <ul className="space-y-3 mt-auto">
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <ChevronRight className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <span><strong>Licença:</strong> 120 dias garantidos por lei (180 dias em Empresa Cidadã), iniciando até 28 dias antes do parto.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <ChevronRight className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <span><strong>Jornada Lactante:</strong> Direito a <strong>duas pausas de 30 minutos</strong> por dia para amamentar ou coletar leite até o bebê ter 6 meses. Podem ser unidas para sair 1h mais cedo.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <ChevronRight className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <span><strong>Creche obrigatória:</strong> Empresas com mais de 30 mulheres (acima de 16 anos) devem fornecer local apropriado ou Auxílio-Creche.</span>
                  </li>
                </ul>
              </div>
            </motion.div>

          </div>
        </div>

      </motion.div>
    </div>
  );
}

// Icons extracted internally
function BriefcaseIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
}
