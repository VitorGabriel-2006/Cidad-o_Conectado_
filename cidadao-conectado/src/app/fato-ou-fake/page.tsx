import { mockFakeNews } from "@/data/mockFakeNews";
import { FactCheckCard } from "@/components/features/factcheck/FactCheckCard";
import { ReportFakeNewsModal } from "@/components/features/factcheck/ReportFakeNewsModal";
import { ShieldCheck } from "lucide-react";

export default function FactCheckPage() {
  return (
    <main className="flex-1 flex flex-col max-w-screen-xl mx-auto px-4 md:px-8 py-10 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            Fato ou Fake Jurídico
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Verificamos as mensagens que circulam nas redes para proteger seus direitos.
          </p>
        </div>
        <ReportFakeNewsModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {mockFakeNews.map((item) => (
          <FactCheckCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}
