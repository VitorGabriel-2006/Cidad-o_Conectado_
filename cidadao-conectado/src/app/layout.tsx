import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { Toaster } from "@/components/ui/sonner";
import { InteractiveTour } from "@/components/features/tutorial/InteractiveTour";
import { TTSReader } from "@/components/features/accessibility/TTSReader";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NotificationEngineRunner } from "@/components/NotificationEngineRunner";
import { ScreenReaderAnnouncer } from "@/components/accessibility/ScreenReaderAnnouncer";
import { FontSizeAdapter } from "@/components/features/accessibility/FontSizeAdapter";
import { QuickExitButton } from "@/components/features/accessibility/QuickExitButton";
import { KeyboardNavigationAdapter } from "@/components/features/accessibility/KeyboardNavigationAdapter";
import { SupportHub } from "@/components/features/support/SupportHub";
import { AuthProvider } from "@/components/auth/AuthProvider";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Cidadão Conectado",
  description: "Portal de acesso facilitado a serviços e direitos do cidadão.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={inter.variable}>
      <body suppressHydrationWarning className="min-h-[100dvh] bg-background font-sans antialiased selection:bg-primary selection:text-primary-foreground flex flex-col overflow-x-hidden overflow-y-auto print:block print:h-auto print:overflow-visible">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          themes={['light', 'dark', 'high-contrast', 'sepia', 'monochrome']}
        >
          <AuthProvider>
          <TooltipProvider>
          <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <div className="flex w-full flex-col min-h-[100dvh] overflow-hidden print:block print:h-auto print:overflow-visible">
              <AppHeader />
              <div className="flex-1 overflow-y-auto overflow-x-hidden print:block print:h-auto print:overflow-visible">
                {children}
              </div>
            </div>
          </SidebarProvider>
        </TooltipProvider>
        </AuthProvider>
        <InteractiveTour />
        <TTSReader />
        <SupportHub />
        <NotificationEngineRunner />
        <ScreenReaderAnnouncer />
        <FontSizeAdapter />
        <QuickExitButton />
        <KeyboardNavigationAdapter />
        <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
