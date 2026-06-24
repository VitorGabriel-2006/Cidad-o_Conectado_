"use client";

import { useState, useEffect } from "react";
import { useFeedbackStore } from "@/store/useFeedbackStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThumbsDown, ThumbsUp, MessageSquare, BarChart3, AlertCircle } from "lucide-react";
import { AdminGuard } from "@/components/layout/AdminGuard";

export default function AdminFeedbackDashboard() {
  const { getDashboardMetrics } = useFeedbackStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full max-w-screen-2xl mx-auto py-10 px-4 md:px-8 space-y-8">
         <div className="h-64 flex items-center justify-center text-muted-foreground animate-pulse">
           Carregando dados do painel...
         </div>
      </div>
    );
  }

  const metrics = getDashboardMetrics();

  // Convert the items map to an array and sort by worst performing (most negative votes)
  const itemsArray = Object.entries(metrics.items).map(([id, data]) => ({
    id,
    ...data,
    total: data.helpful + data.notHelpful,
    negativeRate: data.notHelpful / (data.helpful + data.notHelpful) || 0
  })).sort((a, b) => b.negativeRate - a.negativeRate);

  return (
    <AdminGuard>
      <div className="w-full max-w-screen-2xl mx-auto py-10 px-4 md:px-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-slate-800 dark:text-slate-200">
            <BarChart3 className="h-8 w-8 text-primary" />
            Painel de Feedback
          </h1>
          <p className="text-muted-foreground">
            Acompanhe a eficácia das explicações e leia as sugestões dos cidadãos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total de Avaliações</CardDescription>
              <CardTitle className="text-4xl">{metrics.totalVotes}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Aprovação Geral</CardDescription>
              <CardTitle className="text-4xl text-emerald-600">{metrics.approvalRate}%</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardDescription>Textos que precisam de revisão</CardDescription>
              <CardTitle className="text-4xl text-rose-600">
                {itemsArray.filter(i => i.negativeRate > 0.5 && i.total > 1).length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <h2 className="text-2xl font-bold tracking-tight mt-10 mb-6 flex items-center gap-2">
          <AlertCircle className="h-6 w-6 text-amber-500" />
          Conteúdos com Pior Avaliação
        </h2>

        {itemsArray.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-xl border border-border/50">
            Nenhum feedback registrado ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {itemsArray.map((item) => (
              <Card key={item.id} className={item.negativeRate > 0.5 ? "border-rose-200 dark:border-rose-900/50" : ""}>
                <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <CardTitle className="text-lg text-primary">{item.itemName}</CardTitle>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                        <ThumbsUp className="h-4 w-4" /> {item.helpful}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-rose-600">
                        <ThumbsDown className="h-4 w-4" /> {item.notHelpful}
                      </div>
                      <div className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-bold ml-2">
                        {Math.round((item.helpful / item.total) * 100)}% Útil
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <h4 className="text-sm font-semibold flex items-center gap-2 mb-4 text-slate-700 dark:text-slate-300">
                    <MessageSquare className="h-4 w-4" /> 
                    Sugestões de Melhoria ({item.comments.length})
                  </h4>
                  
                  {item.comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">Nenhum comentário escrito para este item.</p>
                  ) : (
                    <div className="space-y-3">
                      {item.comments.map((comment, idx) => (
                        <div key={idx} className="bg-muted/50 p-3 rounded-lg text-sm border border-border/40">
                          "{comment}"
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
