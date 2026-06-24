import { LegislativeFeed } from "@/components/features/news/LegislativeFeed";
import { Newspaper } from "lucide-react";

export default function UpdatesPage() {
  return (
    <main className="flex-1 flex flex-col relative bg-transparent px-4 md:px-8 py-8 w-full max-w-screen-2xl mx-auto">
      <div className="mb-8 max-w-5xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3">
          <Newspaper className="h-8 w-8 text-primary" />
          Mural Cidadão
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          O feed oficial de transparência. Fique por dentro de novas portarias, projetos de lei e mudanças nos direitos fundamentais.
        </p>
      </div>

      <LegislativeFeed />
    </main>
  );
}
