import { Metadata } from "next";
import { FacilitiesMapView } from "@/components/features/map/FacilitiesMapView";

export const metadata: Metadata = {
  title: "Unidades Físicas | Cidadão Conectado",
  description: "Encontre postos de atendimento, CRAS e INSS mais próximos de você.",
};

export default function UnidadesPage() {
  return (
    <main className="h-[calc(100vh-4rem)] w-full bg-background flex flex-col overflow-hidden">
      <FacilitiesMapView />
    </main>
  );
}
