// Utilitário para exportar eventos no formato iCalendar (.ics)

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: string;
  description: string;
}

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatDateToICS(date: Date, isAllDay: boolean = true) {
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  
  if (isAllDay) {
    return `${year}${month}${day}`;
  }
  
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

export function generateICalendar(events: CalendarEvent[]): string {
  let icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cidadao Conectado//Cronograma//PT-BR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH"
  ];

  events.forEach(event => {
    // For all-day events, end date must be the next day
    const endDate = new Date(event.date);
    endDate.setUTCDate(endDate.getUTCDate() + 1);

    const formattedStart = formatDateToICS(event.date, true);
    const formattedEnd = formatDateToICS(endDate, true);
    
    // Create a unique stamp
    const stamp = formatDateToICS(new Date(), false);

    icsContent = icsContent.concat([
      "BEGIN:VEVENT",
      `UID:${event.id}-${event.date.getTime()}@cidadaoconectado.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${formattedStart}`,
      `DTEND;VALUE=DATE:${formattedEnd}`,
      `SUMMARY:${event.type}: ${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
      "END:VEVENT"
    ]);
  });

  icsContent.push("END:VCALENDAR");

  return icsContent.join("\r\n");
}

export function downloadICalendar(events: CalendarEvent[], filename: string = "cronograma-beneficios.ics") {
  const content = generateICalendar(events);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
