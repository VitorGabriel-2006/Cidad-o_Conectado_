"use client";

import { useState, useEffect } from "react";
import { useShortcutStore, ShortcutAction } from "@/store/useShortcutStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Keyboard, Pencil, Check } from "lucide-react";

const shortcutLabels: Record<ShortcutAction, string> = {
  mainContent: "Ir para o Conteúdo Principal",
  search: "Focar na Barra de Pesquisa",
  footer: "Ir para o Rodapé (Links Úteis)",
  help: "Abrir este Mapa de Atalhos",
  tts: "Ouvir a página (Leitura Automática)"
};

export function ShortcutHelpModal() {
  const { shortcuts, isHelpModalOpen, toggleHelpModal, updateShortcut } = useShortcutStore();
  const [editingAction, setEditingAction] = useState<ShortcutAction | null>(null);

  useEffect(() => {
    if (!editingAction) return;

    const handleKeyBind = (e: KeyboardEvent) => {
      e.preventDefault();
      
      const key = e.key;
      // Impede teclas de controle do sistema puras (Tab, CapsLock, Enter, Escape)
      const forbiddenKeys = ['Tab', 'Escape', 'Enter', 'CapsLock', 'Shift', 'Control', 'Meta'];
      if (forbiddenKeys.includes(key) && !e.altKey && !e.ctrlKey) {
        setEditingAction(null);
        return;
      }

      let newKey = key;
      if (e.altKey && key.toLowerCase() !== 'alt') newKey = `Alt+${key.toLowerCase()}`;
      if (e.ctrlKey && key.toLowerCase() !== 'control') newKey = `Ctrl+${key.toLowerCase()}`;

      updateShortcut(editingAction, newKey);
      setEditingAction(null);
    };

    window.addEventListener('keydown', handleKeyBind);
    return () => window.removeEventListener('keydown', handleKeyBind);
  }, [editingAction, updateShortcut]);

  return (
    <Dialog open={isHelpModalOpen} onOpenChange={toggleHelpModal}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Keyboard className="w-6 h-6 text-primary" />
            <DialogTitle className="text-2xl font-bold">Mapa de Atalhos</DialogTitle>
          </div>
          <DialogDescription>
            Navegue pela plataforma rapidamente usando o teclado. Clique em "Editar" para personalizar uma tecla.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {(Object.entries(shortcuts) as [ShortcutAction, string][]).map(([action, keyCombo]) => (
            <div key={action} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40 hover:bg-muted/60 transition-colors">
              <span className="text-sm font-medium text-foreground">{shortcutLabels[action]}</span>
              <div className="flex items-center gap-3">
                {editingAction === action ? (
                  <kbd className="bg-primary/20 text-primary border border-primary/40 rounded px-2 py-1 text-sm font-mono animate-pulse">
                    Pressione a tecla...
                  </kbd>
                ) : (
                  <kbd className="bg-zinc-800 dark:bg-zinc-900 text-zinc-100 border border-zinc-600 dark:border-zinc-700 rounded px-2.5 py-1 text-sm font-mono shadow-sm">
                    {keyCombo}
                  </kbd>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={() => setEditingAction(editingAction === action ? null : action)}
                  title="Editar atalho"
                >
                  {editingAction === action ? <Check className="w-4 h-4 text-emerald-500" /> : <Pencil className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
