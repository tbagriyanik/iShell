
import React, { useState } from 'react';
import { SettingsState, DesktopApp, ThemeColorOption, BackgroundColorOption, FontFamilyOption, IconSizeOption, LanguageOption, TimeFormatOption, IconArrangementOption, SettingsTabOption } from '../types';
import { THEME_COLOR_PALETTE, DESKTOP_BACKGROUND_PALETTE, FONT_FAMILY_OPTIONS, ICON_SIZE_OPTIONS, LANGUAGE_OPTIONS, TIME_FORMAT_OPTIONS, UI_TEXTS, DEFAULT_SETTINGS, ICON_ARRANGEMENT_OPTIONS, getThemeColorClass } from '../constants';

interface SettingsWindowContentProps {
  settings: SettingsState;
  onSettingChange: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  desktopApps: DesktopApp[];
  onAppsImport: (apps: Pick<DesktopApp, 'id' | 'name' | 'iconId' | 'appComponentType' | 'defaultWindowTitle' | 'aiPrompt' | 'generatedHtmlContent' | 'isSystemApp' | 'isExampleApp'>[]) => void;
  onResetSettings: () => void;
}

const SettingsWindowContent: React.FC<SettingsWindowContentProps> = ({ settings, onSettingChange, desktopApps, onAppsImport, onResetSettings }) => {
  const currentLang = settings.language;
  const texts = UI_TEXTS[currentLang];
  
  const [activeTab, setActiveTab] = useState<SettingsTabOption>(SettingsTabOption.Appearance);

  const currentBgIsLight = DESKTOP_BACKGROUND_PALETTE.find(p => p.value === settings.desktopBackground)?.isLight ?? false;
  const textColorClass = currentBgIsLight ? 'text-neutral-800' : 'text-white'; 
  const labelColorClass = currentBgIsLight ? 'text-gray-700' : 'text-gray-300 dark:text-gray-400';
  const controlBgClass = currentBgIsLight ? 'bg-stone-200 hover:bg-stone-300' : 'bg-stone-700 dark:bg-neutral-700 hover:bg-stone-600 dark:hover:bg-neutral-600';
  const controlFocusRingClass = `focus:ring-${settings.themeColor}-500`;
  const controlBorderClass = currentBgIsLight ? 'border-stone-400' : 'border-stone-600 dark:border-neutral-600';
  const themeActiveButtonClass = `${getThemeColorClass(settings.themeColor, 'bg')} text-white`;
  const tabInactiveClass = `${currentBgIsLight ? 'hover:bg-stone-300 text-neutral-600' : 'hover:bg-neutral-700 text-gray-400'} `
  const tabActiveClass = `${getThemeColorClass(settings.themeColor, 'bg', '600')} text-white`;
  const switchEnabledBg = getThemeColorClass(settings.themeColor, 'bg', '600');
  const switchDisabledBg = currentBgIsLight ? 'bg-stone-300' : 'bg-neutral-600';


  const [localApiKey, setLocalApiKey] = useState(settings.apiKey || '');

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalApiKey(e.target.value);
  };

  const handleApiKeyBlur = () => {
    onSettingChange('apiKey', localApiKey.trim() || null);
  };

  const SettingSection: React.FC<{ title?: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`mb-5 ${className}`}>
      {title && <h3 className={`text-xs font-semibold ${labelColorClass} mb-2 uppercase tracking-wider`}>{title}</h3>}
      {children}
    </div>
  );

  const ToggleSwitch: React.FC<{label: string, checked: boolean, onChange: (checked: boolean) => void}> = ({label, checked, onChange}) => (
    <label className="flex items-center justify-between cursor-pointer">
        <span className={`text-xs sm:text-sm ${textColorClass}`}>{label}</span>
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`${checked ? switchEnabledBg : switchDisabledBg} 
                        relative inline-flex items-center h-5 sm:h-6 rounded-full w-9 sm:w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${currentBgIsLight ? 'focus:ring-offset-stone-200' : 'focus:ring-offset-neutral-800'} ${controlFocusRingClass}`}
        >
            <span className={`${checked ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0.5 sm:translate-x-1'} 
                            inline-block w-4 h-4 sm:w-5 sm:h-5 transform bg-white rounded-full transition-transform`}
            />
        </button>
    </label>
  );


  const handleExport = () => {
    const exportData = { settings, apps: desktopApps };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "ishell_backup.json";
    link.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          if (importedData.settings && typeof importedData.settings === 'object') {
            Object.keys(DEFAULT_SETTINGS).forEach(keyStr => { 
                 const key = keyStr as keyof SettingsState;
                 if (importedData.settings.hasOwnProperty(key)) {
                    onSettingChange(key, importedData.settings[key]);
                    if (key === 'apiKey') setLocalApiKey(importedData.settings[key] || '');
                 }
            });
          }
          if (importedData.apps && Array.isArray(importedData.apps)) {
            onAppsImport(importedData.apps);
          }
        } catch (error) {
          console.error("Failed to import settings:", error);
          alert(texts.errorImport);
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    }
  };

  const renderAppearanceSettings = () => (
    <>
      <SettingSection title={texts.themeColor}>
        <div className="flex flex-wrap gap-2 sm:gap-2.5">
          {THEME_COLOR_PALETTE.map(color => (
            <button
              key={color.value}
              title={color.name}
              onClick={() => onSettingChange('themeColor', color.value as ThemeColorOption)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-150 ease-in-out transform hover:scale-110 ${color.tailwindClass} ${settings.themeColor === color.value ? `ring-2 ring-offset-2 ${currentBgIsLight ? 'ring-offset-stone-300' : 'ring-offset-stone-800 dark:ring-offset-neutral-900'} ring-white` : ''}`}
              aria-pressed={settings.themeColor === color.value}
            />
          ))}
        </div>
      </SettingSection>

      <SettingSection title={texts.desktopBackground}>
        <div className="flex flex-wrap gap-2 sm:gap-2.5">
          {DESKTOP_BACKGROUND_PALETTE.map(color => (
            <button
              key={color.value}
              title={color.name}
              onClick={() => onSettingChange('desktopBackground', color.value as BackgroundColorOption)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-150 ease-in-out transform hover:scale-110 ${color.tailwindClass} ${settings.desktopBackground === color.value ? `ring-2 ring-offset-2 ${currentBgIsLight ? 'ring-offset-stone-300' : 'ring-offset-stone-800 dark:ring-offset-neutral-900'} ring-white` : ''}`}
              aria-pressed={settings.desktopBackground === color.value}
            />
          ))}
        </div>
      </SettingSection>

      <SettingSection title={texts.fontType}>
        <div className="space-y-1.5">
          {FONT_FAMILY_OPTIONS.map(font => (
            <button
              key={font.value}
              onClick={() => onSettingChange('fontFamily', font.value)}
              className={`w-full text-left p-2 rounded-md text-sm transition-colors ${settings.fontFamily === font.value ? themeActiveButtonClass : `${controlBgClass} ${textColorClass}`}`}
              style={font.style}
              aria-pressed={settings.fontFamily === font.value}
            >
              {font.name}
            </button>
          ))}
        </div>
      </SettingSection>

      <SettingSection title={texts.iconSize}>
        <div className="flex flex-wrap gap-2">
          {ICON_SIZE_OPTIONS.map(size => (
            <button
              key={size.value}
              onClick={() => onSettingChange('iconSize', size.value)}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-md text-xs sm:text-sm transition-colors ${settings.iconSize === size.value ? themeActiveButtonClass : `${controlBgClass} ${textColorClass}`}`}
              aria-pressed={settings.iconSize === size.value}
            >
              {currentLang === LanguageOption.Turkish ? size.nameTr : size.name}
            </button>
          ))}
        </div>
      </SettingSection>
       <SettingSection title={texts.iconArrangement}>
        <div className="flex flex-wrap gap-2">
          {ICON_ARRANGEMENT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onSettingChange('iconArrangement', opt.value)}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-md text-xs sm:text-sm transition-colors flex items-center space-x-2 ${settings.iconArrangement === opt.value ? themeActiveButtonClass : `${controlBgClass} ${textColorClass}`}`}
              aria-pressed={settings.iconArrangement === opt.value}
            >
              <opt.icon className="w-4 h-4" />
              <span>{texts[opt.nameKey]}</span>
            </button>
          ))}
        </div>
      </SettingSection>
      <SettingSection title={texts.timeFormat} className="pt-2">
        <div className="flex flex-wrap gap-2">
            {TIME_FORMAT_OPTIONS.map(format => (
                <button
                key={format.value}
                onClick={() => onSettingChange('timeFormat', format.value)}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-md text-xs sm:text-sm transition-colors ${settings.timeFormat === format.value ? themeActiveButtonClass : `${controlBgClass} ${textColorClass}`}`}
                aria-pressed={settings.timeFormat === format.value}
                >
                {format.name}
                </button>
            ))}
        </div>
        <div className="mt-3 space-y-2">
            <ToggleSwitch 
                label={texts.showSeconds}
                checked={settings.showSeconds}
                onChange={(checked) => onSettingChange('showSeconds', checked)}
            />
            <ToggleSwitch 
                label={texts.showDate}
                checked={settings.showDate}
                onChange={(checked) => onSettingChange('showDate', checked)}
            />
        </div>
      </SettingSection>
    </>
  );

  const renderSystemApiSettings = () => (
    <>
      <SettingSection title={texts.geminiApiKey}>
        <input
          type="password"
          value={localApiKey}
          onChange={handleApiKeyChange}
          onBlur={handleApiKeyBlur}
          placeholder={texts.geminiApiKeyPlaceholder}
          className={`w-full p-2.5 rounded-md ${controlBgClass} border ${controlBorderClass} focus:ring-2 ${controlFocusRingClass} focus:border-${settings.themeColor}-500 outline-none text-sm sm:text-base ${textColorClass}`}
          aria-label={texts.geminiApiKey}
        />
        {!settings.apiKey && <p className="text-xs text-yellow-400 mt-1">{texts.aiFeaturesDisabled}</p>}
      </SettingSection>
      <SettingSection title={texts.language}>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map(lang => (
            <button
              key={lang.value}
              onClick={() => onSettingChange('language', lang.value)}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-md text-xs sm:text-sm transition-colors ${settings.language === lang.value ? themeActiveButtonClass : `${controlBgClass} ${textColorClass}`}`}
              aria-pressed={settings.language === lang.value}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </SettingSection>
       {/* Volume settings removed from here */}
    </>
  );

  const renderBackupRestoreSettings = () => (
    <>
      <SettingSection title={texts.exportSettings}>
        <button
            onClick={handleExport}
            className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-md text-xs sm:text-sm ${controlBgClass} ${textColorClass} transition-colors`}
        >
            {texts.exportSettings}
        </button>
      </SettingSection>
      <SettingSection title={texts.importSettings}>
        <label className={`w-full block px-3 py-2 sm:px-4 sm:py-2.5 rounded-md text-xs sm:text-sm ${controlBgClass} ${textColorClass} transition-colors text-center cursor-pointer`}>
            {texts.importSettings}
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
        </label>
      </SettingSection>
       <SettingSection title={texts.resetSettings} className="mt-6">
          <button
              onClick={onResetSettings}
              className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-md text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white transition-colors`}
          >
              {texts.resetSettings}
          </button>
      </SettingSection>
    </>
  );


  return (
    <div className={`p-0 ${textColorClass} text-opacity-90 overflow-y-auto h-full flex flex-col scrollbar-hide`}>
      <div className={`p-3 sm:p-4 border-b ${currentBgIsLight ? 'border-stone-300' : 'border-stone-700 dark:border-neutral-700'}`}>
        <h2 className="text-xl sm:text-2xl font-semibold ">{texts.settingsTitle}</h2>
      </div>

      <div className={`flex border-b ${currentBgIsLight ? 'border-stone-300' : 'border-stone-700 dark:border-neutral-700'} px-2 pt-2 sm:px-3 sm:pt-3`}>
        {(Object.keys(SettingsTabOption) as Array<keyof typeof SettingsTabOption>).map((key) => {
          const tabValue = SettingsTabOption[key];
          let tabText = '';
          switch(tabValue) {
            case SettingsTabOption.Appearance: tabText = texts.tabAppearance; break;
            case SettingsTabOption.System: tabText = texts.tabSystemApi; break;
            case SettingsTabOption.Backup: tabText = texts.tabBackupRestore; break;
          }
          return (
          <button
            key={tabValue}
            onClick={() => setActiveTab(tabValue)}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium rounded-t-md focus:outline-none transition-colors ${activeTab === tabValue ? tabActiveClass : tabInactiveClass}`}
          >
            {tabText}
          </button>
        )})}
      </div>

      <div className="p-3 sm:p-4 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-slate-500">
        {activeTab === SettingsTabOption.Appearance && renderAppearanceSettings()}
        {activeTab === SettingsTabOption.System && renderSystemApiSettings()}
        {activeTab === SettingsTabOption.Backup && renderBackupRestoreSettings()}
      </div>
    </div>
  );
};

export default SettingsWindowContent;