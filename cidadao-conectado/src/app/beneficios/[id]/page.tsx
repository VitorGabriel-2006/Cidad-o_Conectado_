import { Metadata } from 'next';
import { mockBenefits } from '@/data/mockBenefits';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, ShieldCheck, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReadingModeOverlay } from '@/components/features/benefits/ReadingModeOverlay';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const benefit = mockBenefits.find((b) => b.id === id);
  
  if (!benefit) {
    return {
      title: 'Benefício não encontrado | Cidadão Conectado',
    };
  }

  return {
    title: `${benefit.title} | Cidadão Conectado`,
    description: benefit.description,
    openGraph: {
      title: benefit.title,
      description: benefit.description,
      type: 'article',
      url: `/beneficios/${benefit.id}`,
      siteName: 'Cidadão Conectado',
    },
    twitter: {
      card: 'summary_large_image',
      title: benefit.title,
      description: benefit.description,
    }
  };
}

export default async function BenefitSharePage({ params }: PageProps) {
  const { id } = await params;
  const benefit = mockBenefits.find((b) => b.id === id);

  if (!benefit) {
    notFound();
  }

  return (
    <div className="min-h-[80vh] bg-background py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        <Link href="/beneficios" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Voltar para o Catálogo
        </Link>
        
        <Card className="border-border/50 shadow-lg overflow-hidden bg-card">
          <CardHeader className="bg-primary/5 border-b border-border/50 pb-8 pt-10 px-6 sm:px-10">
            <div className="flex items-center gap-2 mb-4">
               <ShieldCheck className="w-6 h-6 text-primary" />
               <span className="font-semibold text-primary uppercase tracking-wider text-sm">Garantia de Direito</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <CardTitle className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {benefit.title}
              </CardTitle>
              <div className="shrink-0">
                <ReadingModeOverlay title={benefit.title} content={benefit.description} />
              </div>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-prose">
              {benefit.description}
            </p>
          </CardHeader>
          <CardContent className="pt-8 px-6 sm:px-10 space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Quem tem direito?</h3>
              <div className="flex flex-wrap gap-2">
                {benefit.targetGroups.map(g => (
                  <span key={g} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                    {g}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-6 sm:p-8 border border-blue-100 dark:border-blue-900/30 text-center space-y-4">
               <h4 className="font-semibold text-lg text-blue-900 dark:text-blue-300">Quer descobrir se você atende aos requisitos?</h4>
               <p className="text-blue-800/80 dark:text-blue-400/80 text-sm max-w-prose mx-auto">
                 Crie um Perfil Anônimo e veja instantaneamente os requisitos, passo a passo e documentação necessária para este e dezenas de outros direitos.
               </p>
               <Button nativeButton={false} render={<Link href="/perfil" />} size="lg" className="mt-4 rounded-full px-8 shadow-md hover:shadow-lg transition-all">
                 Fazer meu Perfil Anônimo agora
               </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
