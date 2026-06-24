"use client";

import Link from "next/link";

import { Home, Landmark, CalendarDays, MessageSquare, Settings, Star, MapPin, ShieldAlert, BookOpen, FileText, Briefcase, HeartHandshake, BarChart, PiggyBank, Target, Newspaper, ShieldCheck, Lock } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useProfileStore } from "@/store/useProfileStore";

const servicos = [
  {
    title: "Início",
    url: "/",
    icon: Home,
  },
  {
    title: "Explorar Benefícios",
    url: "/beneficios",
    icon: Landmark,
  },
  {
    title: "Unidades Físicas",
    url: "/unidades",
    icon: MapPin,
  },
  {
    title: "Fórum Comunitário",
    url: "/comunidade",
    icon: MessageSquare,
  },
  {
    title: "Atualizações Legislativas",
    url: "/atualizacoes",
    icon: Newspaper,
  },
  {
    title: "Canais de Denúncia",
    url: "/denuncias",
    icon: ShieldAlert,
  },
  {
    title: "Glossário Cidadão",
    url: "/glossario",
    icon: BookOpen,
  },
  {
    title: "Cursos de Qualificação",
    url: "/cursos",
    icon: Briefcase,
  },
  {
    title: "Modelos de Documentos",
    url: "/documentos",
    icon: FileText,
  },
  {
    title: "Direitos da Família",
    url: "/direitos-familia",
    icon: HeartHandshake,
  },
];

const espacoCidadao = [
  {
    title: "Economia Tributária",
    url: "/economia",
    icon: PiggyBank,
  },
  {
    title: "Meus Direitos",
    url: "/favoritos",
    icon: Star,
  },
  {
    title: "Metas de Cidadania",
    url: "/metas",
    icon: Target,
  },
  {
    title: "Meu Cronograma",
    url: "/cronograma",
    icon: CalendarDays,
  },
  {
    title: "Segurança e Privacidade",
    url: "/seguranca",
    icon: ShieldCheck,
  },
];

const adminArea = [
  {
    title: "Painel de Feedbacks",
    url: "/admin/feedback",
    icon: BarChart,
  },
];

export function AppSidebar() {
  const userAccount = useProfileStore((state) => state.userAccount);
  const isAdmin = userAccount?.role === 'admin';

  return (
    <Sidebar variant="inset" collapsible="icon" className="bg-sidebar/80 backdrop-blur-md border-r-border/40">
      <SidebarHeader className="border-b border-border/40 p-4 bg-sidebar/50">
        <div className="flex items-center gap-2 font-bold text-lg text-primary">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            CC
          </div>
          <span className="truncate">Cidadão Conectado</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-sidebar/50">
        <SidebarGroup>
          <SidebarGroupLabel>Serviços Públicos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {servicos.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    render={<Link href={item.url} className="cursor-pointer select-none" />}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Espaço do Cidadão</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {espacoCidadao.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    render={<Link href={item.url} className="cursor-pointer select-none" />}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-rose-600/70 dark:text-rose-400/70 font-semibold">Administração (Beta)</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminArea.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      render={<Link href={item.url} className="cursor-pointer select-none" />}
                      className="hover:bg-rose-500/10 text-rose-700 dark:text-rose-400 transition-colors"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4 bg-sidebar/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Configurações"
              render={<Link href="/configuracoes" className="cursor-pointer select-none" />}
            >
              <Settings />
              <span>Configurações</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
