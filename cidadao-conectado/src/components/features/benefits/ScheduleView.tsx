"use client";

import { useMemo } from "react";
import { Benefit } from "@/data/mockBenefits";
import { CalendarX, Calendar, Download, Printer, ChevronDown, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { downloadICalendar, CalendarEvent } from "@/lib/calendarExport";
import Link from "next/link";

interface ScheduleViewProps {
  favoriteBenefits: Benefit[];
}

export function ScheduleView({ favoriteBenefits }: ScheduleViewProps) {
  const events = useMemo(() => {
    const allEvents: (CalendarEvent & { colorClass: string; icon: React.ReactNode; originalDate: Date; benefitObj: Benefit })[] = [];

    favoriteBenefits.forEach(b => {
      // Payment Dates
      if (b.paymentDates) {
        b.paymentDates.forEach((dateStr, index) => {
          allEvents.push({
            id: `pay-${b.id}-${index}`,
            title: b.title,
            date: new Date(dateStr + "T00:00:00Z"), // simple parsing
            originalDate: new Date(dateStr + "T12:00:00Z"),
            type: "Pagamento",
            description: `Data prevista para o pagamento da parcela do benefício: ${b.title}.`,
            colorClass: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
            icon: <CheckCircle2 className="h-4 w-4" />,
            benefitObj: b
          });
        });
      }

      // Renewal Date
      if (b.renewalDate) {
        allEvents.push({
          id: `renew-${b.id}`,
          title: b.title,
          date: new Date(b.renewalDate + "T00:00:00Z"),
          originalDate: new Date(b.renewalDate + "T12:00:00Z"),
          type: "Renovação",
          description: `Prazo estimado para renovação ou atualização cadastral de ${b.title}.`,
          colorClass: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
          icon: <Clock className="h-4 w-4" />,
          benefitObj: b
        });
      }

      // Enrollment Dates
      if (b.enrollmentPeriod) {
        if (b.enrollmentPeriod.start) {
          allEvents.push({
            id: `start-${b.id}`,
            title: b.title,
            date: new Date(b.enrollmentPeriod.start + "T00:00:00Z"),
            originalDate: new Date(b.enrollmentPeriod.start + "T12:00:00Z"),
            type: "Inscrição Aberta",
            description: `Início do período de inscrições para ${b.title}.`,
            colorClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
            icon: <Calendar className="h-4 w-4" />,
            benefitObj: b
          });
        }
        
        // Handling both possible schema variations for end date (endDate or end)
        const endDateStr = (b.enrollmentPeriod as any).endDate || b.enrollmentPeriod.end;
        if (endDateStr) {
          allEvents.push({
            id: `end-${b.id}`,
            title: b.title,
            date: new Date(endDateStr + "T00:00:00Z"),
            originalDate: new Date(endDateStr + "T12:00:00Z"),
            type: "Prazo Final",
            description: `Último dia para se inscrever em ${b.title}.`,
            colorClass: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
            icon: <AlertCircle className="h-4 w-4" />,
            benefitObj: b
          });
        }
      }
    });

    // Sort chronologically
    return allEvents.sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime());
  }, [favoriteBenefits]);

  const groupedByMonth = useMemo(() => {
    const groups: Record<string, typeof events> = {};
    const formatter = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });
    
    events.forEach(e => {
      const monthStr = formatter.format(e.originalDate);
      const capitalizedMonth = monthStr.charAt(0).toUpperCase() + monthStr.slice(1);
      
      if (!groups[capitalizedMonth]) {
        groups[capitalizedMonth] = [];
      }
      groups[capitalizedMonth].push(e);
    });
    
    return groups;
  }, [events]);

  const handleDownloadIcal = () => {
    downloadICalendar(events);
  };

  const handlePrint = () => {
    window.print();
  };

  const isToday = (d: Date) => {
    const today = new Date();
    return d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
  };

  if (favoriteBenefits.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center justify-center text-center bg-card border border-border/50 rounded-xl shadow-sm">
        <div className="bg-muted p-5 rounded-full mb-4">
          <CalendarX className="h-10 w-10 text-muted-foreground opacity-60" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Seu cronograma está vazio</h3>
        <p className="text-muted-foreground max-w-md">
          Explore os programas e salve-os em "Meus Direitos" clicando na estrela para que o sistema gere automaticamente um calendário com suas datas de pagamento e prazos aqui.
        </p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center justify-center text-center bg-card border border-border/50 rounded-xl shadow-sm">
        <div className="bg-muted p-5 rounded-full mb-4">
          <Calendar className="h-10 w-10 text-muted-foreground opacity-60" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Nenhum evento agendado</h3>
        <p className="text-muted-foreground max-w-md">
          Os benefícios que você salvou são de fluxo contínuo ou ainda não possuem datas de pagamento cadastradas no sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-card p-4 rounded-xl border border-border/50 shadow-sm print:hidden">
        <div>
          <h2 className="font-bold text-lg">Meu Cronograma Pessoal</h2>
          <p className="text-sm text-muted-foreground">{events.length} eventos programados</p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" /> Imprimir
          </Button>
          <Button size="sm" onClick={handleDownloadIcal} className="gap-2">
            <Download className="h-4 w-4" /> Exportar (Google Agenda)
          </Button>
        </div>
      </div>

      {/* Print Only Header */}
      <div className="hidden print:block mb-8 text-center border-b pb-4">
        <h1 className="text-2xl font-bold">Cronograma de Benefícios: Cidadão Conectado</h1>
        <p className="text-sm text-gray-500">Documento gerado em {new Date().toLocaleDateString('pt-BR')}</p>
      </div>

      {/* Calendar List */}
      <div className="space-y-8">
        {Object.entries(groupedByMonth).map(([month, monthEvents]) => (
          <div key={month} className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm print:border-gray-300 print:shadow-none print:mb-6 break-inside-avoid">
            <div className="bg-muted/40 px-5 py-3 border-b border-border/50 print:bg-gray-100">
              <h3 className="font-bold text-lg capitalize">{month}</h3>
            </div>
            
            <Accordion type="multiple" className="w-full">
              {monthEvents.map((event) => {
                const todayHighlight = isToday(event.originalDate);
                const dayFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", weekday: "short" });
                const [dayWeek, dayNum] = dayFormatter.format(event.originalDate).split("., ");
                
                return (
                  <AccordionItem 
                    key={event.id} 
                    value={event.id} 
                    className={`border-b last:border-b-0 print:border-gray-200 ${todayHighlight ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                  >
                    <AccordionTrigger className="px-5 py-4 hover:no-underline group">
                      <div className="flex items-center gap-4 text-left w-full">
                        {/* Date Cube */}
                        <div className={`flex flex-col items-center justify-center shrink-0 w-14 h-14 rounded-lg border ${todayHighlight ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border group-hover:border-primary/40'} transition-colors`}>
                          <span className={`text-[10px] uppercase font-bold tracking-wider ${todayHighlight ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                            {dayWeek || dayFormatter.format(event.originalDate).substring(0, 3)}
                          </span>
                          <span className="text-xl font-black leading-none mt-0.5">
                            {event.originalDate.getDate().toString().padStart(2, '0')}
                          </span>
                        </div>

                        {/* Event Summary */}
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={`${event.colorClass} border px-2 py-0 h-5 text-[10px] font-bold uppercase tracking-wider print:bg-white print:text-black`}>
                              {event.type}
                            </Badge>
                            {todayHighlight && <span className="text-xs font-bold text-primary animate-pulse">(Hoje)</span>}
                          </div>
                          <h4 className="font-semibold text-base truncate">{event.title}</h4>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="px-5 pb-5 pt-1">
                      <div className="pl-[72px]">
                        <p className="text-sm text-muted-foreground mb-4">
                          {event.description}
                        </p>
                        <div className="flex flex-wrap gap-3 print:hidden">
                           <Link href={`/beneficios/${event.benefitObj.id}`}>
                             <Button variant="secondary" size="sm" className="h-8">Ver detalhes completos</Button>
                           </Link>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
}
