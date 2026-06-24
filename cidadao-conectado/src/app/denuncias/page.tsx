"use client";

import { useState } from "react";
import { ShieldAlert, AlertTriangle, Phone, ExternalLink, Filter } from "lucide-react";
import { nationalChannels, states, stateChannels, ViolationCategory } from "@/data/mockDenuncias";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

export default function DenunciasPage() {
  const [selectedCategory, setSelectedCategory] = useState<ViolationCategory | "Todos">("Todos");
  const [selectedState, setSelectedState] = useState<string>("SP");

  const categories: (ViolationCategory | "Todos")[] = [
    "Todos",
    "Mulher",
    "Idoso",
    "Criança e Adolescente",
    "Direitos Humanos",
    "Emergência",
    "Trabalho"
  ];

  const filteredChannels = nationalChannels.filter((channel) => {
    if (selectedCategory === "Todos") return true;
    return channel.categories.includes(selectedCategory as ViolationCategory);
  });

  const stateInfo = stateChannels[selectedState] || stateChannels["DEFAULT"];

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ShieldAlert className="w-8 h-8 text-primary" />
          Canais de Denúncia
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
          Encontre os contatos oficiais para registrar denúncias de violações de direitos, 
          emergências ou contatar órgãos de proteção.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-destructive/15 border border-destructive/30 rounded-xl p-4 sm:p-6 flex items-start gap-4"
      >
        <AlertTriangle className="w-6 h-6 text-destructive shrink-0 mt-1" />
        <div className="space-y-1">
          <h3 className="font-semibold text-destructive text-lg">Garantia de Anonimato</h3>
          <p className="text-destructive/80 leading-relaxed">
            Ligações para o <strong>Disque 100</strong> e <strong>Ligue 180</strong> são gratuitas e podem ser feitas de forma 
            totalmente anônima. Seus dados serão mantidos em sigilo absoluto. Não tenha medo de denunciar.
          </p>
        </div>
      </motion.div>

      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Phone className="w-6 h-6 text-muted-foreground" />
            Contatos Nacionais
          </h2>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
            <div className="flex gap-2">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "secondary"}
                  className="cursor-pointer whitespace-nowrap px-3 py-1 text-sm transition-all hover:scale-105 active:scale-95"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredChannels.map((channel) => (
              <motion.div
                key={channel.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full flex flex-col hover:border-primary/50 transition-colors shadow-sm hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl text-primary">{channel.name}</CardTitle>
                      <Badge variant="outline" className="font-mono text-base px-2 py-0.5 bg-primary/5">
                        {channel.number}
                      </Badge>
                    </div>
                    <CardDescription className="text-base text-foreground/80 leading-relaxed">
                      {channel.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {channel.categories.map((cat) => (
                        <Badge key={cat} variant="secondary" className="text-xs bg-secondary/50">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                    {channel.anonymousInfo && (
                      <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md italic">
                        {channel.anonymousInfo}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="pt-4 border-t">
                    {channel.type === "phone" ? (
                      <Button className="w-full gap-2 font-semibold" nativeButton={false} render={<a href={`tel:${channel.number}`} />}>
                        <Phone className="w-4 h-4" />
                        Ligar para {channel.number}
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full gap-2" nativeButton={false} render={<a href={channel.url} target="_blank" rel="noopener noreferrer" />}>
                        <ExternalLink className="w-4 h-4" />
                        Acessar Portal
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredChannels.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-12 text-center text-muted-foreground"
            >
              Nenhum canal encontrado para a categoria selecionada.
            </motion.div>
          )}
        </div>
      </section>

      <div className="my-8 border-t border-border/60"></div>

      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold mb-1">Apoio Estadual</h2>
            <p className="text-muted-foreground">
              Encontre Delegacias Virtuais e a Defensoria Pública do seu estado.
            </p>
          </div>
          
          <div className="w-full sm:w-64">
            <Select value={selectedState} onValueChange={(val) => setSelectedState(val || "Todos")}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Selecione o Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estados Brasileiros</SelectLabel>
                  {states.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label} ({state.value})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card hover:border-primary/50 transition-colors shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-primary" />
                Delegacia Virtual ({selectedState})
              </CardTitle>
              <CardDescription>
                Registre boletins de ocorrência online sem precisar sair de casa.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="secondary" className="w-full gap-2" nativeButton={false} render={<a href={stateInfo.delegaciaVirtualUrl} target="_blank" rel="noopener noreferrer" />}>
                Acessar Delegacia Virtual <ExternalLink className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-card hover:border-primary/50 transition-colors shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Defensoria Pública ({selectedState})
              </CardTitle>
              <CardDescription>
                Assistência jurídica integral e gratuita para cidadãos em situação de vulnerabilidade.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="secondary" className="w-full gap-2" nativeButton={false} render={<a href={stateInfo.defensoriaPublicaUrl} target="_blank" rel="noopener noreferrer" />}>
                Portal da Defensoria <ExternalLink className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
