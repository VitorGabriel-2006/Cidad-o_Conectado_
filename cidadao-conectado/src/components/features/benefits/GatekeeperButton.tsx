"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function GatekeeperButton() {
  const profile = useProfileStore((state) => state.profile);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleExploreClick = () => {
    if (!profile) {
      router.push("/perfil");
    } else {
      router.push("/beneficios");
    }
  };

  return (
    <Button 
      size="lg" 
      className="rounded-full px-8 h-12 text-base font-semibold bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200" 
      onClick={handleExploreClick}
      disabled={!mounted}
    >
      Explorar Benefícios
      <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  );
}
