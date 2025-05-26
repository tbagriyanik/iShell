
import React, { useState } from 'react';
import { WelcomeSetupScreenProps, ThemeColorOption } from '../types';
import { getThemeColorClass } from '../constants';
import { CogIcon } from './icons'; // Or a more generic app icon

const WelcomeSetupScreen: React.FC<WelcomeSetupScreenProps> = ({ onApiKeySubmit, themeColor, texts }) => {
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

  const bgColor = 'bg-slate-800'; // A neutral dark background
  const textColor = 'text-white';
  const cardBgColor = 'bg-slate-700';
  const inputBgClass = 'bg-slate-600 placeholder-slate-400';
  const focusRingClass = `focus:ring-${themeColor}-500`;
  const buttonBgClass = getThemeColorClass(themeColor, 'bg', '600');
  const buttonHoverBgClass = getThemeColorClass(themeColor, 'bg', '700');

  return (
    <div className={`fixed inset-0 ${bgColor} ${textColor} flex flex-col items-center justify-center p-4 sm:p-8 z-[2000]`}>
      <div className={`${cardBgColor} p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md text-center border border-slate-600`}>
        <div className="flex justify-center mb-4">
          {/* You can use a generic iShell icon or CogIcon here */}
          <CogIcon className={`w-16 h-16 text-${themeColor}-400`} />
        </div>
        <h1 id="welcome-title" className={`text-2xl sm:text-3xl font-bold mb-3 text-${themeColor}-400`}>
          {texts.welcomeTitle}
        </h1>
        <p id="welcome-message" className="text-sm sm:text-base text-slate-300 mb-6">
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
              className={`w-full p-3 rounded-md ${inputBgClass} ${textColor} border border-slate-500 focus:ring-2 ${focusRingClass} focus:border-${themeColor}-500 outline-none text-sm sm:text-base`}
              placeholder={texts.apiKeyPlaceholder}
              aria-describedby={error ? "api-key-error" : undefined}
            />
          </div>
          {error && (
            <p id="api-key-error" className="text-red-400 text-xs sm:text-sm bg-red-900/30 p-2 rounded-md">
              {error}
            </p>
          )}
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors duration-150 
                        ${buttonBgClass} hover:${buttonHoverBgClass} 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-700 focus:${getThemeColorClass(themeColor, 'ring', '400')} 
                        disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base`}
          >
            {texts.saveAndContinue}
          </button>
        </form>
        <p className="text-xs text-slate-400 mt-6">
          You can change this later in the main application settings.
        </p>
      </div>
    </div>
  );
};

export default WelcomeSetupScreen;
