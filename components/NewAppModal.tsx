import React, { useState } from 'react';
import { NewAppModalState, ThemeColorOption, UITranslation } from '../types';
import { getThemeColorClass, AVAILABLE_APP_ICONS } from '../constants';
import { SettingsAppIconFrame } from '../components/icons'; // Changed import path
import { XMarkIcon, PlusIcon } from './icons'; // PlusIcon for loading

interface NewAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appName: string, aiPrompt: string, iconId: string) => Promise<void>;
  isGenerating: boolean;
  generationError: string | null;
  texts: UITranslation; 
  themeColor: ThemeColorOption;
  currentBgIsLight: boolean;
}

const NewAppModal: React.FC<NewAppModalProps> = ({ isOpen, onClose, onSubmit, isGenerating, generationError, texts, themeColor, currentBgIsLight }) => {
  const [formState, setFormState] = useState<NewAppModalState>({
    appName: '',
    aiPrompt: '',
    iconId: AVAILABLE_APP_ICONS[0]?.id || 'PlaceholderAppIcon',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleIconSelect = (iconId: string) => {
    setFormState(prev => ({ ...prev, iconId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;
    if (!formState.appName.trim() || !formState.aiPrompt.trim() || !formState.iconId) {
        alert("App Name, AI Prompt, and Icon selection are required.");
        return;
    }
    await onSubmit(formState.appName, formState.aiPrompt, formState.iconId);
  };

  if (!isOpen) return null;

  const modalTitleBarBgClass = getThemeColorClass(themeColor, 'bg', '600');
  const buttonBgClass = getThemeColorClass(themeColor, 'bg', '500');
  const buttonHoverBgClass = getThemeColorClass(themeColor, 'bg', '700'); 
  const focusRingClass = `focus:ring-${themeColor}-500`;
  
  // Light/Dark theme adaptations
  const modalContentBgClass = currentBgIsLight ? 'bg-stone-100' : 'bg-stone-800 dark:bg-neutral-900';
  const textColorClass = currentBgIsLight ? 'text-neutral-800' : 'text-white';
  const labelColorClass = currentBgIsLight ? 'text-gray-700' : 'text-gray-300';
  const inputBgClass = currentBgIsLight ? 'bg-white' : 'bg-stone-700 dark:bg-neutral-800';
  const inputBorderClass = currentBgIsLight ? 'border-stone-300' : 'border-stone-600 dark:border-neutral-700';
  const inputPlaceholderColorClass = currentBgIsLight ? 'placeholder-neutral-400' : 'placeholder-gray-500';
  const iconSelectionBgClass = currentBgIsLight ? 'bg-stone-200/80' : 'bg-stone-700/50 dark:bg-neutral-800/50';
  const selectedIconRingClass = `ring-2 ring-offset-2 ${currentBgIsLight ? `ring-offset-stone-100 ${getThemeColorClass(themeColor, 'ring', '500')}` : `ring-offset-stone-700 dark:ring-offset-neutral-800 ${getThemeColorClass(themeColor, 'ring', '400')}`}`;
  const iconHoverBgClass = currentBgIsLight ? 'hover:bg-stone-300/70' : 'hover:bg-stone-600 dark:hover:bg-neutral-700';
  const titleBarTextColorClass = 'text-white'; // Title bar usually has contrast text for theme color

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-2 sm:p-4" 
        onClick={() => { if(!isGenerating) onClose();}}
        >
      <div 
        className={`flex flex-col rounded-lg shadow-2xl w-full max-w-md sm:max-w-lg relative border ${currentBgIsLight ? 'border-stone-300' : 'border-stone-700 dark:border-neutral-700'} overflow-hidden ${modalContentBgClass}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-app-modal-title"
      >
        {/* Title Bar */}
        <div className={`h-8 sm:h-9 ${modalTitleBarBgClass} ${titleBarTextColorClass} flex items-center justify-between px-2 sm:px-3 select-none shrink-0`}>
            <div className="flex items-center space-x-1.5">
                <PlusIcon className="w-4 h-4 opacity-90" /> 
                <h2 id="new-app-modal-title" className="text-sm sm:text-base font-medium truncate">
                {texts.createAppTitle}
                </h2>
            </div>
            <button 
                onClick={onClose} 
                className="p-1 sm:p-1.5 rounded-full hover:bg-black/20 transition-colors disabled:opacity-50"
                aria-label="Close modal"
                disabled={isGenerating}
            >
                <XMarkIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
        </div>

        {/* Content */}
        <div className={`p-3 sm:p-5 overflow-y-auto scrollbar-thin ${currentBgIsLight ? 'scrollbar-thumb-stone-400' : 'scrollbar-thumb-slate-600'} ${textColorClass} max-h-[calc(90vh-3rem)]`}>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
                <label htmlFor="appName" className={`block text-xs sm:text-sm font-medium ${labelColorClass} mb-1`}>{texts.appNameLabel}</label>
                <input
                type="text"
                id="appName"
                name="appName"
                value={formState.appName}
                onChange={handleChange}
                required
                disabled={isGenerating}
                className={`w-full p-2 sm:p-2.5 rounded-md ${inputBgClass} border ${inputBorderClass} ${textColorClass} ${inputPlaceholderColorClass} focus:ring-1 ${focusRingClass} focus:border-${themeColor}-500 outline-none text-sm sm:text-base disabled:opacity-70`}
                placeholder={texts.appNamePlaceholder}
                />
            </div>
            <div>
                <label htmlFor="aiPrompt" className={`block text-xs sm:text-sm font-medium ${labelColorClass} mb-1`}>{texts.aiPromptLabel}</label>
                <textarea
                id="aiPrompt"
                name="aiPrompt"
                value={formState.aiPrompt}
                onChange={handleChange}
                required
                disabled={isGenerating}
                rows={3} 
                className={`w-full p-2 sm:p-2.5 rounded-md ${inputBgClass} border ${inputBorderClass} ${textColorClass} ${inputPlaceholderColorClass} focus:ring-1 ${focusRingClass} focus:border-${themeColor}-500 outline-none resize-none scrollbar-thin ${currentBgIsLight ? 'scrollbar-thumb-stone-300' : 'scrollbar-thumb-stone-500'} text-sm sm:text-base disabled:opacity-70`}
                placeholder={texts.aiPromptPlaceholder}
                />
            </div>

            <div>
                <label className={`block text-xs sm:text-sm font-medium ${labelColorClass} mb-1.5`}>{texts.selectIcon}</label>
                <div className={`grid grid-cols-4 sm:grid-cols-5 gap-2 p-2 rounded-md ${isGenerating ? 'opacity-60' : iconSelectionBgClass}`}>
                {AVAILABLE_APP_ICONS.map((iconOption) => {
                    const IconItself = iconOption.rawIconComponent;
                    return (
                    <button
                        type="button"
                        key={iconOption.id}
                        onClick={() => !isGenerating && handleIconSelect(iconOption.id)}
                        title={iconOption.name}
                        disabled={isGenerating}
                        className={`p-1.5 rounded-md flex flex-col items-center justify-center transition-all aspect-square focus:outline-none ${focusRingClass}
                                    ${formState.iconId === iconOption.id ? selectedIconRingClass : iconHoverBgClass}`}
                        aria-pressed={formState.iconId === iconOption.id}
                    >
                        <SettingsAppIconFrame className="w-10 h-10 sm:w-12 sm:h-12" bgColorClass={iconOption.frameColorClass}>
                           <IconItself className="w-3/5 h-3/5" />
                        </SettingsAppIconFrame>
                        <span className={`text-xs mt-1 truncate w-full text-center ${currentBgIsLight ? 'text-neutral-700' : 'text-gray-300'}`}>{iconOption.name}</span>
                    </button>
                    );
                })}
                </div>
            </div>


            {generationError && !isGenerating && (
                <p className={`text-xs sm:text-sm p-1.5 sm:p-2 rounded-md ${currentBgIsLight ? 'text-red-600 bg-red-100' : 'text-red-400 bg-red-900/30'}`}>{generationError}</p>
            )}
            {isGenerating && (
                 <div className={`text-center py-2 text-sm ${currentBgIsLight ? 'text-yellow-600' : 'text-yellow-400'} flex items-center justify-center space-x-2`}>
                    <svg className={`animate-spin h-4 w-4 ${currentBgIsLight ? 'text-neutral-700' : 'text-white'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{texts.loadingPleaseWait}</span>
                </div>
            )}

            <button
                type="submit"
                disabled={isGenerating || !formState.appName.trim() || !formState.aiPrompt.trim() || !formState.iconId}
                className={`w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-md text-white font-semibold transition-colors duration-150 ${buttonBgClass} hover:${buttonHoverBgClass} focus:outline-none focus:ring-2 ${currentBgIsLight ? `focus:ring-offset-stone-100 focus:${getThemeColorClass(themeColor, 'ring', '500')}` : `focus:ring-offset-stone-800 dark:focus:ring-offset-neutral-900 focus:${getThemeColorClass(themeColor, 'ring', '400')}`} disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base`}
            >
                {isGenerating ? texts.creatingButton : texts.createButton}
            </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default NewAppModal;