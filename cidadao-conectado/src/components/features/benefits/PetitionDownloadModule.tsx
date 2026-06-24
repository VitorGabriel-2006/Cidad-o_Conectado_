import { FileText, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PetitionDownloadModuleProps {
  category: "saude" | "educacao" | "previdencia";
}

const textoPeticao = `ILUSTRÍSSIMO(A) SENHOR(A) SECRETÁRIO(A) MUNICIPAL DE SAÚDE DE LAGARTO/SE.

Objeto: Solicitação de Fornecimento de Medicamento Essencial.

[SEU NOME COMPLETO], brasileiro(a), [ESTADO CIVIL], portador(a) do RG nº [RG], inscrito(a) no CPF sob o nº [CPF], residente e domiciliado(a) na [SEU ENDEREÇO COMPLETO], CEP [CEP], vem, respeitosamente, perante Vossa Senhoria, requerer o que segue:

O(A) Requerente foi diagnosticado(a) com a enfermidade classificada pelo CID-10: [CÓDIGO CID], conforme atestado anexo. Para o tratamento, restou prescrito de forma imperativa o uso contínuo do medicamento: [NOME DO MEDICAMENTO E DOSAGEM].

O referido fármaco possui custo incompatível com as condições socioeconômicas do requerente. Conforme preceitua o Artigo 196 da Constituição Federal, a saúde é direito de todos e dever do Estado.

Diante do exposto, requer-se o fornecimento imediato do medicamento supracitado, na quantidade mensal de [QUANTIDADE MENSAL].

Lagarto/SE, _____ de _______________ de 2026.

____________________________________________________
Assinatura do(a) Requerente ou Responsável Legal`;

export function PetitionDownloadModule({ category }: PetitionDownloadModuleProps) {
  const handleDownload = () => {
    const blob = new Blob([textoPeticao], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'modelo_peticao.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6 border border-border/50 rounded-xl p-5 bg-background/60 backdrop-blur-md shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Modelos de Requerimentos e Petições</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Baixe os formulários pré-formatados para agilizar o seu pedido.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <Button
          onClick={handleDownload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-12 text-base"
        >
          <FileText className="w-5 h-5 mr-2" />
          Baixar Modelo Editável (.DOC)
        </Button>
      </div>

      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <p className="text-xs text-red-700 dark:text-red-400 leading-relaxed font-medium">
          Aviso: Estes modelos são peças informativas genéricas e não substituem a consultoria jurídica de um Advogado ou Defensor Público.
        </p>
      </div>
    </div>
  );
}
