import type { TeaThemeId } from '../types/preferences';

export type TeaTheme = {
  id: TeaThemeId;
  name: string;
  description: string;
  tokens: {
    background: string;
    surface: string;
    surfaceMuted: string;
    primary: string;
    primaryDark: string;
    accent: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
  };
};

export const teaThemes: TeaTheme[] = [
  {
    id: 'matcha',
    name: 'Matcha',
    description: 'Verde oliva, creme e calma diária.',
    tokens: {
      background: '#fbf8f0',
      surface: '#fffdf7',
      surfaceMuted: '#f4ecd8',
      primary: '#587039',
      primaryDark: '#2f3d24',
      accent: '#cfb98e',
      text: '#222b1c',
      textMuted: '#6f6a5f',
      border: 'rgba(34, 43, 28, 0.12)',
      success: '#587039',
      warning: '#d69328',
    },
  },
  {
    id: 'blackTea',
    name: 'Chá Preto',
    description: 'Contraste elegante com chá forte.',
    tokens: {
      background: '#f7f1e8',
      surface: '#fffaf2',
      surfaceMuted: '#eadfce',
      primary: '#4a3b28',
      primaryDark: '#2b2318',
      accent: '#8f6d45',
      text: '#241f19',
      textMuted: '#6b5d4f',
      border: 'rgba(74, 59, 40, 0.16)',
      success: '#526538',
      warning: '#b66b24',
    },
  },
  {
    id: 'jasmine',
    name: 'Jasmim',
    description: 'Claro, floral e suave.',
    tokens: {
      background: '#fbf8f6',
      surface: '#fffefe',
      surfaceMuted: '#f0e9f4',
      primary: '#6a7b4a',
      primaryDark: '#38442a',
      accent: '#c8b7d9',
      text: '#2b2b24',
      textMuted: '#706a72',
      border: 'rgba(84, 69, 96, 0.14)',
      success: '#6a7b4a',
      warning: '#d8a542',
    },
  },
  {
    id: 'oolong',
    name: 'Oolong',
    description: 'Verde azulado fresco e refinado.',
    tokens: {
      background: '#f5faf6',
      surface: '#fdfffb',
      surfaceMuted: '#e6f0e7',
      primary: '#477267',
      primaryDark: '#243f39',
      accent: '#a9c1ae',
      text: '#1f2e2a',
      textMuted: '#64716d',
      border: 'rgba(36, 63, 57, 0.14)',
      success: '#477267',
      warning: '#c99736',
    },
  },
  {
    id: 'chai',
    name: 'Chai',
    description: 'Bege quente, âmbar e aconchego.',
    tokens: {
      background: '#fbf2e4',
      surface: '#fffaf2',
      surfaceMuted: '#f2dfbf',
      primary: '#8a653d',
      primaryDark: '#4b3520',
      accent: '#d89a43',
      text: '#2f2419',
      textMuted: '#756352',
      border: 'rgba(75, 53, 32, 0.14)',
      success: '#607447',
      warning: '#d89a43',
    },
  },
];

export const getTeaTheme = (id: TeaThemeId) => teaThemes.find((theme) => theme.id === id) ?? teaThemes[0];
