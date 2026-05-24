import chaCamomila from '../../assets/chaCamomila.png';
import chaEspecial from '../../assets/chaEspecial.png';
import chaMacha from '../../assets/chaMacha.png';
import chaPreto from '../../assets/chaPreto.png';
import chaVerde from '../../assets/chaVerde.png';
import type { FocusPresetId } from '../types/focus';

export const focusPresetAssets: Record<FocusPresetId, string> = {
  chamomile: chaCamomila,
  greenTea: chaVerde,
  matcha: chaMacha,
  blackTea: chaPreto,
  custom: chaEspecial,
};
