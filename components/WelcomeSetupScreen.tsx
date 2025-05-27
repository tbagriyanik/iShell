import React, { useState } from 'react';
import { WelcomeSetupScreenProps, ThemeColorOption } from '../types';
import { getThemeColorClass } from '../constants';
import { SettingsIcon } from './icons'; // Changed CogIcon to SettingsIcon

const WelcomeSetupScreen: React.FC<WelcomeSetupScreenProps> = ({ onApiKeySubmit, themeColor, texts, currentBgIsLight }) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) {
      setError("API Key cannot be empty.");
      return;
    }
    setError(null);
    onApiKeySubmit(apiKeyInput.trim());
  };

  // Theme adaptations
  const screenBgClass = currentBgIsLight ? 'bg-gray-100' : 'bg-slate-800';
  const cardBgClass = currentBgIsLight ? 'bg-white' : 'bg-slate-700';
  const textColorClass = currentBgIsLight ? 'text-neutral-800' : 'text-white';
  const subTextColorClass = currentBgIsLight ? 'text-slate-600' : 'text-slate-300';
  const smallSubTextColorClass = currentBgIsLight ? 'text-slate-500' : 'text-slate-400';
  const inputBgClass = currentBgIsLight ? 'bg-gray-50' : 'bg-slate-600';
  const inputBorderClass = currentBgIsLight ? 'border-gray-300' : 'border-slate-500';
  const inputPlaceholderClass = currentBgIsLight ? 'placeholder-gray-400' : 'placeholder-slate-400';
  const cardBorderClass = currentBgIsLight ? 'border-gray-200' : 'border-slate-600';
  
  const focusRingClass = `focus:ring-${themeColor}-500`;
  const buttonBgClass = getThemeColorClass(themeColor, 'bg', '600');
  const buttonHoverBgClass = getThemeColorClass(themeColor, 'bg', '700');
  const titleColorClass = `text-${themeColor}-${currentBgIsLight ? '600' : '400'}`;
  const iconColorClass = `text-${themeColor}-${currentBgIsLight ? '500' : '400'}`;


  return (
    <div className={`fixed inset-0 ${screenBgClass} ${textColorClass} flex flex-col items-center justify-center p-4 sm:p-8 z-[2000]`}>
      <div className={`${cardBgClass} p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md text-center border ${cardBorderClass}`}>
        <div className="flex justify-center mb-4">
          <SettingsIcon className={`w-16 h-16 ${iconColorClass}`} />
        </div>
        <h1 id="welcome-title" className={`text-2xl sm:text-3xl font-bold mb-3 ${titleColorClass}`}>
          {texts.welcomeTitle}
        </h1>
        <p id="welcome-message" className={`text-sm sm:text-base ${subTextColorClass} mb-6`}>
          {texts.welcomeMessage}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="sr-only">
              {texts.apiKeyLabel}
            </label>
            <input
              type="password"
              id="apiKey"
              name="apiKey"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              required
              className={`w-full p-3 rounded-md ${inputBgClass} ${textColorClass} border ${inputBorderClass} ${inputPlaceholderClass} focus:ring-2 ${focusRingClass} focus:border-${themeColor}-500 outline-none text-sm sm:text-base`}
              placeholder={texts.apiKeyPlaceholder}
              aria-describedby={error ? "api-key-error" : undefined}
            />
          </div>
          {error && (
            <p id="api-key-error" className={`text-xs sm:text-sm p-2 rounded-md ${currentBgIsLight ? 'text-red-600 bg-red-100' :'text-red-400 bg-red-900/30'}`}>
              {error}
            </p>
          )}
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors duration-150 
                        ${buttonBgClass} hover:${buttonHoverBgClass} 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentBgIsLight ? 'focus:ring-offset-white' : 'focus:ring-offset-slate-700'} focus:${getThemeColorClass(themeColor, 'ring', '400')} 
                        disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base`}
          >
            {texts.saveAndContinue}
          </button>
        </form>
        <p className={`text-xs ${smallSubTextColorClass} mt-6`}>
          You can change this later in the main application settings.
        </p>
      </div>
    </div>
  );
};

export default WelcomeSetupScreen;