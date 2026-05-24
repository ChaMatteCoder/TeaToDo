const DATA_KEYS = [
  'teatodo:tasks',
  'teatodo:smart-lists',
  'teatodo:routines',
  'teatodo:planning-notes',
  'teatodo:habits',
  'teatodo:habit-logs',
  'teatodo:focus-sessions',
  'teatodo:focus-settings',
  'teatodo:focus-preferences-sync',
  'teatodo:active-focus-session',
  'teatodo:preferences',
  'teatodo.daily-quote.v1',
  'teatodo.daily-quote.v2',
  'teatodo.daily-quote.v3',
  'teatodo:calendar-quote',
] as const;

export type TeaToDoBackup = {
  app: 'TeaToDo';
  version: 1;
  exportedAt: string;
  data: Partial<Record<(typeof DATA_KEYS)[number], string>>;
};

export function createLocalDataBackup(): TeaToDoBackup {
  const data: TeaToDoBackup['data'] = {};
  DATA_KEYS.forEach((key) => {
    const value = window.localStorage.getItem(key);
    if (value !== null) data[key] = value;
  });

  return {
    app: 'TeaToDo',
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  };
}

export function downloadLocalDataBackup() {
  const backup = createLocalDataBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  anchor.href = url;
  anchor.download = `teatodo-backup-${date}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function isBackup(value: unknown): value is TeaToDoBackup {
  if (!value || typeof value !== 'object') return false;
  const backup = value as Partial<TeaToDoBackup>;
  return backup.app === 'TeaToDo' && backup.version === 1 && Boolean(backup.data) && typeof backup.data === 'object';
}

export async function importLocalDataBackup(file: File) {
  const text = await file.text();
  const parsed: unknown = JSON.parse(text);
  if (!isBackup(parsed)) throw new Error('Arquivo de backup inválido.');

  DATA_KEYS.forEach((key) => {
    const value = parsed.data[key];
    if (typeof value === 'string') window.localStorage.setItem(key, value);
  });
}

export function clearTeaToDoLocalData() {
  DATA_KEYS.forEach((key) => window.localStorage.removeItem(key));
}
