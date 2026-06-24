"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut, Star, Volume2, Bell, BookOpenText } from "lucide-react";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProfileStore } from "@/store/useProfileStore";
import { useApplicationStore } from "@/store/useApplicationStore";
import { useDocumentStore } from "@/store/useDocumentStore";
import { calculateDocumentStatus } from "@/lib/documents";
import { useTTSStore } from "@/store/useTTSStore";
import { useAccessibilityStore } from "@/store/useAccessibilityStore";

export function AppHeader() {
  const profile = useProfileStore((state) => state.profile);
  const clearProfile = useProfileStore((state) => state.clearProfile);
  const isAuthenticated = useProfileStore((state) => state.isAuthenticated);
  const userAccount = useProfileStore((state) => state.userAccount);
  const logout = useProfileStore((state) => state.logout);
  const favorites = useApplicationStore((state) => state.favorites) || [];
  const alerts = useApplicationStore((state) => state.alerts);
  const documents = useDocumentStore((state) => state.documents);
  const openReader = useTTSStore((state) => state.openReader);
  const { isSimplifiedMode, toggleSimplifiedMode } = useAccessibilityStore();
  const [mounted, setMounted] = React.useState(false);

  const hasAlerts = alerts.length > 0 || documents.some(doc => {
    const status = calculateDocumentStatus(doc.expirationDate);
    return status === 'attention' || status === 'expired';
  });

  const handleReadPage = () => {
    const mainElement = document.querySelector("main");
    if (mainElement) {
      // Limitar o texto para evitar crash do SpeechSynthesisUtterance no Chrome
      const text = mainElement.innerText.trim().substring(0, 1000);
      if (text) {
        openReader(text);
      }
    }
  };

  const pathname = usePathname() || "";
  const isHomePage = pathname === "/" || pathname === "/home";

  const getPageName = (path: string) => {
    if (!path || path === "/") return "Visão Geral";
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return "Visão Geral";
    
    const nameMap: Record<string, string> = {
      'beneficios': 'Benefícios',
      'perfil': 'Meu Perfil',
      'favoritos': 'Favoritos',
      'alertas': 'Alertas',
      'cronograma': 'Cronograma',
      'documentos': 'Documentos',
      'unidades': 'Unidades',
      'glossario': 'Glossário',
      'denuncias': 'Ouvidoria',
      'sobre': 'Sobre',
      'seguranca': 'Segurança',
      'admin': 'Administração',
      'fato-ou-fake': 'Fato ou Fake',
    };
    
    const key = segments[0];
    return nameMap[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ');
  };

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border/40 bg-background/60 backdrop-blur-md px-2 md:px-4 shadow-sm">
      <div className="flex flex-1 items-center gap-1 md:gap-2">
        <SidebarTrigger className="-ml-1 h-11 w-11" />
        <Separator orientation="vertical" className="mr-2 h-4 hidden md:block" />
        
        {!isHomePage && (
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Início</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{getPageName(pathname)}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>

      <div className="flex items-center gap-4">
        {mounted && favorites.length > 0 && (
          <Link href="/favoritos">
            <div className="flex items-center gap-1.5 text-sm font-medium bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 px-3 py-1.5 rounded-full border border-yellow-500/20 transition-colors cursor-pointer">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="hidden sm:inline">{favorites.length} salvos</span>
            </div>
          </Link>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 rounded-full border-primary/20 text-primary hover:bg-primary/10"
          onClick={handleReadPage}
        >
          <Volume2 className="w-4 h-4" />
          <span className="hidden sm:inline">Ouvir Página</span>
        </Button>

        {mounted && (
          <Button 
            variant={isSimplifiedMode ? "default" : "outline"}
            size="sm" 
            className={`gap-2 rounded-full transition-colors ${
              isSimplifiedMode 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "border-primary/20 text-primary hover:bg-primary/10"
            }`}
            onClick={toggleSimplifiedMode}
          >
            <BookOpenText className="w-4 h-4" />
            <span className="hidden sm:inline">Leitura Fácil</span>
          </Button>
        )}

        {mounted && (
          <Link href="/alertas">
            <Button variant="ghost" size="icon" aria-label="Central de Alertas" className="relative rounded-full hover:bg-muted" title="Central de Alertas">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {hasAlerts && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background animate-pulse" />
              )}
            </Button>
          </Link>
        )}
        
        {!mounted ? (
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
        ) : !isAuthenticated ? (
          <Link href="/seguranca">
            <Button variant="default" size="sm" className="rounded-full px-4">
              Entrar / Cadastrar
            </Button>
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" className="relative h-8 w-8 rounded-full" />
              }
            >
              <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                <AvatarImage src="/placeholder-user.jpg" alt={userAccount?.name || "Usuário"} />
                <AvatarFallback>{userAccount?.name?.substring(0, 2).toUpperCase() || "CC"}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userAccount?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {userAccount?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<a href="/perfil" />}>
                <User className="mr-2 h-4 w-4" />
                <span>Meu Painel / Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair da Conta</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
