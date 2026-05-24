import { ChangeEvent, ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, CupSoda, Download, Image, Leaf, MoreVertical, RotateCcw, Save, Trash2, Upload } from 'lucide-react';
import teaCupAsset from '../../assets/02.png';
import botanicalAsset from '../../assets/04.png';
import paperAsset from '../../assets/05.png';
import { HangingTag } from '../components/HangingTag';
import { teaThemes } from '../config/themes';
import { DEFAULT_PREFERENCES } from '../config/preferences';
import { MobileNav } from '../components/MobileNav';
import { Sidebar } from '../components/Sidebar';
import { usePreferences } from '../hooks/usePreferences';
import type {
  CardStyle,
  FocusPresetPreference,
  FontScale,
  IconShape,
  InterfaceDensity,
  TeaToDoPreferences,
  WallpaperId,
} from '../types/preferences';
import { readImageAsDataUrl } from '../utils/fileUpload';
import { clearTeaToDoLocalData, downloadLocalDataBackup, importLocalDataBackup } from '../utils/localData';

type ToastState = { message: string; type: 'success' | 'error' } | null;

const cardStyles: Array<{ value: CardStyle; label: string; description: string }> = [
  { value: 'soft', label: 'Suave', description: 'Cantos generosos e sombra delicada.' },
  { value: 'defined', label: 'Definido', description: 'Bordas mais presentes e separação clara.' },
  { value: 'minimal', label: 'Minimalista', description: 'Menos sombra, mais silêncio visual.' },
];

const densities: Array<{ value: InterfaceDensity; label: string }> = [
  { value: 'compact', label: 'Compacta' },
  { value: 'comfortable', label: 'Confortável' },
  { value: 'airy', label: 'Aérea' },
];

const iconShapes: Array<{ value: IconShape; label: string }> = [
  { value: 'rounded', label: 'Arredondado' },
  { value: 'soft', label: 'Suave' },
  { value: 'square', label: 'Quadrado' },
];

const focusPresets: Array<{ value: FocusPresetPreference; label: string; detail: string }> = [
  { value: 'short', label: '25 min', detail: 'Foco curto' },
  { value: 'deep', label: '50 min', detail: 'Foco profundo' },
  { value: 'long', label: '90 min', detail: 'Foco longo' },
  { value: 'custom', label: 'Personalizado', detail: 'Seu ritmo' },
];

const wallpapers: Array<{ value: WallpaperId; label: string; asset?: string; tone: string }> = [
  { value: 'teaCup', label: 'Xícara de chá', asset: teaCupAsset, tone: 'from-tea-100 to-linen' },
  { value: 'mountains', label: 'Montanhas suaves', tone: 'from-tea-100 to-linen' },
  { value: 'botanical', label: 'Botânico', asset: botanicalAsset, tone: 'from-tea-50 to-tea-100' },
  { value: 'paper', label: 'Papel texturizado', asset: paperAsset, tone: 'from-oat to-linen' },
  { value: 'none', label: 'Nenhum', tone: 'from-white to-linen' },
  { value: 'custom', label: 'Personalizado', tone: 'from-tea-100 to-oat' },
];

const timezones = ['America/Sao_Paulo', 'America/Manaus', 'America/Fortaleza', 'America/New_York', 'Europe/Lisbon', 'UTC'];

function SectionCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="preference-surface border border-tea-900/10 bg-white/74 p-5">
      <div className="mb-4">
        <h2 className="font-display text-2xl font-semibold text-tea-900">{title}</h2>
        <p className="mt-1 text-sm leading-5 text-stone-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

function ToggleRow({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl bg-linen/70 p-3">
      <span className="min-w-0">
        <span className="block font-semibold text-tea-900">{label}</span>
        {description ? <span className="mt-1 block text-xs leading-5 text-stone-500">{description}</span> : null}
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-5 shrink-0 accent-tea-700" />
    </label>
  );
}

function ThemePreview({ preferences }: { preferences: TeaToDoPreferences }) {
  const theme = teaThemes.find((item) => item.id === preferences.theme) ?? teaThemes[0];
  const radius = preferences.cardStyle === 'soft' ? '22px' : preferences.cardStyle === 'defined' ? '16px' : '10px';
  const iconRadius = preferences.iconShape === 'rounded' ? '999px' : preferences.iconShape === 'soft' ? '14px' : '6px';
  const pad = preferences.density === 'compact' ? '12px' : preferences.density === 'comfortable' ? '16px' : '20px';

  return (
    <aside className="sticky top-6 overflow-hidden rounded-[34px] border border-tea-900/10 bg-white/72 p-5 shadow-soft xl:min-h-[680px]">
      <div className="mb-4">
        <h2 className="font-display text-2xl font-semibold text-tea-900">Prévia do tema</h2>
        <p className="mt-1 text-sm text-stone-500">Uma amostra do TeaToDo com suas escolhas.</p>
      </div>
      <div className="overflow-hidden rounded-[28px] border" style={{ background: theme.tokens.background, borderColor: theme.tokens.border, color: theme.tokens.text }}>
        <div className="grid grid-cols-[74px_1fr]">
          <div className="min-h-[410px] p-3" style={{ background: theme.tokens.surfaceMuted }}>
            <div className="mx-auto mb-5 grid size-10 place-items-center" style={{ borderRadius: iconRadius, background: theme.tokens.surface, color: theme.tokens.primary }}>
              <Leaf size={18} />
            </div>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="mx-auto mb-3 h-8 w-10" style={{ borderRadius: iconRadius, background: item === 1 ? theme.tokens.primary : theme.tokens.surface }} />
            ))}
          </div>
          <div className="space-y-3 p-4" style={{ fontSize: `${preferences.fontScale}%` }}>
            <div>
              <p className="font-display text-2xl font-semibold">Bom dia, {preferences.profile.displayName || 'Chá'}</p>
              <p className="text-xs" style={{ color: theme.tokens.textMuted }}>Pequenas escolhas, grandes mudanças.</p>
            </div>
            <div className="h-10" style={{ borderRadius: radius, background: theme.tokens.surface, border: `1px solid ${theme.tokens.border}` }} />
            <div className="grid grid-cols-2 gap-3">
              <div style={{ padding: pad, borderRadius: radius, background: theme.tokens.surface, border: `1px solid ${theme.tokens.border}` }}>
                <p className="font-display text-lg font-semibold">Hoje</p>
                <div className="mt-3 space-y-2">
                  {[1, 2, 3].map((item) => <div key={item} className="h-3 rounded-full" style={{ background: item === 1 ? theme.tokens.primary : theme.tokens.surfaceMuted }} />)}
                </div>
              </div>
              <div style={{ padding: pad, borderRadius: radius, background: theme.tokens.surface, border: `1px solid ${theme.tokens.border}` }}>
                <p className="font-display text-lg font-semibold">Prioridades</p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[theme.tokens.primary, theme.tokens.warning, theme.tokens.accent].map((color) => <span key={color} className="h-12 rounded-xl" style={{ background: color, opacity: 0.35 }} />)}
                </div>
              </div>
              <div style={{ padding: pad, borderRadius: radius, background: theme.tokens.surface, border: `1px solid ${theme.tokens.border}` }}>
                <p className="font-display text-lg font-semibold">Foco</p>
                <p className="mt-2 text-2xl font-semibold" style={{ color: theme.tokens.primaryDark }}>25:00</p>
              </div>
              <div style={{ padding: pad, borderRadius: radius, background: theme.tokens.surface, border: `1px solid ${theme.tokens.border}` }}>
                <p className="font-display text-lg font-semibold">Hábitos</p>
                <div className="mt-3 flex gap-1">
                  {[1, 2, 3, 4, 5].map((item) => <span key={item} className="size-3 rounded-full" style={{ background: item < 4 ? theme.tokens.primary : theme.tokens.surfaceMuted }} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function CustomizePage() {
  const { preferences, updatePreferences, resetPreferences, savePreferences } = usePreferences();
  const [toast, setToast] = useState<ToastState>(null);

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2600);
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>, target: 'wallpaper' | 'avatar') => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readImageAsDataUrl(file);
      if (target === 'avatar') updatePreferences({ profile: { ...preferences.profile, avatarUrl: dataUrl } });
      else updatePreferences({ wallpaper: 'custom', customWallpaperDataUrl: dataUrl });
      notify('Imagem aplicada localmente.');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Não foi possível carregar a imagem.', 'error');
    } finally {
      event.target.value = '';
    }
  };

  const handleBackupImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await importLocalDataBackup(file);
      notify('Backup importado. Recarregando dados...');
      window.setTimeout(() => window.location.reload(), 800);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Não foi possível importar o backup.', 'error');
    } finally {
      event.target.value = '';
    }
  };

  const handleLocalDataReset = () => {
    if (!window.confirm('Apagar todos os dados locais do TeaToDo neste navegador?')) return;
    clearTeaToDoLocalData();
    notify('Dados locais apagados. Recarregando...');
    window.setTimeout(() => window.location.reload(), 800);
  };

  const updateProfile = (changes: Partial<TeaToDoPreferences['profile']>) => updatePreferences({ profile: { ...preferences.profile, ...changes } });
  const emailInvalid = preferences.profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(preferences.profile.email);

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,var(--color-surface-muted)_0,var(--color-bg)_36%,var(--color-bg)_100%)] text-stone-800">
      <div className="pointer-events-none fixed right-[-120px] top-[-110px] h-80 w-80 rounded-full bg-tea-100/60 blur-3xl" />
      <div className="relative flex">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 pb-28 pt-7 sm:px-6 lg:px-9 lg:pb-9 xl:px-10">
          <div className="mx-auto max-w-[1280px] space-y-5">
            <header className="relative flex flex-col gap-7 md:flex-row md:items-start md:justify-between">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <h1 className="font-display text-4xl font-semibold leading-tight text-tea-900 sm:text-5xl">
                  Personalizar <Leaf className="mb-2 inline text-tea-500" size={31} />
                </h1>
                <p className="mt-3 max-w-2xl text-base text-stone-500">Deixe o TeaToDo com a sua cara.</p>
              </motion.div>
              <HangingTag />
              <div className="flex items-center gap-3 self-end md:self-start">
                {[Bell, CupSoda, MoreVertical].map((Icon, index) => (
                  <button key={index} type="button" aria-label={index === 0 ? 'Notificações' : index === 1 ? 'Chá e foco' : 'Mais opções'} className="grid size-12 place-items-center rounded-full border border-tea-900/10 bg-white/78 text-tea-700 shadow-card">
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </header>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
              <div className="grid gap-5">
                <SectionCard title="Tema" description="Escolha um tema inspirado nos chás.">
                  <div className="grid gap-3 md:grid-cols-2">
                    {teaThemes.map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => updatePreferences({ theme: theme.id })}
                        aria-label={`Selecionar tema ${theme.name}`}
                        className={`relative overflow-hidden rounded-3xl border p-4 text-left transition ${preferences.theme === theme.id ? 'border-tea-700 bg-tea-50 shadow-card' : 'border-tea-900/10 bg-linen/70 hover:bg-white/80'}`}
                      >
                        <div className="mb-3 flex gap-1">
                          {[theme.tokens.primary, theme.tokens.accent, theme.tokens.surfaceMuted, theme.tokens.background].map((color) => <span key={color} className="h-7 flex-1 rounded-full" style={{ background: color }} />)}
                        </div>
                        <h3 className="font-display text-xl font-semibold text-tea-900">{theme.name}</h3>
                        <p className="mt-1 text-xs leading-5 text-stone-500">{theme.description}</p>
                        {preferences.theme === theme.id ? <span className="absolute right-4 top-4 grid size-7 place-items-center rounded-full bg-tea-700 text-white"><Check size={15} /></span> : null}
                      </button>
                    ))}
                  </div>
                </SectionCard>

                <div className="grid gap-5 lg:grid-cols-2">
                  <SectionCard title="Estilo dos cartões" description="Como as informações são apresentadas.">
                    <div className="grid gap-2">
                      {cardStyles.map((item) => (
                        <button key={item.value} type="button" onClick={() => updatePreferences({ cardStyle: item.value })} className={`rounded-2xl border p-3 text-left ${preferences.cardStyle === item.value ? 'border-tea-700 bg-tea-50' : 'border-tea-900/10 bg-linen/70'}`}>
                          <span className="font-semibold text-tea-900">{item.label}</span>
                          <span className="mt-1 block text-xs text-stone-500">{item.description}</span>
                        </button>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="Escala de fonte" description="Ajuste o tamanho do texto em toda a aplicação.">
                    <div className="grid grid-cols-4 gap-2">
                      {([90, 100, 110, 120] as FontScale[]).map((scale) => (
                        <button key={scale} type="button" onClick={() => updatePreferences({ fontScale: scale })} className={`h-12 rounded-full text-sm font-semibold ${preferences.fontScale === scale ? 'bg-tea-700 text-white' : 'bg-linen text-stone-600'}`}>
                          {scale}%
                        </button>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="Densidade" description="Escolha o espaçamento entre elementos.">
                    <div className="grid grid-cols-3 gap-2">
                      {densities.map((item) => (
                        <button key={item.value} type="button" onClick={() => updatePreferences({ density: item.value })} className={`h-12 rounded-full text-sm font-semibold ${preferences.density === item.value ? 'bg-tea-700 text-white' : 'bg-linen text-stone-600'}`}>
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="Forma dos ícones" description="Defina o estilo dos ícones da interface.">
                    <div className="grid grid-cols-3 gap-2">
                      {iconShapes.map((item) => (
                        <button key={item.value} type="button" onClick={() => updatePreferences({ iconShape: item.value })} className={`grid h-20 place-items-center rounded-2xl text-sm font-semibold ${preferences.iconShape === item.value ? 'bg-tea-700 text-white' : 'bg-linen text-stone-600'}`}>
                          <span className="grid size-8 place-items-center border border-current" style={{ borderRadius: item.value === 'rounded' ? '999px' : item.value === 'soft' ? '12px' : '4px' }}>
                            <Leaf size={15} />
                          </span>
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </SectionCard>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <SectionCard title="Foco: presets" description="Escolha seus tempos preferidos.">
                    <div className="grid gap-2">
                      {focusPresets.map((item) => (
                        <button key={item.value} type="button" onClick={() => updatePreferences({ focusPreset: item.value })} className={`flex items-center justify-between rounded-2xl border p-3 text-left ${preferences.focusPreset === item.value ? 'border-tea-700 bg-tea-50' : 'border-tea-900/10 bg-linen/70'}`}>
                          <span className="font-semibold text-tea-900">{item.label}</span>
                          <span className="text-xs text-stone-500">{item.detail}</span>
                        </button>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="Notificações" description="Configure como e quando você deseja ser avisado.">
                    <div className="grid gap-2">
                      <ToggleRow label="Lembretes de tarefas" checked={preferences.notifications.taskReminders} onChange={(taskReminders) => updatePreferences({ notifications: { ...preferences.notifications, taskReminders } })} />
                      <ToggleRow label="Resumo diário por e-mail" description="Será usado quando a sincronização estiver disponível." checked={preferences.notifications.dailySummaryEmail} onChange={(dailySummaryEmail) => updatePreferences({ notifications: { ...preferences.notifications, dailySummaryEmail } })} />
                      <ToggleRow label="Notificações de foco" checked={preferences.notifications.focusNotifications} onChange={(focusNotifications) => updatePreferences({ notifications: { ...preferences.notifications, focusNotifications } })} />
                      <ToggleRow label="Hábitos e metas" checked={preferences.notifications.habitsAndGoals} onChange={(habitsAndGoals) => updatePreferences({ notifications: { ...preferences.notifications, habitsAndGoals } })} />
                    </div>
                  </SectionCard>
                </div>

                <SectionCard title="Papel de parede" description="Escolha uma decoração sutil para sua experiência.">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {wallpapers.map((item) => (
                      <button key={item.value} type="button" onClick={() => updatePreferences({ wallpaper: item.value })} className={`relative min-h-28 overflow-hidden rounded-3xl border bg-gradient-to-br ${item.tone} p-4 text-left ${preferences.wallpaper === item.value ? 'border-tea-700 shadow-card' : 'border-tea-900/10'}`}>
                        {item.asset ? <img src={item.asset} alt="" className="absolute -bottom-7 -right-5 w-28 opacity-35" /> : <Image className="absolute bottom-4 right-4 text-tea-500/30" size={44} />}
                        <span className="relative font-semibold text-tea-900">{item.label}</span>
                        {preferences.wallpaper === item.value ? <Check className="absolute right-4 top-4 text-tea-700" size={18} /> : null}
                      </button>
                    ))}
                  </div>
                  <label className="mt-4 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-tea-900/10 bg-linen px-5 text-sm font-semibold text-tea-700">
                    <Upload size={17} /> Enviar imagem personalizada
                    <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => handleImageUpload(event, 'wallpaper')} />
                  </label>
                </SectionCard>

                <SectionCard title="Dados locais" description="Faça backup, restaure ou limpe os dados salvos neste navegador.">
                  <div className="grid gap-3 md:grid-cols-3">
                    <button type="button" onClick={downloadLocalDataBackup} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-tea-700 px-5 text-sm font-semibold text-white shadow-card">
                      <Download size={17} /> Exportar backup
                    </button>
                    <label className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-tea-900/10 bg-linen px-5 text-sm font-semibold text-tea-700">
                      <Upload size={17} /> Importar backup
                      <input type="file" accept="application/json,.json" className="sr-only" onChange={handleBackupImport} />
                    </label>
                    <button type="button" onClick={handleLocalDataReset} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-5 text-sm font-semibold text-rose-600">
                      <Trash2 size={17} /> Limpar dados
                    </button>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-stone-500">O TeaToDo base não envia seus dados para servidores. O backup é um arquivo JSON local.</p>
                </SectionCard>

                <SectionCard title="Perfil" description="Gerencie suas informações pessoais.">
                  <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
                    <div className="text-center">
                      <div className="mx-auto grid size-28 place-items-center overflow-hidden rounded-full bg-tea-700 text-3xl font-bold text-white shadow-card">
                        {preferences.profile.avatarUrl ? <img src={preferences.profile.avatarUrl} alt="Avatar" className="size-full object-cover" /> : preferences.profile.initials}
                      </div>
                      <label className="mt-4 inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-linen px-4 text-xs font-semibold text-tea-700">
                        <Upload size={15} /> Avatar
                        <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => handleImageUpload(event, 'avatar')} />
                      </label>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="grid gap-2 text-sm font-semibold text-tea-900">
                        Nome
                        <input value={preferences.profile.displayName} onChange={(event) => updateProfile({ displayName: event.target.value || DEFAULT_PREFERENCES.profile.displayName })} className="h-12 rounded-2xl border border-tea-900/10 bg-linen/80 px-4 outline-none focus:border-tea-500/50 focus:ring-4 focus:ring-tea-500/10" />
                      </label>
                      <label className="grid gap-2 text-sm font-semibold text-tea-900">
                        E-mail
                        <input value={preferences.profile.email} onChange={(event) => updateProfile({ email: event.target.value })} className="h-12 rounded-2xl border border-tea-900/10 bg-linen/80 px-4 outline-none focus:border-tea-500/50 focus:ring-4 focus:ring-tea-500/10" />
                        {emailInvalid ? <span className="text-xs font-semibold text-amber-700">Informe um e-mail válido.</span> : null}
                      </label>
                      <label className="grid gap-2 text-sm font-semibold text-tea-900">
                        Fuso horário
                        <select value={preferences.profile.timezone} onChange={(event) => updateProfile({ timezone: event.target.value })} className="h-12 rounded-2xl border border-tea-900/10 bg-linen/80 px-4 outline-none">
                          {timezones.map((timezone) => <option key={timezone} value={timezone}>{timezone}</option>)}
                        </select>
                      </label>
                      <label className="grid gap-2 text-sm font-semibold text-tea-900">
                        Idioma
                        <select value={preferences.profile.language} onChange={(event) => updateProfile({ language: event.target.value as 'pt-BR' | 'en-US' })} className="h-12 rounded-2xl border border-tea-900/10 bg-linen/80 px-4 outline-none">
                          <option value="pt-BR">Português Brasil</option>
                          <option value="en-US">English US</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </SectionCard>

                <div className="flex flex-col gap-3 rounded-[30px] border border-tea-900/10 bg-white/74 p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-stone-500">As alterações são aplicadas e salvas localmente neste navegador.</p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button type="button" onClick={() => { if (window.confirm('Restaurar preferências padrão?')) { resetPreferences(); notify('Preferências restauradas.'); } }} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-tea-900/10 bg-linen px-5 text-sm font-semibold text-stone-600">
                      <RotateCcw size={17} /> Restaurar padrões
                    </button>
                    <button type="button" onClick={() => { savePreferences(); notify('Preferências salvas.'); }} disabled={Boolean(emailInvalid)} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-tea-700 px-5 text-sm font-semibold text-white shadow-card disabled:cursor-not-allowed disabled:opacity-50">
                      <Save size={17} /> Salvar alterações
                    </button>
                  </div>
                </div>
              </div>

              <ThemePreview preferences={preferences} />
            </div>
          </div>
        </main>
      </div>
      <MobileNav />
      {toast ? (
        <div className={`fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-3 text-sm font-semibold shadow-soft ${toast.type === 'success' ? 'bg-tea-700 text-white' : 'bg-amber-100 text-amber-800'}`}>
          {toast.message}
        </div>
      ) : null}
    </div>
  );
}
