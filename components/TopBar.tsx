import React, { useState, useEffect, useRef } from 'react';
import { SettingsState, WindowState, DesktopApp, TimeFormatOption, SearchResultItem, ActionSearchResult, LanguageOption } from '../types';
import { UI_TEXTS, getThemeColorClass, DESKTOP_BACKGROUND_PALETTE, APP_ICON_COMPONENT_MAP, TAB_CONTEXT_MENU_ITEMS, RAW_APP_ICON_COMPONENTS } from '../constants';
import { SearchIcon, PlusIcon, EllipsisVerticalIconComponent as SettingsMenuIcon } from './icons';

interface TopBarProps {
  settings: SettingsState;
  openWindows: WindowState[];
  desktopApps: DesktopApp[];
  onFocusWindow: (windowId: string) => void;
  onCloseWindow: (windowId: string) => void;
  onOpenApp: (appId: string) => void;
  onOpenNewAppModal: () => void;
  onTabContextMenu: (event: React.MouseEvent, windowId: string) => void;
}

const Clock: React.FC<{ 
    timeFormat: SettingsState['timeFormat'], 
    language: SettingsState['language'], 
    showSeconds: SettingsState['showSeconds'],
    showDate: SettingsState['showDate'],
    textColorClass: string 
}> = ({ timeFormat, language, showSeconds, showDate, textColorClass }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      second: showSeconds ? '2-digit' : undefined,
      hour12: timeFormat === TimeFormatOption.TwelveHour,
    };
    return currentTime.toLocaleTimeString(language === LanguageOption.Turkish ? 'tr-TR' : 'en-US', options);
  };
  
  const formatDate = () => {
    if (!showDate) return null;
    
    if (language === LanguageOption.Turkish) {
        const day = currentTime.getDate().toString().padStart(2, '0');
        const month = (currentTime.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
        const year = currentTime.getFullYear();
        return `${day}/${month}/${year}`;
    } else {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        };
        return currentTime.toLocaleDateString('en-US', options); // Default to US format for English
    }
  };

  const dateString = formatDate();

  return (
    <div className={`text-xs text-right hidden sm:block ${textColorClass} leading-tight`}>
      <div>{formatTime()}</div>
      {dateString && <div>{dateString}</div>}
    </div>
  );
};

const TopBar: React.FC<TopBarProps> = ({ settings, openWindows, desktopApps, onFocusWindow, onCloseWindow, onOpenApp, onOpenNewAppModal, onTabContextMenu }) => {
  const texts = UI_TEXTS[settings.language];
  const activeTabClass = getThemeColorClass(settings.themeColor, 'bg', '600');
  const currentBgIsLight = DESKTOP_BACKGROUND_PALETTE.find(p => p.value === settings.desktopBackground)?.isLight ?? false;
  
  const topBarBgColor = currentBgIsLight ? 'bg-stone-300/90 dark:bg-neutral-700/90' : 'bg-neutral-800/90 dark:bg-neutral-800/90';
  const textColorClass = currentBgIsLight ? 'text-neutral-800 dark:text-neutral-100' : 'text-white';
  const inputBgClass = currentBgIsLight ? 'bg-stone-100 placeholder-neutral-500 dark:bg-neutral-600 dark:placeholder-gray-400' : 'bg-stone-700 dark:bg-neutral-700 placeholder-gray-400 dark:placeholder-gray-500';
  const iconButtonHoverBgClass = currentBgIsLight ? 'hover:bg-stone-400/70 dark:hover:bg-neutral-600/70' : 'hover:bg-neutral-700/70 dark:hover:bg-neutral-600/70';
  const inactiveTabClass = currentBgIsLight ? `bg-stone-200/60 ${iconButtonHoverBgClass}` : `bg-neutral-700/60 ${iconButtonHoverBgClass}`;
  const themeFocusRingClass = `focus:ring-${settings.themeColor}-500`;


  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let results: SearchResultItem[] = [];
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      // Filter desktop apps (including system apps like Settings now)
      results = desktopApps.filter(app => app.name.toLowerCase().includes(lowerSearchTerm));
      
      // Check for "New AI App" action
      const newAppKeywords = ['new app', 'create app', 'yeni uygulama', 'uygulama oluştur', 'ai app'];
      if (newAppKeywords.some(keyword => lowerSearchTerm.includes(keyword))) {
        const newAppAction: ActionSearchResult = {
          id: 'action-new-app',
          name: texts.searchActionNewApp,
          iconId: 'NewAppPlaceholderIcon', // Or any relevant icon
          action: onOpenNewAppModal,
          isAction: true,
        };
        // Add if not already present (e.g. if an app is named "New App")
        if (!results.find(r => r.id === newAppAction.id)) {
            results.push(newAppAction);
        }
      }
    }
    setSearchResults(results);
  }, [searchTerm, desktopApps, texts.searchActionNewApp, onOpenNewAppModal]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchItemClick = (item: SearchResultItem) => {
    if ('isAction' in item && item.isAction) {
      item.action();
    } else if ('appComponentType' in item) { // It's a DesktopApp
      onOpenApp(item.id);
    }
    setSearchTerm('');
    setIsSearchFocused(false);
  };
  
  return (
    <div className={`h-12 ${topBarBgColor} backdrop-blur-md ${textColorClass} flex items-center justify-between px-2 sm:px-3 shadow-md shrink-0 z-50`}>
      <div className="flex items-center space-x-1 sm:space-x-2" ref={searchContainerRef}>
        <button 
          onClick={onOpenNewAppModal}
          className={`p-2 rounded-md ${iconButtonHoverBgClass} focus:outline-none focus:ring-1 ${themeFocusRingClass} transition-colors`}
          aria-label={texts.newApp}
          title={texts.newApp}
        >
          <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder={texts.searchApps}
            className={`${inputBgClass} text-sm rounded-md py-1.5 pl-7 pr-2 w-32 sm:w-36 md:w-48 focus:ring-1 ${themeFocusRingClass} outline-none ${textColorClass}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            aria-haspopup="listbox"
            aria-expanded={isSearchFocused && searchTerm.length > 0}
          />
          <SearchIcon className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 ${currentBgIsLight ? 'text-neutral-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`} />
          {isSearchFocused && searchTerm.length > 0 && (
            <div className={`absolute top-full mt-1 w-full ${currentBgIsLight ? 'bg-stone-50 dark:bg-neutral-600' : 'bg-stone-700 dark:bg-neutral-700'} rounded-md shadow-lg z-50 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent`}>
              {searchResults.length > 0 ? (
                <ul role="listbox">
                  {searchResults.map(item => {
                    const appMapIcon = APP_ICON_COMPONENT_MAP[item.iconId];
                    const rawMapIcon = RAW_APP_ICON_COMPONENTS[item.iconId];
                    
                    let IconComponent: React.FC<any>; // Use React.FC<any> for dynamic component type
                    const commonIconProps = { className: "w-full h-full opacity-80 rounded-sm" };
                    let specificIconProps: { iconSizeClass?: string } = {};

                    if (appMapIcon) {
                        IconComponent = appMapIcon;
                        specificIconProps.iconSizeClass = "w-full h-full";
                    } else if (rawMapIcon) {
                        IconComponent = rawMapIcon;
                        // No iconSizeClass for raw icons, className from commonIconProps handles sizing
                    } else {
                        IconComponent = APP_ICON_COMPONENT_MAP['DefaultAppIcon'];
                        specificIconProps.iconSizeClass = "w-full h-full";
                    }

                    return (
                    <li key={item.id} role="option" aria-selected="false">
                      <button
                        onClick={() => handleSearchItemClick(item)}
                        className={`w-full text-left px-3 py-2 text-sm ${iconButtonHoverBgClass} flex items-center space-x-2 ${textColorClass}`}
                      >
                        <div className="w-4 h-4 shrink-0"> 
                           <IconComponent {...commonIconProps} {...specificIconProps} /> 
                        </div>
                        <span className="truncate">{item.name}</span>
                      </button>
                    </li>
                  );
                  })}
                </ul>
              ) : (
                <p className={`px-3 py-2 text-sm ${currentBgIsLight ? 'text-neutral-500 dark:text-gray-400' : 'text-gray-400'}`}>{texts.noResults}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Middle group: Tabs */}
      <div className="flex-grow flex items-center overflow-hidden mx-1 sm:mx-2">
          <div className="flex items-center space-x-0.5 sm:space-x-1 overflow-x-auto scrollbar-hide h-full w-full"> {/* Use w-full here */}
            {openWindows.filter(w => !w.isMinimized).map(win => {
                const appForTab = desktopApps.find(da => da.id === win.appId);
                const TabIcon = appForTab ? (APP_ICON_COMPONENT_MAP[appForTab.iconId] || APP_ICON_COMPONENT_MAP['DefaultAppIcon']) : null;
               return (
              <button
                key={win.id}
                onClick={() => onFocusWindow(win.id)}
                onContextMenu={(e) => { e.preventDefault(); onTabContextMenu(e, win.id);}}
                className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-1 h-[calc(100%-6px)] rounded-t-md text-xs transition-colors shrink-0 
                            ${win.isActive ? `${activeTabClass} text-white` : `${inactiveTabClass} ${textColorClass}`}`}
                title={win.title}
              >
                {TabIcon && <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0"><TabIcon className="w-full h-full rounded-xs" iconSizeClass="w-full h-full" /></div>}
                <span className="truncate max-w-[50px] sm:max-w-[70px] md:max-w-[90px]">{win.title}</span>
              </button>
            )})}
          </div>
      </div>
      
      <div className="flex items-center space-x-1 sm:space-x-2">
        <button
           onClick={() => onOpenApp('app-settings')}
           className={`p-2 rounded-full ${iconButtonHoverBgClass} focus:outline-none focus:ring-1 ${themeFocusRingClass} transition-colors`}
           aria-label={texts.settingsTitle}
           title={texts.settingsTitle}
        >
            <SettingsMenuIcon className="w-4 h-4 sm:w-5 sm:h-5"/>
        </button>
        <Clock 
            timeFormat={settings.timeFormat} 
            language={settings.language} 
            showSeconds={settings.showSeconds}
            showDate={settings.showDate}
            textColorClass={textColorClass} 
        />
      </div>
    </div>
  );
};

export default TopBar;
