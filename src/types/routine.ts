export interface RecurringRoutine {
  id: string;
  title: string;
  description?: string;
  time?: string;
  /**
   * Dias da semana no padrão Date/getDay: 0 = domingo, 1 = segunda ... 6 = sábado.
   */
  daysOfWeek: number[];
  category?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
