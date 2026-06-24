"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface WhatsAppSupportButtonProps {
  variant?: "floating" | "inline";
}

export function WhatsAppSupportButton({ variant = "floating" }: WhatsAppSupportButtonProps) {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const phoneNumber = "5579998045044";
  const projectName = "Cidadão Conectado";
  const message = `Olá! Preciso de ajuda com o portal ${projectName}. Estou com uma dúvida na página: ${currentUrl}`;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#20bd5a] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
    >
      <MessageCircle className="h-5 w-5" />
      Falar com Suporte via WhatsApp
    </a>
  );
}
