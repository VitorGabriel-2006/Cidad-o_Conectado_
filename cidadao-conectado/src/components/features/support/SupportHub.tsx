"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, User, Bot, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function SupportHub() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [localInput, setLocalInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<{ id: string | number; role: string; content: string }[]>([
    { id: 1, role: 'assistant', content: 'Olá! Sou o Assistente Virtual. Como posso guiar você pelo portal hoje?' }
  ]);
  const [currentUrl, setCurrentUrl] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentUrl(window.location.href);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const phoneNumber = "5579998045044";
  const projectName = "Cidadão Conectado";
  const messageText = `Olá! Preciso de ajuda com o portal ${projectName}. Estou com uma dúvida na página: ${currentUrl}`;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageText)}`;

  const generateResponse = (userText: string) => {
    const text = userText.toLowerCase();
    
    if (text.includes("pagamento") || text.includes("data") || text.includes("quando") || text.includes("receber")) {
      return "Para ver suas datas de pagamento, abra o menu lateral e clique na aba 'Cronograma'.";
    }
    if (text.includes("cras") || text.includes("presencial") || text.includes("mapa") || text.includes("onde") || text.includes("posto")) {
      return "Você pode encontrar a unidade de atendimento mais próxima abrindo o menu lateral e clicando em 'Unidades Físicas'.";
    }
    if (text.includes("o que é") || text.includes("significa") || text.includes("nis") || text.includes("cadunico")) {
      return "Temos um dicionário simplificado! Abra o menu lateral e acesse o 'Glossário'.";
    }
    
    return "Desculpe, ainda estou aprendendo. Você pode usar o menu lateral para navegar ou selecionar a opção de falar no WhatsApp.";
  };

  const handleManualSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const messageContent = localInput.trim();
    if (!messageContent || isTyping) return;

    const userMessage = { id: Date.now(), role: "user", content: messageContent };
    setMessages((prev) => [...prev, userMessage]);
    setLocalInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = { id: Date.now() + 1, role: "assistant", content: generateResponse(messageContent) };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 600);
  };
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end" ref={menuRef}>
      
      {/* Chatbot Window Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 sm:bottom-20 right-0 w-[calc(100vw-2rem)] sm:w-80 h-[500px] max-h-[80vh] bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center shrink-0 shadow-sm relative z-10">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-full">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold leading-none">Assistente Cidadão</h3>
                  <span className="text-[10px] text-blue-100 font-medium tracking-wider uppercase">Beta AI</span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                onClick={() => setIsChatOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground opacity-60 px-4">
                  <Bot className="w-12 h-12 mb-3" />
                  <p className="text-sm">Olá! Sou o Assistente Virtual. Como posso guiar você hoje?</p>
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={cn("flex gap-2 max-w-[85%]", m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto")}>
                    <div className={cn("shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1", m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground border border-border/50")}>
                      {m.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>
                    <div className={cn("p-3 rounded-2xl text-sm leading-relaxed", m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted/80 text-foreground border border-border/30 rounded-tl-none")}>
                      {m.content}
                    </div>
                  </div>
                ))
              )}
              {isTyping && (
                <div className="flex gap-2 max-w-[85%] mr-auto">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-muted text-muted-foreground border border-border/50 flex items-center justify-center mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/80 border border-border/30 rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce delay-200" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-background border-t border-border/50 shrink-0">
              <form onSubmit={handleManualSubmit} className="flex gap-2">
                <Input
                  className="flex-1 rounded-full bg-muted/50 focus-visible:ring-primary/50 text-sm h-10"
                  value={localInput}
                  placeholder="Escreva sua pergunta..."
                  onChange={(e) => setLocalInput(e.target.value)}
                  disabled={isTyping}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="rounded-full shrink-0 h-10 w-10 shadow-sm"
                  disabled={isTyping || !localInput.trim()}
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speed Dial Menu Options */}
      <AnimatePresence>
        {isMenuOpen && !isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="flex flex-col gap-3 mb-4 items-end"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium bg-background/90 text-foreground px-3 py-1.5 rounded-lg shadow-sm border border-border/50">
                Falar com IA
              </span>
              <button
                onClick={() => {
                  setIsChatOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-600/30"
              >
                <Bot className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium bg-background/90 text-foreground px-3 py-1.5 rounded-lg shadow-sm border border-border/50">
                Suporte WhatsApp
              </span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="w-12 h-12 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20bd5a] hover:scale-105 transition-all flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Hub Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={cn(
            "w-14 h-14 rounded-full shadow-lg flex items-center justify-center border-4 border-background transition-all duration-300 focus:outline-none",
            isMenuOpen 
              ? "bg-muted text-foreground rotate-90" 
              : "bg-primary text-primary-foreground hover:scale-105"
          )}
          aria-label="Central de Ajuda"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Headset className="w-6 h-6" />}
        </button>
      )}
    </div>
  );
}
