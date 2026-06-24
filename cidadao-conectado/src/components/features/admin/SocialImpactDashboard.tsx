"use client";

import { useState, useMemo } from "react";
import { mockAccessLogs, AccessLog } from "@/data/analyticsData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, FileText, Printer, BarChart3, Users, CheckCircle2 } from "lucide-react";

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#64748b'];

export function SocialImpactDashboard() {
  const [yearFilter, setYearFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [raceFilter, setRaceFilter] = useState("all");

  // Filters
  const filteredLogs = useMemo(() => {
    return mockAccessLogs.filter(log => {
      const date = new Date(log.timestamp);
      if (yearFilter !== "all" && date.getFullYear().toString() !== yearFilter) return false;
      if (monthFilter !== "all" && (date.getMonth() + 1).toString() !== monthFilter) return false;
      if (cityFilter !== "all" && log.userDemographics.city !== cityFilter) return false;
      if (raceFilter !== "all" && log.userDemographics.race !== raceFilter) return false;
      return true;
    });
  }, [yearFilter, monthFilter, cityFilter, raceFilter]);

  // Derived Metrics
  const resolutionRate = useMemo(() => {
    if (filteredLogs.length === 0) return 0;
    const positive = filteredLogs.filter(l => l.feedbackPositive).length;
    return Math.round((positive / filteredLogs.length) * 100);
  }, [filteredLogs]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredLogs.forEach(log => {
      counts[log.category] = (counts[log.category] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, acessos: counts[key] })).sort((a, b) => b.acessos - a.acessos);
  }, [filteredLogs]);

  const raceData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredLogs.forEach(log => {
      counts[log.userDemographics.race] = (counts[log.userDemographics.race] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [filteredLogs]);

  const topCategory = categoryData.length > 0 ? categoryData[0].name : "N/A";

  // Available Filter Options based on full data
  const availableYears = Array.from(new Set(mockAccessLogs.map(l => new Date(l.timestamp).getFullYear().toString()))).sort();
  const availableCities = Array.from(new Set(mockAccessLogs.map(l => l.userDemographics.city))).sort();
  const availableRaces = Array.from(new Set(mockAccessLogs.map(l => l.userDemographics.race))).sort();

  // Export Logic
  const handleExportCSV = () => {
    const headers = ["ID", "Beneficio", "Categoria", "Data", "Cidade", "Genero", "Raca", "Idade", "Resolvido"];
    const rows = filteredLogs.map(log => [
      log.id,
      log.accessedBenefitId,
      log.category,
      new Date(log.timestamp).toLocaleDateString("pt-BR"),
      log.userDemographics.city,
      log.userDemographics.gender,
      log.userDemographics.race,
      log.userDemographics.ageGroup,
      log.feedbackPositive ? "Sim" : "Nao"
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_impacto_social_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Impacto Social</h1>
          <p className="text-muted-foreground mt-1">Dashboard Administrativo de Inteligência de Dados Públicos</p>
        </div>
        
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={handleExportCSV} className="gap-2">
            <Download className="h-4 w-4" /> CSV
          </Button>
          <Button onClick={handlePrintPDF} className="gap-2">
            <Printer className="h-4 w-4" /> Exportar PDF
          </Button>
        </div>
      </div>

      {/* Filters (Hidden in print) */}
      <Card className="mb-8 border-border/50 shadow-sm print:hidden">
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ano</label>
            <Select value={yearFilter} onValueChange={(val) => setYearFilter(val || "all")}>
              <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Anos</SelectItem>
                {availableYears.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mês</label>
            <Select value={monthFilter} onValueChange={(val) => setMonthFilter(val || "all")}>
              <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Meses</SelectItem>
                {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                  <SelectItem key={m} value={m.toString()}>{m.toString().padStart(2, '0')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Município (SE)</label>
            <Select value={cityFilter} onValueChange={(val) => setCityFilter(val || "all")}>
              <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Municípios</SelectItem>
                {availableCities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Demografia (Raça)</label>
            <Select value={raceFilter} onValueChange={(val) => setRaceFilter(val || "all")}>
              <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Raças</SelectItem>
                {availableRaces.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-border/50 shadow-sm bg-card/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Volume de Acessos</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredLogs.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Registros no período filtrado</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Resolução</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{resolutionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Acessos com feedback positivo</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Demanda Principal</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate" title={topCategory}>{topCategory}</div>
            <p className="text-xs text-muted-foreground mt-1">Categoria mais buscada</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-border/50 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle>Acessos por Categoria</CardTitle>
            <CardDescription>Distribuição de buscas por eixo de direito civil</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            {filteredLogs.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888833" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--background)' }}
                    cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
                  />
                  <Bar dataKey="acessos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">Sem dados para os filtros selecionados</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle>Perfil Demográfico (Raça)</CardTitle>
            <CardDescription>Distribuição dos cidadãos nos acessos</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            {filteredLogs.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={raceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {raceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--background)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">Sem dados para os filtros selecionados</div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
