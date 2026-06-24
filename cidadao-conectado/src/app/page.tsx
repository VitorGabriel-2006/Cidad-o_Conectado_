"use client";

import { Button } from "@/components/ui/button";
import { ShieldCheck, UserCircle, Landmark, X } from "lucide-react";
import Link from "next/link";
import { FraudAlertBanner } from "@/components/features/home/FraudAlertBanner";
import { RenewalCountdown } from "@/components/features/home/RenewalCountdown";
import { EmergencyBanner } from "@/components/features/benefits/EmergencyBanner";
import { motion, Variants } from "framer-motion";
import { useEffect } from "react";
import { toast } from "sonner";
import { mockFakeNews } from "@/data/mockFakeNews";

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function Home() {
  useEffect(() => {
    // R079: Push Notification Engine (Simulação)
    const majorAlert = mockFakeNews.find(news => news.isMajorAlert);
    if (majorAlert) {
      // Pequeno delay para simular a chegada do push pós-carregamento
      const timer = setTimeout(() => {
        toast.custom((t) => (
          <div className="bg-red-950 border border-red-800 text-white p-4 rounded-xl shadow-2xl flex items-start sm:items-center justify-between gap-3 w-full">
            <div className="text-sm font-medium leading-relaxed">
              ⚠️ Alerta Crítico de Golpe: {majorAlert.title}. Não clique em links!
            </div>
            <button 
              type="button"
              onClick={() => toast.dismiss(t)} 
              className="cursor-pointer text-red-200 hover:text-white p-1.5 rounded-md hover:bg-red-900 transition-colors shrink-0"
              aria-label="Fechar alerta"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ), {
          duration: 10000,
          position: "top-center",
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <main className="flex-1 flex flex-col relative overflow-x-hidden bg-background">
      <FraudAlertBanner />
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <motion.div variants={pageVariants} initial="hidden" animate="show" className="flex-1 flex flex-col">
        <div className="w-full max-w-screen-2xl mx-auto px-4 mt-8 relative z-20">
          <EmergencyBanner />
        </div>

        {/* Hero Section */}
        <section className="relative w-full mt-10 md:mt-16 pt-10 pb-16 flex flex-col items-center justify-center text-center px-4">
          <motion.div variants={itemVariants} className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Bem-vindo ao novo portal
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mb-6">
            Seus direitos,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
              na palma da mão.
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
            O Cidadão Conectado facilita o acesso a serviços públicos, benefícios sociais e assistência jurídica de forma ágil e segura.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 relative z-30">
            <Link href="/perfil">
              <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold bg-white text-black hover:bg-zinc-200">
                Explorar Benefícios
              </Button>
            </Link>
            <Link href="/seguranca">
              <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold border border-white/20 text-white hover:bg-white/10 bg-transparent">
                Acessar Meu Perfil
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="relative z-10 w-full max-w-screen-2xl mx-auto px-4 md:px-8 pb-32">
          <RenewalCountdown />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -5 }} className="group relative overflow-hidden rounded-3xl border border-border/30 bg-card/60 p-6 md:p-8 transition-colors backdrop-blur-md shadow-sm">
              <div className="mb-6 inline-flex p-3 rounded-2xl bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Segurança de Dados</h3>
              <p className="text-muted-foreground leading-relaxed">
                Acompanhe seus processos e receba orientações legais com total privacidade e segurança garantida pelo sistema.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -5 }} className="group relative overflow-hidden rounded-3xl border border-border/30 bg-card/60 p-6 md:p-8 transition-colors backdrop-blur-md shadow-sm">
              <div className="mb-6 inline-flex p-3 rounded-2xl bg-purple-500/10 text-purple-500 ring-1 ring-purple-500/20">
                <Landmark className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Processos Públicos</h3>
              <p className="text-muted-foreground leading-relaxed">
                Encontre o posto de atendimento mais próximo e agende seus serviços sem sair de casa com o mapa interativo.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -5 }} className="group relative overflow-hidden rounded-3xl border border-border/30 bg-card/60 p-6 md:p-8 transition-colors backdrop-blur-md shadow-sm">
              <div className="mb-6 inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
                <UserCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Atendimento Cidadão</h3>
              <p className="text-muted-foreground leading-relaxed">
                Centralize seus documentos e histórico de benefícios em um único lugar, de forma fácil e intuitiva.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Structured Footer */}
        <footer className="mt-auto border-t border-border/40 bg-muted/20">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 font-bold text-lg text-primary">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">CC</div>
              <span>Cidadão Conectado</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground font-medium">
              <Link href="/sobre" className="hover:text-primary transition-colors">Sobre o Projeto</Link>
              <Link href="/metas" className="hover:text-primary transition-colors">Metas de Cidadania</Link>
              <Link href="/seguranca" className="hover:text-primary transition-colors">Privacidade e Segurança</Link>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} GovTech. Todos os direitos reservados.
            </div>
          </div>
        </footer>

      </motion.div>
    </main>
  );
}
