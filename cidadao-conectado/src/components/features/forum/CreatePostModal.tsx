"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Send } from "lucide-react";
import { moderateText } from "@/lib/moderation";
import { ForumPost } from "@/data/forumMocks";
import { cn } from "@/lib/utils";

interface CreatePostModalProps {
  onPostCreated: (post: ForumPost) => void;
}

export function CreatePostModal({ onPostCreated }: CreatePostModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState<ForumPost["topic"]>("Outros");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      const newPost: ForumPost = {
        id: `post-${Date.now()}`,
        title: moderateText(title),
        content: moderateText(content),
        topic,
        author: isAnonymous ? "Cidadão Anônimo" : "Visitante (Você)",
        upvotes: 0,
        createdAt: new Date().toISOString(),
      };

      onPostCreated(newPost);
      setIsSubmitting(false);
      setOpen(false);
      setTitle("");
      setContent("");
      setTopic("Outros");
      setIsAnonymous(false);
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <button 
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
            )}
          />
        }
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Nova Pergunta
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Criar Novo Tópico</DialogTitle>
          <DialogDescription>
            Compartilhe sua dúvida ou dica com a comunidade. Lembre-se das regras de respeito.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Título da Pergunta</label>
            <Input 
              placeholder="Ex: Como dar entrada no seguro desemprego?" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <Select value={topic} onValueChange={(val: any) => setTopic(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tópico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Saúde">Saúde</SelectItem>
                <SelectItem value="Trabalho">Trabalho</SelectItem>
                <SelectItem value="Documentação">Documentação</SelectItem>
                <SelectItem value="Benefícios">Benefícios</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Relato ou Dúvida</label>
            <Textarea 
              placeholder="Escreva os detalhes aqui..." 
              className="min-h-[120px] resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg border border-border/50">
            <Checkbox 
              id="anonymous" 
              checked={isAnonymous} 
              onCheckedChange={(c) => setIsAnonymous(c as boolean)} 
            />
            <label
              htmlFor="anonymous"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Postar Anonimamente (Ocultar meu nome e foto)
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || !title.trim() || !content.trim()}>
            {isSubmitting ? "Publicando..." : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Publicar no Fórum
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
