import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { calculateReliability } from "@/lib/dateUtils";
import { ShieldCheck, FileText, AlertTriangle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustBadgeProps {
  lastValidatedAt?: string;
  sourceType?: 'official' | 'system_summary';
  className?: string;
  showText?: boolean;
}

export function TrustBadge({ lastValidatedAt, sourceType, className, showText = true }: TrustBadgeProps) {
  const { status, message, tooltipText } = calculateReliability(lastValidatedAt, sourceType);

  let bgColor = "";
  let textColor = "";
  let Icon = HelpCircle;

  switch (status) {
    case 'official':
      bgColor = "bg-emerald-500/10 dark:bg-emerald-500/20";
      textColor = "text-emerald-700 dark:text-emerald-400";
      Icon = ShieldCheck;
      break;
    case 'summary':
      bgColor = "bg-blue-500/10 dark:bg-blue-500/20";
      textColor = "text-blue-700 dark:text-blue-400";
      Icon = FileText;
      break;
    case 'outdated':
      bgColor = "bg-amber-500/10 dark:bg-amber-500/20";
      textColor = "text-amber-700 dark:text-amber-400";
      Icon = AlertTriangle;
      break;
    case 'unknown':
    default:
      bgColor = "bg-slate-500/10 dark:bg-slate-500/20";
      textColor = "text-slate-700 dark:text-slate-400";
      break;
  }

  // Se não foi verificado e não queremos mostrar texto, talvez nem renderizar?
  // Mas a interface pede para ser consistente.
  if (status === 'unknown') return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger 
          render={<div className={cn(
            "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold tracking-wide uppercase border border-current/10 cursor-help transition-colors hover:bg-current/20",
            bgColor,
            textColor,
            className
          )} />}
        >
          <Icon className={cn("w-3.5 h-3.5", status === 'outdated' && "animate-pulse")} />
          {showText && <span>{message}</span>}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-sm">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
