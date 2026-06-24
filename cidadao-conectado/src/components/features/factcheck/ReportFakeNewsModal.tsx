"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Send } from "lucide-react";
import { toast } from "sonner";

export function ReportFakeNewsModal() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    // Simula envio
    setTimeout(() => {
      setIsSubmitting(false);
      setOpen(false);
      setMessage("");
      toast.success("Denúncia enviada com sucesso!", {
        description: "Nossa equipe irá verificar esta mensagem em breve. Obrigado por ajudar a proteger outros cidadãos."
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="destructive" className="bg-red-600 hover:bg-red-700 shadow-md">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Recebeu algo suspeito? Envie para verificação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Denunciar Boato ou Golpe
          </DialogTitle>
          <DialogDescription>
            Cole abaixo a mensagem de WhatsApp, SMS ou link suspeito que você recebeu. 
            Não clique em nenhum link antes de termos verificado!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Textarea 
            placeholder="Cole a mensagem suspeita aqui..." 
            className="min-h-[120px] resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={isSubmitting || !message.trim()}>
            {isSubmitting ? "Enviando..." : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar para Verificação
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
