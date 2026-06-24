"use client";

import { useApplicationStore } from "@/store/useApplicationStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useSocialPriority } from "@/hooks/useSocialPriority";
import { mockBenefits } from "@/data/mockBenefits";
import { Landmark, FileText, CheckCircle2 } from "lucide-react";

export function BenefitPrintView() {
  const profile = useProfileStore((state) => state.profile);
  const priority = useSocialPriority();
  const favorites = useApplicationStore((state) => state.favorites) || [];

  // Mapear os benefícios favoritados ou usar a lista toda filtrável (para este escopo, usaremos os favoritos)
  const printBenefits = favorites.length > 0 
    ? favorites.map(id => mockBenefits.find(b => b.id === id)).filter((b): b is NonNullable<typeof b> => !!b)
    : []; // Se estiver vazio, poderíamos mostrar os elegíveis, mas para o resumo oficial, exigiremos seleção.

  const currentDate = new Date().toLocaleDateString('pt-BR');
  const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="hidden print:block w-full max-w-[21cm] mx-auto bg-white text-slate-900 font-sans p-8">
      {/* Cabeçalho Oficial */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">
          Relatório de Direitos Sociais
        </h1>
        <div className="flex justify-between items-end mt-2">
          <p className="text-sm font-semibold text-slate-600">
            Gerado pelo Portal Cidadão Conectado
          </p>
          <p className="text-xs font-medium text-slate-500">
            Emitido em: {currentDate} às {currentTime}
          </p>
        </div>
      </div>

      {/* Diagnóstico do Perfil */}
      {profile && (
        <div className="border border-slate-300 rounded-lg p-5 mb-8 bg-slate-50 print-color-adjust-exact">
          <h2 className="text-lg font-bold text-slate-900 mb-3 uppercase tracking-wide border-b border-slate-200 pb-2">
            Diagnóstico do Perfil
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-slate-500 font-semibold mb-0.5">Renda Familiar Total</span>
              <span className="font-bold">{profile.totalFamilyIncome || "Não informada"}</span>
            </div>
            <div>
              <span className="block text-slate-500 font-semibold mb-0.5">Composição Familiar</span>
              <span className="font-bold">{profile.familyMembers || 1} pessoas</span>
            </div>
            <div>
              <span className="block text-slate-500 font-semibold mb-0.5">Renda Per Capita Calculada</span>
              <span className="font-bold">
                {profile.perCapitaIncome ? `R$ ${profile.perCapitaIncome.toFixed(2).replace('.', ',')}` : "Não calculada"}
              </span>
            </div>
            <div>
              <span className="block text-slate-500 font-semibold mb-0.5">Grau de Vulnerabilidade</span>
              <span className="font-black uppercase">{priority.label}</span>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem se não houver favoritos */}
      {printBenefits.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-slate-300 rounded-lg">
          <p className="text-slate-500 font-medium">Nenhum benefício foi selecionado (favoritado) para este relatório.</p>
          <p className="text-sm text-slate-400 mt-2">Volte ao portal e marque a "estrela" nos benefícios do seu interesse.</p>
        </div>
      )}

      {/* Detalhamento dos Benefícios */}
      <div className="space-y-8 print:block">
        {printBenefits.map((benefit, index) => (
          <div key={benefit.id} className={`print:block print:break-inside-avoid border border-slate-300 rounded-lg p-6 ${index === 0 ? "print:break-before-page print:mt-8" : "print:break-before-page print:mt-8"}`}>
            <div className="flex items-start gap-3 mb-4 border-b border-slate-200 pb-4">
              <Landmark className="h-6 w-6 text-slate-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight">{benefit.title}</h3>
                {benefit.orgaoResponsavel ? (
                  <p className="text-sm font-semibold text-slate-600 mt-1">Órgão: {benefit.orgaoResponsavel}</p>
                ) : benefit.providerDetails?.name ? (
                  <p className="text-sm font-semibold text-slate-600 mt-1">Órgão: {benefit.providerDetails.name}</p>
                ) : null}
              </div>
            </div>

            <p className="text-sm text-slate-700 mb-6 leading-relaxed">
              {benefit.description}
            </p>

            {benefit.requirements && Object.keys(benefit.requirements).length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-bold uppercase text-slate-800 flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4" /> Critérios de Elegibilidade
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700">
                  {benefit.requirements.maxIncome && (
                    <li>Renda familiar per capita máxima de R$ {Number(benefit.requirements.maxIncome).toFixed(2).replace('.', ',')}</li>
                  )}
                  {benefit.requirements.minAge !== undefined && (
                    <li>Idade mínima de {benefit.requirements.minAge} anos</li>
                  )}
                  {benefit.requirements.maxAge !== undefined && (
                    <li>Idade máxima de {benefit.requirements.maxAge} anos</li>
                  )}
                  {benefit.requirements.requiresCadUnico && (
                    <li>Exige inscrição ativa no Cadastro Único (CadÚnico)</li>
                  )}
                  {benefit.requirements.requiresStudent && (
                    <li>Estar matriculado em instituição de ensino</li>
                  )}
                </ul>
              </div>
            )}

            {benefit.documents && benefit.documents.length > 0 && (
              <div>
                <h4 className="text-sm font-bold uppercase text-slate-800 flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4" /> Documentação Obrigatória
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700">
                  {benefit.documents.map((doc, idx) => (
                    <li key={idx}>{doc.name} {doc.isOptional && "(Opcional)"}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 pt-4 border-t border-slate-300 text-center text-xs text-slate-500 font-medium">
        Este documento tem caráter informativo e não substitui a análise oficial do órgão responsável.
      </div>
    </div>
  );
}
