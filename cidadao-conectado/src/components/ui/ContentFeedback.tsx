"use client";

import { useState } from "react";
import { useFeedbackStore } from "@/store/useFeedbackStore";
import { useProfileStore } from "@/store/useProfileStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, CheckCircle2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export interface ContentFeedbackProps {
  itemId: string;
  itemTitle: string;
  itemType: "glossary" | "benefit" | "law" | "other";
}

export function ContentFeedback({ itemId, itemTitle, itemType }: ContentFeedbackProps) {
  const { addFeedback, hasVoted } = useFeedbackStore();
  const userAccount = useProfileStore((state) => state.userAccount);
  const voted = hasVoted(itemId);
  
  const [showForm, setShowForm] = useState(false);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleVote = (isHelpful: boolean) => {
    if (!userAccount) {
      toast.error("Você precisa estar logado para enviar feedback.");
      return;
    }

    if (isHelpful) {
      addFeedback(itemId, itemTitle, itemType, true);
      setSubmitted(true);
      console.log(`[ContentFeedback] Payload enviado:`, { itemId, itemTitle, itemType, isHelpful: true, user: userAccount.email });
    } else {
      setShowForm(true);
    }
  };

  const handleNegativeSubmit = () => {
    if (!userAccount) {
      toast.error("Você precisa estar logado para enviar feedback.");
      return;
    }

    addFeedback(itemId, itemTitle, itemType, false, comment);
    setShowForm(false);
    setSubmitted(true);
    console.log(`[ContentFeedback] Payload enviado:`, { itemId, itemTitle, itemType, isHelpful: false, comment, user: userAccount.email });
  };

  if (voted || submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/50 mt-4"
      >
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        Obrigado por ajudar a melhorar o sistema! Seu feedback foi registrado.
      </motion.div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-border/50 w-full">
      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div
            key="buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <span className="text-sm text-muted-foreground font-medium">Essa explicação foi útil?</span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1.5 text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-200 dark:hover:border-emerald-900/50"
                onClick={() => handleVote(true)}
              >
                <ThumbsUp className="h-3.5 w-3.5" /> Foi útil
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1.5 text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-200 dark:hover:border-rose-900/50"
                onClick={() => handleVote(false)}
              >
                <ThumbsDown className="h-3.5 w-3.5" /> Não entendi
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Como podemos melhorar?</span>
              <span className="text-xs text-muted-foreground">{comment.length}/250</span>
            </div>
            <Textarea 
              placeholder="O que ficou confuso? (Opcional)"
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 250))}
              className="resize-none h-20 text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button size="sm" onClick={handleNegativeSubmit} className="gap-1.5">
                <Send className="h-3.5 w-3.5" /> Enviar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
