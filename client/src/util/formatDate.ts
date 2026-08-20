// Format: Weekday DD Month YYYY
export function formatEventDateTime(datetime: string | Date): string {
  const date = new Date(datetime);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  const formatter = new Intl.DateTimeFormat("en-NZ", {
    timeZone: "Pacific/Auckland",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});

  return `${parts.weekday} ${parts.day} ${parts.month} ${parts.year}`;
}
