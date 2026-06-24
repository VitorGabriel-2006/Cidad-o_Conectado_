import { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Share2, Download, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface QRCodeShareModalProps {
  benefitId: string;
  benefitTitle: string;
}

export function QRCodeShareModal({ benefitId, benefitTitle }: QRCodeShareModalProps) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleDownload = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `beneficio-qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    const shareData = {
      title: benefitTitle,
      text: `Confira este benefício: ${benefitTitle}`,
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Erro ao compartilhar", err);
      }
    } else {
      // Fallback para cópia
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!url) return null;

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm" className="gap-2 shrink-0" />}>
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">Compartilhar</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background/80 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle>Compartilhar Benefício</DialogTitle>
          <DialogDescription>
            Mostre este QR Code para alguém escanear ou baixe a imagem para impressão.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-6 gap-6">
          <div ref={qrRef} className="bg-white p-4 rounded-xl shadow-sm border border-border/50 inline-block">
            <QRCodeCanvas 
              value={url} 
              size={256} 
              level="H" 
              includeMargin={false}
            />
          </div>

          <div className="flex w-full flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleDownload} 
              variant="secondary"
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar Imagem
            </Button>
            
            <Button 
              onClick={handleShare}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Link Copiado!
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Link
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
