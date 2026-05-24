import { useContext } from 'react';
import { PreferencesContext } from '../context/PreferencesProvider';
export { DEFAULT_PREFERENCES } from '../config/preferences';

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used within PreferencesProvider');
  return context;
}
