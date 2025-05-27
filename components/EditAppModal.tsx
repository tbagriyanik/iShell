import React, { useState, useEffect } from 'react';
import { DesktopApp, EditAppModalState, ThemeColorOption, UITranslation, AppComponentType } from '../types';
import { getThemeColorClass, AVAILABLE_APP_ICONS } from '../constants';
import { SettingsAppIconFrame } from '../components/icons'; // Import SettingsAppIconFrame
import { XMarkIcon } from './icons';

interface EditAppModalProps {
  isOpen: boolean;
  appToEdit: DesktopApp | null;
  onClose: () => void;
  onSubmit: (appId: string, newName: string, newAiPrompt?: string, newIconId?: string) => Promise<void>;
  texts: UITranslation;
  themeColor: ThemeColorOption;
  currentBgIsLight: boolean;
}

const EditAppModal: React.FC<EditAppModalProps> = ({ isOpen, appToEdit, onClose, onSubmit, texts, themeColor, currentBgIsLight }) => {
  const [formState, setFormState] = useState<EditAppModalState>({
    appName: '',
    aiPrompt: '',
    iconId: '',
  });

  useEffect(() => {
    if (appToEdit) {
      setFormState({
        appName: appToEdit.name,
        aiPrompt: appToEdit.aiPrompt || '',
        iconId: appToEdit.iconId || AVAILABLE_APP_ICONS[0]?.id || 'PlaceholderAppIcon',
      });
    }
  }, [appToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleIconSelect = (iconId: string) => {
    setFormState(prev => ({ ...prev, iconId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appToEdit || !formState.appName.trim()) {
      alert("App Name cannot be empty.");
      return;
    }
    const isGenerated = appToEdit.appComponentType === 'GeneratedApp';
    if (isGenerated && !formState.iconId) {
        alert("Icon selection is required for generated apps.");
        return;
    }
    // AI prompt can be empty for a generated app if user clears it
    await onSubmit(appToEdit.id, formState.appName, formState.aiPrompt, formState.iconId);
  };

  if (!isOpen || !appToEdit) return null;

  const isGeneratedApp = appToEdit.appComponentType === 'GeneratedApp';

  const modalTitleBgClass = getThemeColorClass(themeColor, 'bg', '600');
  const buttonBgClass = getThemeColorClass(themeColor, 'bg', '500');
  const buttonHoverBgClass = getThemeColorClass(themeColor, 'bg', '700');
  const focusRingClass = `focus:ring-${themeColor}-500`;

  // Light/Dark theme adaptations
  const modalBgClass = currentBgIsLight ? 'bg-stone-100' : 'bg-stone-800 dark:bg-neutral-900';
  const textColorClass = currentBgIsLight ? 'text-neutral-800' : 'text-white';
  const labelColorClass = currentBgIsLight ? 'text-gray-600' : 'text-gray-300';
  const inputBgClass = currentBgIsLight ? 'bg-white' : 'bg-stone-700 dark:bg-neutral-800';
  const inputBorderClass = currentBgIsLight ? 'border-stone-300' : 'border-stone-600 dark:border-neutral-700';
  const inputPlaceholderColorClass = currentBgIsLight ? 'placeholder-neutral-400' : 'placeholder-gray-500';
  const iconSelectionBgClass = currentBgIsLight ? 'bg-stone-200/80' : 'bg-stone-700/50 dark:bg-neutral-800/50';
  const selectedIconRingClass = `ring-2 ring-offset-2 ${currentBgIsLight ? `ring-offset-stone-100 ${getThemeColorClass(themeColor, 'ring', '500')}` : `ring-offset-stone-700 dark:ring-offset-neutral-800 ${getThemeColorClass(themeColor, 'ring', '400')}`}`;
  const iconHoverBgClass = currentBgIsLight ? 'hover:bg-stone-300/70' : 'hover:bg-stone-600 dark:hover:bg-neutral-700';
  const closeButtonHoverBgClass = currentBgIsLight ? 'hover:bg-stone-200' : 'hover:bg-stone-700 dark:hover:bg-neutral-600';
  const titleBarTextColorClass = 'text-white'; // Title bar usually has contrast text for theme color


  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1025] p-2 sm:p-4" onClick={onClose}>
      <div
        className={`${modalBgClass} p-4 sm:p-6 rounded-lg shadow-2xl w-full max-w-lg relative ${textColorClass} border ${currentBgIsLight ? 'border-stone-300' : 'border-stone-700 dark:border-neutral-700'} overflow-y-auto max-h-[90vh] scrollbar-thin ${currentBgIsLight ? 'scrollbar-thumb-stone-300' : 'scrollbar-thumb-stone-500'}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-app-modal-title"
      >
        <button
          onClick={onClose}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-1 sm:p-1.5 rounded-full ${closeButtonHoverBgClass} transition-colors z-10`}
          aria-label="Close modal"
        >
          <XMarkIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${currentBgIsLight ? 'text-neutral-600' : 'text-gray-300'}`} />
        </button>

        <h2 id="edit-app-modal-title" className={`text-lg sm:text-xl md:text-2xl font-semibold mb-3 text-center p-2 sm:p-3 rounded-t-md ${modalTitleBgClass} ${titleBarTextColorClass}`}>
          {texts.editAppTitle}: {appToEdit.name}
        </h2>

        {appToEdit.isSystemApp && !appToEdit.isExampleApp ? ( // Allow editing example apps
            <p className={`text-sm sm:text-base p-2 sm:p-3 rounded-md my-4 text-center ${currentBgIsLight ? 'text-yellow-700 bg-yellow-100' : 'text-yellow-400 bg-yellow-900/30'}`}>{texts.appCannotBeEdited}</p>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
            <div>
                <label htmlFor="editAppName" className={`block text-xs sm:text-sm font-medium ${labelColorClass} mb-1`}>{texts.appNameLabel}</label>
                <input
                type="text"
                id="editAppName"
                name="appName"
                value={formState.appName}
                onChange={handleChange}
                required
                className={`w-full p-2 sm:p-2.5 rounded-md ${inputBgClass} border ${inputBorderClass} ${textColorClass} ${inputPlaceholderColorClass} focus:ring-2 ${focusRingClass} focus:border-${themeColor}-500 outline-none text-sm sm:text-base`}
                placeholder={texts.appNamePlaceholder}
                />
            </div>
            {isGeneratedApp && (
              <>
                <div>
                  <label htmlFor="editAiPrompt" className={`block text-xs sm:text-sm font-medium ${labelColorClass} mb-1`}>{texts.aiPromptLabel}</label>
                  <textarea
                      id="editAiPrompt"
                      name="aiPrompt"
                      value={formState.aiPrompt}
                      onChange={handleChange}
                      rows={3}
                      className={`w-full p-2 sm:p-2.5 rounded-md ${inputBgClass} border ${inputBorderClass} ${textColorClass} ${inputPlaceholderColorClass} focus:ring-2 ${focusRingClass} focus:border-${themeColor}-500 outline-none resize-none scrollbar-thin ${currentBgIsLight ? 'scrollbar-thumb-stone-300' : 'scrollbar-thumb-stone-500'} text-sm sm:text-base`}
                      placeholder={texts.aiPromptPlaceholder}
                  />
                </div>
                <div>
                  <label className={`block text-xs sm:text-sm font-medium ${labelColorClass} mb-1.5`}>{texts.appIconLabel}</label>
                  <div className={`grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3 p-2 ${iconSelectionBgClass} rounded-md`}>
                    {AVAILABLE_APP_ICONS.map((iconOption) => {
                      const IconItself = iconOption.rawIconComponent;
                      return (
                        <button
                          type="button"
                          key={iconOption.id}
                          onClick={() => handleIconSelect(iconOption.id)}
                          title={iconOption.name}
                          className={`p-2 rounded-md flex flex-col items-center justify-center transition-all aspect-square
                                      ${formState.iconId === iconOption.id ? selectedIconRingClass : iconHoverBgClass}
                                      focus:outline-none ${focusRingClass}`}
                          aria-pressed={formState.iconId === iconOption.id}
                        >
                          <SettingsAppIconFrame className="w-8 h-8 sm:w-10 sm:h-10" bgColorClass={iconOption.frameColorClass}>
                            <IconItself className="w-3/5 h-3/5" />
                          </SettingsAppIconFrame>
                          <span className={`text-xs mt-1 truncate w-full text-center ${currentBgIsLight ? 'text-neutral-700' : 'text-gray-300'}`}>{iconOption.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
            <button
                type="submit"
                disabled={!formState.appName.trim() || (isGeneratedApp && !formState.iconId)}
                className={`w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-md text-white font-semibold transition-colors duration-150 ${buttonBgClass} hover:${buttonHoverBgClass} focus:outline-none focus:ring-2 ${currentBgIsLight ? `focus:ring-offset-stone-100 focus:${getThemeColorClass(themeColor, 'ring', '500')}` : `focus:ring-offset-stone-800 dark:focus:ring-offset-neutral-900 focus:${getThemeColorClass(themeColor, 'ring', '400')}`} disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base`}
            >
                {texts.saveChanges}
            </button>
            </form>
        )}
      </div>
    </div>
  );
};

export default EditAppModal;