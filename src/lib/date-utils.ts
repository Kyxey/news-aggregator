export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatDateCompact(date: Date): string {
  return formatDateISO(date).replace(/-/g, '');
}
