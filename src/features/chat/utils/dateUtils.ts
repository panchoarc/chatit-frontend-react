import {
  format,
  isToday,
  isYesterday,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";
import { es } from "date-fns/locale";

/**
 * Formatea una fecha al estilo WhatsApp evitando "hace 0 minutos".
 */
export function formatLastSeen(date: Date): string {
  const now = new Date();

  if (isToday(date)) {
    const diffMinutes = differenceInMinutes(now, date);
    const diffSeconds = differenceInSeconds(now, date);

    if (diffMinutes < 1) {
      // Menos de 1 minuto → más intuitivo
      if (diffSeconds < 10) return "hace unos segundos";
      return "hace un momento";
    }

    if (diffMinutes < 60) {
      return `hace ${diffMinutes} ${diffMinutes === 1 ? "minuto" : "minutos"}`;
    }

    return `hoy a las ${format(date, "HH:mm", { locale: es })}`;
  }

  if (isYesterday(date)) {
    return `ayer a las ${format(date, "HH:mm", { locale: es })}`;
  }

  return `el ${format(date, "dd/MM/yyyy 'a las' HH:mm", { locale: es })}`;
}

export function formatDateKey(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString().split("T")[0]; // "2025-08-20"
}

export function humanizeDate(date: string): string {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Hoy";
  if (d.toDateString() === yesterday.toDateString()) return "Ayer";

  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
