import { SettingsView } from "@/components/features/SettingsView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configurações | Cidadão Conectado",
  description: "Gerencie suas configurações de conta, aparência e notificações do portal Cidadão Conectado.",
};

export default function ConfiguracoesPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container py-8 max-w-4xl mx-auto">
        <SettingsView />
      </div>
    </div>
  );
}
