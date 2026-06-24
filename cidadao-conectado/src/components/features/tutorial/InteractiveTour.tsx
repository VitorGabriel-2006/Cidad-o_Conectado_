"use client";

import { useEffect, useState } from "react";
import { Joyride, STATUS, Step } from "react-joyride";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export function InteractiveTour() {
  const [run, setRun] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const steps: Step[] = [
    {
      target: "body",
      content: "Bem-vindo ao Cidadão Conectado! Vamos te mostrar como preencher seu perfil para encontrar direitos sociais.",
      placement: "center",
      // @ts-ignore
      disableBeacon: true,
    },
    {
      target: "#tour-income",
      content: "A sua Renda é crucial! É com esse dado que o motor do sistema sabe se você tem direito a auxílios federais.",
      placement: "top",
    },
    {
      target: "#tour-occupation",
      content: "Sua Ocupação nos ajuda a alertar sobre obrigações de impostos (como declarar IRPF ou o SIMEI para autônomos).",
      placement: "top",
    },
    {
      target: "#tour-submit",
      content: "Preencha tudo e clique aqui para gerar seus resultados. É rápido, anônimo e 100% seguro!",
      placement: "top",
    }
  ];

  useEffect(() => {
    setMounted(true);
    // Only run tour automatically on the profile page on first visit
    if (pathname === "/perfil") {
      const hasSeenTour = localStorage.getItem("@cidadao:tourCompleted");
      if (!hasSeenTour) {
        // Small delay to ensure DOM is fully rendered
        setTimeout(() => {
          setRun(true);
        }, 800);
      }
    }
  }, [pathname]);

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem("@cidadao:tourCompleted", "true");
    }
  };

  const startTour = () => {
    setRun(true);
  };

  if (!mounted || pathname !== "/perfil") return null;

  return (
    <>
      <Joyride
        steps={steps}
        run={run}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          // @ts-ignore
          options: {
            primaryColor: "#2563eb", // blue-600 to match primary
            textColor: "#333",
            zIndex: 10000,
          },
          tooltip: {
            borderRadius: "12px",
            fontSize: "14px",
            fontFamily: "inherit",
          },
          buttonNext: {
            backgroundColor: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
            borderRadius: "6px",
            padding: "8px 16px",
            fontWeight: "bold",
          },
          buttonBack: {
            marginRight: 10,
            color: "#666",
          },
          buttonSkip: {
            color: "#666",
          }
        }}
        locale={{
          back: "Anterior",
          close: "Fechar",
          last: "Finalizar",
          next: "Próximo",
          skip: "Pular Tour"
        }}
      />
      
      {/* Floating Help Button */}
      <Button
        onClick={startTour}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-50 flex items-center justify-center bg-primary text-primary-foreground hover:scale-105 transition-transform"
        size="icon"
        aria-label="Ajuda"
      >
        <HelpCircle className="h-6 w-6" />
      </Button>
    </>
  );
}
