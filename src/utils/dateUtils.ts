export function getJourSemaine(dateStr: string): string {
  const cleaned = dateStr.replace(/[-.]/g, '/').trim();
  const formats = [
    /^(\d{4})\/(\d{2})\/(\d{2})$/, // AAAA/MM/JJ
    /^(\d{2})\/(\d{2})\/(\d{4})$/, // JJ/MM/AAAA
  ];

  let date: Date | null = null;

  for (const format of formats) {
    const match = cleaned.match(format);
    if (match) {
      const [_, part1, part2, part3] = match;
      const year = format === formats[0] ? +part1 : +part3;
      const month = format === formats[0] ? +part2 : +part2;
      const day = format === formats[0] ? +part3 : +part1;

      // Création locale (évite UTC)
      date = new Date(year, month - 1, day);
      break;
    }
  }

  if (!date || isNaN(date.getTime())) return 'Date invalide';

  return date.toLocaleDateString('fr-CA', { weekday: 'long' });
}