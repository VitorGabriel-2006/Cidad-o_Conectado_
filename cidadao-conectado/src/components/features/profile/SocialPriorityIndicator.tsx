"use client";

import { useSocialPriority } from "@/hooks/useSocialPriority";
import { motion } from "framer-motion";
import { Info, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Props {
  previewIncome?: number;
  previewMembers?: number;
}

export function SocialPriorityIndicator({ previewIncome, previewMembers }: Props) {
  const priority = useSocialPriority(previewIncome, previewMembers);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/80 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-sm mb-6 flex flex-col gap-4 relative overflow-hidden"
    >
      {/* Background Gradient Effect */}
      <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 rounded-full pointer-events-none transition-colors duration-1000 ${priority.bgColor}`} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-background border border-border shadow-sm flex items-center justify-center transition-colors duration-500`}>
            <Activity className={`w-6 h-6 ${priority.color}`} />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-none">Termômetro Social</h3>
            <p className="text-sm text-muted-foreground mt-1">Classificação de vulnerabilidade</p>
          </div>
        </div>
        <div className={`text-right ${priority.color}`}>
          <span className="text-xs font-bold uppercase tracking-wider opacity-80 block mb-0.5">Nível Atual</span>
          <span className="text-xl font-black tracking-tight">{priority.label}</span>
        </div>
      </div>

      <div className="space-y-2 mt-2">
        <div className="h-4 bg-muted rounded-full overflow-hidden flex border border-border/50 shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${priority.progress}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            className={`h-full ${priority.bgColor}`}
          />
        </div>
        <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground px-1">
          <span className={priority.level === "basic" ? priority.color : ""}>Básica</span>
          <span className={priority.level === "medium" ? priority.color : ""}>Média</span>
          <span className={priority.level === "high" ? priority.color : ""}>Alta</span>
          <span className={priority.level === "max" ? priority.color : ""}>Máxima</span>
        </div>
      </div>

      <div className="bg-muted/30 border border-border/40 rounded-xl p-3 flex gap-2.5 items-start mt-2">
        <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
          {priority.reason}
        </p>
      </div>
    </motion.div>
  );
}
