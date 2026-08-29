import React from 'react';
import {
  Compass,
  MapPin,
  FolderHeart,
  User,
  Sparkles,
  Map as MapIcon,
  ListOrdered,
} from 'lucide-react';
import { AuthUser } from '../types';

export type MobileTab = 'plan' | 'map' | 'curated' | 'saved' | 'account';

interface BottomNavBarProps {
  activeTab: MobileTab;
  onChangeTab: (tab: MobileTab) => void;
  savedCount: number;
  user: AuthUser | null;
  hasActiveRoute: boolean;
  onPlanNew: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
  savedCount,
  user,
  hasActiveRoute,
  onPlanNew,
}) => {
  const items = [
    {
      id: 'plan' as MobileTab,
      label: hasActiveRoute ? 'Trail' : 'Planner',
      icon: hasActiveRoute ? ListOrdered : Sparkles,
      onClick: () => onChangeTab('plan'),
    },
    {
      id: 'map' as MobileTab,
      label: 'Map',
      icon: MapIcon,
      disabled: !hasActiveRoute,
      onClick: () => {
        if (hasActiveRoute) {
          onChangeTab('map');
        }
      },
    },
    {
      id: 'curated' as MobileTab,
      label: 'Famous',
      icon: Compass,
      onClick: () => onChangeTab('curated'),
    },
    {
      id: 'saved' as MobileTab,
      label: 'Saved',
      icon: FolderHeart,
      badge: savedCount > 0 ? savedCount : undefined,
      onClick: () => onChangeTab('saved'),
    },
    {
      id: 'account' as MobileTab,
      label: user ? (user.displayName?.split(' ')[0] || 'Profile') : 'Account',
      icon: User,
      onClick: () => onChangeTab('account'),
    },
  ];

  const isDark = !hasActiveRoute;

  return (
    <nav
      id="m3-bottom-navigation-bar"
      aria-label="Mobile Navigation"
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg border-t px-2 py-1.5 pb-safe transition-all no-print ${
        isDark
          ? 'bg-[#0E0E0E]/95 border-[#262626] shadow-[0_-4px_16px_rgba(0,0,0,0.5)]'
          : 'bg-[#FAFBF9]/95 border-[#D4E2D7] shadow-[0_-4px_16px_rgba(13,40,24,0.06)]'
      }`}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          const isDisabled = item.disabled;

          return (
            <button
              key={item.id}
              type="button"
              id={`m3-bottom-nav-${item.id}`}
              disabled={isDisabled}
              onClick={item.onClick}
              className={`flex flex-col items-center justify-center flex-1 py-1 min-w-[56px] min-h-[48px] rounded-2xl transition-all cursor-pointer select-none relative group ${
                isDisabled ? 'opacity-35 cursor-not-allowed' : 'active:scale-95'
              }`}
            >
              {/* Active Indicator Pill */}
              <div
                className={`relative px-5 py-1 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? isDark
                      ? 'bg-[#1E3B18] text-[#DDF1D2] border border-[#58A72F]/50 shadow-xs scale-100'
                      : 'bg-[#D1E7D6] text-[#0D2818] shadow-2xs scale-100'
                    : isDark
                    ? 'bg-transparent text-[#9CB394] hover:bg-[#1E1E1E]'
                    : 'bg-transparent text-[#5B7564] hover:bg-[#EBF2EC]'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive
                      ? isDark
                        ? 'stroke-[2.5] text-[#DDF1D2]'
                        : 'stroke-[2.5] text-[#0D2818]'
                      : isDark
                      ? 'stroke-[1.8] text-[#9CB394]'
                      : 'stroke-[1.8] text-[#5B7564]'
                  }`}
                />

                {/* Badge */}
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[#58A72F] text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] mt-0.5 tracking-tight font-medium transition-colors ${
                  isActive
                    ? isDark
                      ? 'text-white font-bold'
                      : 'text-[#0D2818] font-bold'
                    : isDark
                    ? 'text-[#8EAD84]'
                    : 'text-[#5B7564]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
