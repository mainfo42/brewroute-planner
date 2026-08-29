import { ColorThemeVariant } from '../types';

export interface ThemeConfig {
  id: ColorThemeVariant;
  name: string;
  subtitle: string;
  primaryColor: string; // Hex for CSS / leaflet
  accentColor: string; // Complementary accent hex
  complementaryName: string;
  primaryClass: string;
  accentClass: string;
  cardBorder: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  heroBg: string;
  headerBg: string;
  previewPill: string;
}

export const THEME_VARIANTS: Record<ColorThemeVariant, ThemeConfig> = {
  hop_amber: {
    id: 'hop_amber',
    name: 'Fresh Hop & Amber Gold',
    subtitle: 'Classic Green Pine with Warm Amber Ale Accents',
    primaryColor: '#58A72F',
    accentColor: '#D97706',
    complementaryName: 'Amber Gold',
    primaryClass: 'text-[#58A72F] bg-[#58A72F]',
    accentClass: 'text-[#D97706] bg-[#D97706]',
    cardBorder: 'border-[#C6E2BD]',
    badgeBg: 'bg-[#FEF3C7]',
    badgeText: 'text-[#92400E]',
    badgeBorder: 'border-[#FDE68A]',
    heroBg: 'bg-[#111111]',
    headerBg: 'bg-[#162D15]',
    previewPill: 'from-[#58A72F] to-[#D97706]',
  },
  roasted_copper: {
    id: 'roasted_copper',
    name: 'Roasted Malt & Copper',
    subtitle: 'Deep Espresso & Warm Toasted Copper Accents',
    primaryColor: '#C2410C',
    accentColor: '#059669',
    complementaryName: 'Crisp Emerald Sage',
    primaryClass: 'text-[#C2410C] bg-[#C2410C]',
    accentClass: 'text-[#059669] bg-[#059669]',
    cardBorder: 'border-[#FED7AA]',
    badgeBg: 'bg-[#FFEDD5]',
    badgeText: 'text-[#9A3412]',
    badgeBorder: 'border-[#FDBA74]',
    heroBg: 'bg-[#171412]',
    headerBg: 'bg-[#29170E]',
    previewPill: 'from-[#C2410C] to-[#059669]',
  },
  hazy_citrus: {
    id: 'hazy_citrus',
    name: 'Hazy Citra & Deep Pine',
    subtitle: 'Juicy Citra Gold with Deep Nordic Pine Accents',
    primaryColor: '#D97706',
    accentColor: '#047857',
    complementaryName: 'Deep Pine',
    primaryClass: 'text-[#D97706] bg-[#D97706]',
    accentClass: 'text-[#047857] bg-[#047857]',
    cardBorder: 'border-[#FDE68A]',
    badgeBg: 'bg-[#FEF9C3]',
    badgeText: 'text-[#854D0E]',
    badgeBorder: 'border-[#FEF08A]',
    heroBg: 'bg-[#15130D]',
    headerBg: 'bg-[#241C0E]',
    previewPill: 'from-[#F59E0B] to-[#047857]',
  },
  bourbon_oak: {
    id: 'bourbon_oak',
    name: 'Bourbon Barrel & Honey',
    subtitle: 'Rich Oak & Spiced Honey with Spearmint Accents',
    primaryColor: '#9A3412',
    accentColor: '#0284C7',
    complementaryName: 'Glacial Crisp Blue',
    primaryClass: 'text-[#9A3412] bg-[#9A3412]',
    accentClass: 'text-[#0284C7] bg-[#0284C7]',
    cardBorder: 'border-[#E0E7FF]',
    badgeBg: 'bg-[#FEF3C7]',
    badgeText: 'text-[#78350F]',
    badgeBorder: 'border-[#FCD34D]',
    heroBg: 'bg-[#131114]',
    headerBg: 'bg-[#261517]',
    previewPill: 'from-[#9A3412] to-[#0284C7]',
  },
};

const THEME_STORAGE_KEY = 'beerhop_color_theme_variant';

export function getSavedThemeVariant(): ColorThemeVariant {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ColorThemeVariant;
    if (saved && THEME_VARIANTS[saved]) {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'hop_amber';
}

export function applyThemeVariant(theme: ColorThemeVariant) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-color-theme', theme);
  } catch {
    // ignore
  }
}
