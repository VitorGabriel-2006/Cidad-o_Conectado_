import { CommunityForum } from "@/components/features/forum/CommunityForum";
import { UsersRound } from "lucide-react";

export default function CommunityPage() {
  return (
    <main className="flex-1 flex flex-col relative bg-transparent px-4 md:px-8 py-8 w-full max-w-screen-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3">
          <UsersRound className="h-8 w-8 text-primary" />
          Fórum Comunitário
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Apoio mútuo e troca de experiências entre cidadãos sobre direitos e serviços públicos.
        </p>
      </div>

      <CommunityForum />
    </main>
  );
}
