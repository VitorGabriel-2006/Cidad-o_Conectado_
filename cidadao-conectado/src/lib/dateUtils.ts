export interface EnrollmentPeriod {
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  isContinuous: boolean;
}

export interface BenefitTimeStatus {
  status: "Aberto" | "Fechado" | "Fluxo Contínuo";
  daysLeft?: number;
  hoursLeft?: number;
  formattedEndDate?: string;
  isClosedMoreThan30Days: boolean;
}

export function getBrasiliaDate(): Date {
  const now = new Date();
  const options = { timeZone: "America/Sao_Paulo" };
  const brString = now.toLocaleString("en-US", options);
  return new Date(brString);
}

export function parseDateString(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  // Assume expiration at 23:59:59
  return new Date(year, month - 1, day, 23, 59, 59);
}

export function getBenefitTimeStatus(period?: EnrollmentPeriod): BenefitTimeStatus {
  if (!period || period.isContinuous) {
    return {
      status: "Fluxo Contínuo",
      isClosedMoreThan30Days: false
    };
  }

  const now = getBrasiliaDate();

  if (period.startDate) {
    // Parse it at 00:00:00 to consider the whole day of start
    const [year, month, day] = period.startDate.split("-").map(Number);
    const startDate = new Date(year, month - 1, day, 0, 0, 0);
    
    if (now.getTime() < startDate.getTime()) {
      return {
        status: "Fechado", // Aguardando Abertura
        isClosedMoreThan30Days: false
      };
    }
  }

  if (period.endDate) {
    const endDate = parseDateString(period.endDate);
    const diffMs = endDate.getTime() - now.getTime();
    
    const formattedEndDate = endDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });

    if (diffMs < 0) {
      // Closed
      const daysClosed = Math.abs(Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      return {
        status: "Fechado",
        formattedEndDate,
        isClosedMoreThan30Days: daysClosed > 30
      };
    } else {
      // Open
      const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
      const daysLeft = Math.floor(hoursLeft / 24);
      
      return {
        status: "Aberto",
        formattedEndDate,
        daysLeft,
        hoursLeft,
        isClosedMoreThan30Days: false
      };
    }
  }

  return {
    status: "Aberto",
    isClosedMoreThan30Days: false
  };
}

export interface ReliabilityStatus {
  status: 'official' | 'summary' | 'outdated' | 'unknown';
  message: string;
  tooltipText: string;
}

export function calculateReliability(lastValidatedAt?: string, sourceType?: 'official' | 'system_summary'): ReliabilityStatus {
  if (!lastValidatedAt) {
    return {
      status: 'unknown',
      message: 'Não verificado',
      tooltipText: 'Este benefício ainda não passou pela nossa auditoria de dados.'
    };
  }

  // Parse handling timezones (ignoring time)
  const [year, month, day] = lastValidatedAt.split("-").map(Number);
  const validatedDate = new Date(year, month - 1, day);
  
  const now = getBrasiliaDate();
  const diffTime = now.getTime() - validatedDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const formattedDate = validatedDate.toLocaleDateString('pt-BR');

  if (diffDays > 180) {
    return {
      status: 'outdated',
      message: 'Pode estar desatualizado',
      tooltipText: `Atenção: Esta informação foi validada há mais de 6 meses (${formattedDate}). As regras do governo podem ter mudado. Confirme no órgão responsável.`
    };
  }

  if (sourceType === 'system_summary') {
    return {
      status: 'summary',
      message: 'Resumo Simplificado',
      tooltipText: `Esta informação foi validada com a fonte oficial em ${formattedDate}. O conteúdo original foi reescrito para facilitar a leitura.`
    };
  }

  return {
    status: 'official',
    message: 'Verificado',
    tooltipText: `Esta informação foi validada com a fonte oficial em ${formattedDate}. O conteúdo reflete as regras do órgão responsável.`
  };
}
