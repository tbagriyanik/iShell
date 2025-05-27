import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SettingsState, DesktopApp, WindowState, ContextMenuState, LanguageOption, ContextMenuItem, ThemeColorOption, SerializableWindowState, IconArrangementOption, BackgroundColorOption } from './types';
import TopBar from './components/TopBar';
import Desktop from './components/Desktop';
import WindowComponent from './components/Window';
import ContextMenu from './components/ContextMenu';
import SettingsWindowContent from './components/SettingsWindowContent';
import PlaceholderAppContent from './components/PlaceholderAppContent';
import NewAppModal from './components/NewAppModal';
import ConfirmationModal from './components/ConfirmationModal';
import EditAppModal from './components/EditAppModal';
import WelcomeSetupScreen from './components/WelcomeSetupScreen'; 
import {
  DEFAULT_SETTINGS,
  INITIAL_DESKTOP_APPS,
  DESKTOP_CONTEXT_MENU_ITEMS,
  APP_CONTEXT_MENU_ITEMS,
  TAB_CONTEXT_MENU_ITEMS,
  getBackgroundColorClass,
  getFontStyle, 
  DEFAULT_WINDOW_WIDTH,
  DEFAULT_WINDOW_HEIGHT,
  SETTINGS_WINDOW_WIDTH,
  SETTINGS_WINDOW_HEIGHT,
  LOCALSTORAGE_SETTINGS_KEY,
  LOCALSTORAGE_APPS_KEY,
  LOCALSTORAGE_WINDOWS_KEY, 
  LOCALSTORAGE_INITIAL_APPS_SET_KEY,
  UI_TEXTS,
  APP_ICON_COMPONENT_MAP, 
  RAW_APP_ICON_COMPONENTS,
  AVAILABLE_APP_ICONS,
  EXAMPLE_APP_PROMPTS,
  SYSTEM_INSTRUCTION_FOR_APP_GENERATION,
  DESKTOP_BACKGROUND_PALETTE,
} from './constants';

let ai: GoogleGenAI | null = null;

const loadSettingsFromLocalStorage = (): SettingsState => {
    const savedSettings = localStorage.getItem(LOCALSTORAGE_SETTINGS_KEY);
    try {
      const parsed = savedSettings ? JSON.parse(savedSettings) : {};
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch {
      return DEFAULT_SETTINGS;
    }
};

const loadAppsFromLocalStorage = (): DesktopApp[] => {
    const savedApps = localStorage.getItem(LOCALSTORAGE_APPS_KEY);
    if (savedApps) {
        try {
            const parsedApps = JSON.parse(savedApps) as DesktopApp[];
            return parsedApps.filter(app => app.id && app.name && app.iconId && app.appComponentType && (APP_ICON_COMPONENT_MAP[app.iconId] || RAW_APP_ICON_COMPONENTS[app.iconId]));
        } catch { /* Fall through to initial apps */ }
    }
    return INITIAL_DESKTOP_APPS.filter(app => APP_ICON_COMPONENT_MAP[app.iconId] || RAW_APP_ICON_COMPONENTS[app.iconId]);
};

const loadWindowsFromLocalStorage = (currentDesktopApps: DesktopApp[]): WindowState[] => {
    const savedWindows = localStorage.getItem(LOCALSTORAGE_WINDOWS_KEY);
    if (savedWindows) {
        try {
            const parsedSerializableWindows = JSON.parse(savedWindows) as SerializableWindowState[];
            return parsedSerializableWindows
                .filter(sw => currentDesktopApps.some(da => da.id === sw.appId))
                .map((sw, index, arr) => ({
                    ...sw,
                    isActive: sw.zIndex === Math.max(...arr.map(w => w.zIndex || 0)),
                }));
        } catch { return []; }
    }
    return [];
};


const App: React.FC = () => {
  const [currentSettings, setCurrentSettings] = useState<SettingsState>(loadSettingsFromLocalStorage);
  const [desktopApps, setDesktopApps] = useState<DesktopApp[]>(loadAppsFromLocalStorage);
  const [openWindows, setOpenWindows] = useState<WindowState[]>(() => loadWindowsFromLocalStorage(desktopApps));

  const [nextZIndex, setNextZIndex] = useState<number>(() => {
     if (openWindows.length > 0) {
        return Math.max(0, ...openWindows.map(w => w.zIndex)) + 1;
     }
     return 10;
  });
  const [contextMenu, setContextMenu] = useState<Omit<ContextMenuState, 'currentBgIsLight' | 'themeColor'> | null>(null); // Removed theming props from state
  
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);
  const [isEditAppModalOpen, setIsEditAppModalOpen] = useState(false);
  const [appToEdit, setAppToEdit] = useState<DesktopApp | null>(null);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const [isGeneratingApp, setIsGeneratingApp] = useState(false); // Global for new app modal
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(!currentSettings.apiKey);
  
  const texts = UI_TEXTS[currentSettings.language];

  const currentBgIsLight = DESKTOP_BACKGROUND_PALETTE.find(p => p.value === currentSettings.desktopBackground)?.isLight ?? false;

  const generateAppContentInternal = async (appName: string, aiPrompt: string): Promise<string | null> => {
    if (!ai) {
        console.warn("AI not initialized. Cannot generate content.");
        return null;
    }
    try {
        const themeColorName = currentSettings.themeColor.toString();
        const approximateHexColors: Record<string, string> = { blue: '3b82f6', purple: '8b5cf6', green: '22c55e', orange: 'f97316', red: 'ef4444', pink: 'ec4899', indigo: '6366f1', teal: '14b8a6' };
        const themeHexColor = approximateHexColors[themeColorName] || '60a5fa';
        const fontFamily = getFontStyle(currentSettings.fontFamily).fontFamily?.toString() || 'sans-serif';

        const systemInstruction = SYSTEM_INSTRUCTION_FOR_APP_GENERATION(appName, aiPrompt, fontFamily, themeHexColor);

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: `Generate the HTML for an app named "${appName}" with this functionality: "${aiPrompt}"`,
            config: { systemInstruction }
        });

        let generatedHtmlContent = response.text.trim();
        const fenceRegex = /^```(?:html)?\s*\n?([\s\S]*?)\n?\s*```$/s;
        const match = generatedHtmlContent.match(fenceRegex);
        if (match && match[1]) {
            generatedHtmlContent = match[1].trim();
        }
        if (!generatedHtmlContent.toLowerCase().startsWith("<!doctype html>")) {
            console.warn("AI response did not start with <!doctype html>. Wrapping content.");
            generatedHtmlContent = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${appName}</title><style>body {font-family: ${fontFamily}; padding: 1em; text-align: center;} h1 {color: #${themeHexColor};}</style></head><body><h1>${appName}</h1><div>${generatedHtmlContent}</div><!-- AI Prompt: ${aiPrompt.replace(/-->/g, '--&gt;')} --></body></html>`;
        }
        return generatedHtmlContent || null;
    } catch (error) {
        console.error(`Error generating content for ${appName}:`, error);
        return null;
    }
  };


  const initializeDefaultExampleApps = useCallback(async (currentApps: DesktopApp[]): Promise<DesktopApp[]> => {
    let appsToAdd: DesktopApp[] = [];
    const lang = currentSettings.language;

    for (const key in EXAMPLE_APP_PROMPTS) {
        const example = EXAMPLE_APP_PROMPTS[key];
        const exampleAppId = `app-example-${key}`;
        if (!currentApps.some(app => app.id === exampleAppId)) {
            const appName = lang === LanguageOption.Turkish ? example.nameTr : example.name;
            let generatedContent: string | null = null;
            if (ai) { // Only attempt AI generation if API key is set
                generatedContent = await generateAppContentInternal(appName, example.prompt);
            }
            
            if (!generatedContent) { // Fallback to simpler placeholder if AI fails or no key
                const placeholderContent = `<h1>${appName}</h1><p>This is the ${appName}.</p><p>Full functionality would be generated by AI based on the prompt: "${example.prompt}"</p><p>You can delete this example app by right-clicking its icon on the desktop.</p><!-- AI Prompt: ${example.prompt.replace(/-->/g, '--&gt;')} -->`;
                generatedContent = `<!DOCTYPE html><html lang="${lang === LanguageOption.Turkish ? 'tr' : 'en'}"><head><meta charset="UTF-8"><title>${appName}</title><style>body{font-family: sans-serif; padding: 20px; text-align: center;} h1{color: #333;}</style></head><body>${placeholderContent}</body></html>`;
            }

            appsToAdd.push({
                id: exampleAppId,
                name: appName,
                iconId: example.iconId,
                appComponentType: 'GeneratedApp',
                defaultWindowTitle: appName,
                aiPrompt: example.prompt,
                generatedHtmlContent: generatedContent,
                isSystemApp: false,
                isExampleApp: true,
            });
        }
    }
    return appsToAdd;
  }, [currentSettings.language, currentSettings.themeColor, currentSettings.fontFamily]);


  useEffect(() => {
    const initialAppsSet = localStorage.getItem(LOCALSTORAGE_INITIAL_APPS_SET_KEY);
    if (!initialAppsSet) {
        const loadAndSetExampleApps = async () => {
            const currentLoadedApps = loadAppsFromLocalStorage(); 
            const examples = await initializeDefaultExampleApps(currentLoadedApps);
            if (examples.length > 0) {
                const allApps = [...currentLoadedApps.filter(app => !examples.find(ex => ex.id === app.id)), ...examples];
                setDesktopApps(allApps);
                localStorage.setItem(LOCALSTORAGE_APPS_KEY, JSON.stringify(allApps));
            }
            localStorage.setItem(LOCALSTORAGE_INITIAL_APPS_SET_KEY, 'true');
        };
        if (ai || !currentSettings.apiKey) { // Proceed if AI is ready or if API key isn't set yet (will use placeholders)
          loadAndSetExampleApps();
        }
    }
  }, [initializeDefaultExampleApps, currentSettings.apiKey]);


  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_SETTINGS_KEY, JSON.stringify(currentSettings));
    if (currentSettings.apiKey) {
      try {
        if (!ai || (ai as any)._apiKey !== currentSettings.apiKey) { // Check internal property if direct comparison fails
             ai = new GoogleGenAI({ apiKey: currentSettings.apiKey });
        }
        setShowWelcomeScreen(false); 
      } catch (error) {
        console.error("Failed to initialize GoogleGenAI:", error);
        ai = null;
      }
    } else {
      ai = null;
      setShowWelcomeScreen(true); 
    }
  }, [currentSettings]); 

  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_APPS_KEY, JSON.stringify(desktopApps.map(({isGeneratingContent, ...rest}) => rest))); // Don't save loading state
  }, [desktopApps]);

  useEffect(() => {
    const serializableWindows = openWindows.map(w => {
        const { isActive, ...serializable } = w; 
        return serializable;
    });
    localStorage.setItem(LOCALSTORAGE_WINDOWS_KEY, JSON.stringify(serializableWindows));
  }, [openWindows]);


  const handleSettingChange = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setCurrentSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleArrangeIcons = (arrangement: IconArrangementOption) => {
    handleSettingChange('iconArrangement', arrangement);
    setContextMenu(null);
  };

  const handleSoftRefresh = async () => {
    const newSettings = loadSettingsFromLocalStorage();
    setCurrentSettings(newSettings);

    let newApps = loadAppsFromLocalStorage();
    const initialAppsSet = localStorage.getItem(LOCALSTORAGE_INITIAL_APPS_SET_KEY);

    // Re-evaluate example apps: if AI is now available and they had placeholders, try to regenerate
    let examplesWereModified = false;
    if (ai) {
        const exampleAppIds = Object.keys(EXAMPLE_APP_PROMPTS).map(k => `app-example-${k}`);
        const currentExampleApps = newApps.filter(app => exampleAppIds.includes(app.id) && app.isExampleApp);
        
        for (const exampleApp of currentExampleApps) {
            // Simple check: if content is very basic, consider it a placeholder needing regeneration
            const isPlaceholderContent = !exampleApp.generatedHtmlContent || exampleApp.generatedHtmlContent.length < 500; 
            if (isPlaceholderContent && exampleApp.aiPrompt) {
                const newContent = await generateAppContentInternal(exampleApp.name, exampleApp.aiPrompt);
                if (newContent) {
                    newApps = newApps.map(app => app.id === exampleApp.id ? { ...app, generatedHtmlContent: newContent } : app);
                    examplesWereModified = true;
                }
            }
        }
    }

    if (newApps.length <= INITIAL_DESKTOP_APPS.length && !initialAppsSet && !examplesWereModified) { 
        const examples = await initializeDefaultExampleApps(newApps);
        if (examples.length > 0) {
            newApps = [...newApps.filter(app => !examples.find(ex => ex.id === app.id)), ...examples];
            localStorage.setItem(LOCALSTORAGE_INITIAL_APPS_SET_KEY, 'true');
        }
    }
    setDesktopApps(newApps);
    setOpenWindows(loadWindowsFromLocalStorage(newApps)); 
    setNextZIndex(openWindows.length > 0 ? Math.max(0, ...openWindows.map(w => w.zIndex)) + 1 : 10);
    setContextMenu(null);
  };


  const handleApiKeySubmit = (apiKey: string) => {
    handleSettingChange('apiKey', apiKey.trim());
    // After API key is submitted, it's a good time to try and generate example apps if they are placeholders
    // The useEffect watching currentSettings.apiKey will re-initialize 'ai', then:
    setTimeout(async () => {
        const currentLoadedApps = loadAppsFromLocalStorage();
        const examples = await initializeDefaultExampleApps(currentLoadedApps); // This will now use AI if available
        if (examples.some(ex => currentLoadedApps.find(app => app.id === ex.id)?.generatedHtmlContent !== ex.generatedHtmlContent)) {
            const allApps = [...currentLoadedApps.filter(app => !examples.find(ex => ex.id === app.id)), ...examples];
            setDesktopApps(allApps);
        }
    }, 100);
  };


  const handleAppsImport = (importedAppsData: DesktopApp[]) => {
    const processedImportedApps = importedAppsData
        .filter(app => app.id && app.name && app.iconId && app.appComponentType && (APP_ICON_COMPONENT_MAP[app.iconId] || RAW_APP_ICON_COMPONENTS[app.iconId]))
        .map(app => ({...app})); 
    setDesktopApps(processedImportedApps);
  };
  
  const getWindowContent = useCallback((app: DesktopApp | undefined): React.ReactNode => {
    if (!app) return <div className="p-4">Error: App not found.</div>;

    if (app.isGeneratingContent) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-sm">
                <svg className="animate-spin h-8 w-8 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {texts.appIsRegenerating}
            </div>
        );
    }

    switch (app.appComponentType) {
      case 'SettingsApp':
        return <SettingsWindowContent 
                    settings={currentSettings} 
                    onSettingChange={handleSettingChange} 
                    desktopApps={desktopApps} 
                    onAppsImport={handleAppsImport} 
                    onResetSettings={() => handleResetSettingsRequest()}
                />;
      case 'PlaceholderApp': 
         return <PlaceholderAppContent appName={app.name} prompt={app.aiPrompt || "Legacy placeholder."} />;
      case 'GeneratedApp':
        if (app.generatedHtmlContent) {
             return <iframe srcDoc={app.generatedHtmlContent} style={{ width: '100%', height: '100%', border: 'none' }} title={app.name} sandbox="allow-scripts allow-same-origin" />;
        }
        return <PlaceholderAppContent appName={app.name} prompt={app.aiPrompt || "No prompt."} />;
      default:
        return <div className="p-4">Unsupported App Type: {app.appComponentType}</div>;
    }
  }, [currentSettings, desktopApps, texts.appIsRegenerating]); 


  const openApp = useCallback((appId: string) => {
    const appToOpen = desktopApps.find(app => app.id === appId);
    if (!appToOpen) return;

    const existingWindow = openWindows.find(w => w.appId === appId && !w.isMinimized);
    if (existingWindow) {
      focusWindow(existingWindow.id);
      return;
    }
    
    const newWindowId = `window-${appId}-${Date.now()}`;
    const newZ = nextZIndex;
    setNextZIndex(prev => prev + 1);

    const isSettingsApp = appToOpen.appComponentType === 'SettingsApp';
    const isMobile = window.innerWidth < 768;
    let defaultWidth = isMobile ? window.innerWidth * 0.9 : (isSettingsApp ? SETTINGS_WINDOW_WIDTH : DEFAULT_WINDOW_WIDTH);
    let defaultHeight = isMobile ? window.innerHeight * 0.75 : (isSettingsApp ? SETTINGS_WINDOW_HEIGHT : DEFAULT_WINDOW_HEIGHT);
    
    defaultWidth = Math.max(defaultWidth, 200); 
    defaultHeight = Math.max(defaultHeight, 150); 

    const maxWinX = Math.max(0, window.innerWidth - defaultWidth - 10);
    const maxWinY = Math.max(48, window.innerHeight - defaultHeight - 10); 
    
    const offsetX = (openWindows.filter(w=>!w.isMinimized).length % 5) * 20; 
    const offsetY = (openWindows.filter(w=>!w.isMinimized).length % 5) * 20;

    const x = Math.min(maxWinX, Math.max(10, (window.innerWidth - defaultWidth) / 2 + offsetX));
    const y = Math.min(maxWinY, Math.max(58, (window.innerHeight - defaultHeight) / 2 + offsetY));

    const newWindow: WindowState = {
      id: newWindowId,
      appId: appToOpen.id,
      title: (currentSettings.language === LanguageOption.Turkish && appToOpen.id === 'app-settings') ? UI_TEXTS[LanguageOption.Turkish].settingsTitle : (appToOpen.defaultWindowTitle || appToOpen.name),
      x, y, width: defaultWidth, height: defaultHeight,
      zIndex: newZ,
      isMinimized: false,
      isActive: true,
    };

    setOpenWindows(prev => [...prev.map(w => ({ ...w, isActive: false })), newWindow]);
    setContextMenu(null);
  }, [desktopApps, openWindows, nextZIndex, currentSettings.language]);


  const closeWindow = (windowId: string) => {
    setOpenWindows(prev => prev.filter(w => w.id !== windowId));
    setContextMenu(null);
    const remainingWindows = openWindows.filter(w => w.id !== windowId && !w.isMinimized);
    if (remainingWindows.length > 0) {
      const topWindow = remainingWindows.sort((a, b) => b.zIndex - a.zIndex)[0];
      if (topWindow) focusWindow(topWindow.id);
    }
  };
  
  const focusWindow = (windowId: string) => {
    const newZ = nextZIndex;
    setNextZIndex(prev => prev + 1);
    setOpenWindows(prev =>
      prev.map(w =>
        w.id === windowId
          ? { ...w, zIndex: newZ, isActive: true, isMinimized: false }
          : { ...w, isActive: false }
      )
    );
    setContextMenu(null);
  };

  const updateWindowPosition = (windowId: string, newPosition: { x: number; y: number }) => {
    setOpenWindows(prev =>
      prev.map(w => (w.id === windowId ? { ...w, x: newPosition.x, y: newPosition.y } : w))
    );
  };
  
  const updateWindowSizeAndPosition = (windowId: string, newSize: { width: number; height: number }, newPosition?: { x: number; y: number }) => {
    setOpenWindows(prev =>
      prev.map(w => {
        if (w.id === windowId) {
          const updatedWindow = { ...w, width: newSize.width, height: newSize.height };
          if (newPosition) {
            updatedWindow.x = newPosition.x;
            updatedWindow.y = newPosition.y;
          }
          return updatedWindow;
        }
        return w;
      })
    );
  };


  const handleOpenNewAppModal = () => {
    if (!ai) {
      alert(texts.apiKeyMissingError);
      openApp('app-settings'); 
      return;
    }
    setIsNewAppModalOpen(true);
    setContextMenu(null);
  };

  const handleCreateNewApp = async (appName: string, aiPrompt: string, iconId: string) => {
    setIsGeneratingApp(true); // For the modal's global loading state
    setGenerationError(null);
    
    const generatedHtmlContent = await generateAppContentInternal(appName, aiPrompt);

    if (generatedHtmlContent) {
        const newAppId = `app-generated-${Date.now()}`;
        const newApp: DesktopApp = {
            id: newAppId,
            name: appName,
            iconId: iconId || AVAILABLE_APP_ICONS[0]?.id || 'PlaceholderAppIcon',
            appComponentType: 'GeneratedApp',
            defaultWindowTitle: appName,
            aiPrompt: aiPrompt,
            generatedHtmlContent: generatedHtmlContent,
            isSystemApp: false,
        };
        setDesktopApps(prev => [...prev, newApp]);
        setIsNewAppModalOpen(false);
        setGenerationError(null);
        openApp(newAppId);
    } else {
        setGenerationError(texts.errorAIGeneration);
    }
    setIsGeneratingApp(false);
  };
  
  const handleOpenEditAppModal = (appId: string) => {
    const app = desktopApps.find(a => a.id === appId);
    if (app) {
      if (app.isSystemApp && !app.isExampleApp) { 
        alert(texts.appCannotBeEdited);
        return;
      }
      setAppToEdit(app);
      setIsEditAppModalOpen(true);
      setContextMenu(null);
    }
  };

  const handleUpdateApp = async (appId: string, newName: string, newAiPrompt?: string, newIconId?: string) => {
    const originalApp = desktopApps.find(app => app.id === appId);
    if (!originalApp) return;

    let newGeneratedHtmlContent: string | undefined | null = originalApp.generatedHtmlContent;
    let needsRegeneration = false;

    if (originalApp.appComponentType === 'GeneratedApp' && newAiPrompt && newAiPrompt !== originalApp.aiPrompt) {
        needsRegeneration = true;
    }

    setDesktopApps(prevApps => prevApps.map(app => {
        if (app.id === appId) {
            return { 
                ...app, 
                name: newName, 
                defaultWindowTitle: newName,
                aiPrompt: newAiPrompt !== undefined ? newAiPrompt : app.aiPrompt,
                iconId: newIconId !== undefined ? newIconId : app.iconId,
                generatedHtmlContent: needsRegeneration ? app.generatedHtmlContent : newGeneratedHtmlContent, // Keep old content initially if regenerating
                isGeneratingContent: needsRegeneration, // Set loading state for this app
            };
        }
        return app;
    }));
    
    setOpenWindows(prevWin => prevWin.map(win => {
        if (win.appId === appId) {
            return {...win, title: newName }; 
        }
        return win;
    }));
    
    setIsEditAppModalOpen(false);
    setAppToEdit(null);

    if (needsRegeneration && newAiPrompt) {
        const regeneratedContent = await generateAppContentInternal(newName, newAiPrompt);
        setDesktopApps(prevApps => prevApps.map(app => {
            if (app.id === appId) {
                return { 
                    ...app, 
                    generatedHtmlContent: regeneratedContent || app.generatedHtmlContent, // Keep old if new fails
                    isGeneratingContent: false, 
                };
            }
            return app;
        }));
        if (!regeneratedContent) {
            // Optionally show an error to the user that regeneration failed
            console.error(`Failed to regenerate content for app: ${newName}`);
        }
    }
  };

  const handleDeleteAppRequest = (appId: string) => {
    const app = desktopApps.find(a => a.id === appId);
    if (!app) return;
    if (app.isSystemApp && !app.isExampleApp) { 
      alert(texts.appCannotBeDeleted);
      return;
    }
    setConfirmationModal({
      isOpen: true,
      title: texts.deleteAppConfirmationTitle,
      message: texts.deleteAppConfirmationMessage(app.name),
      onConfirm: () => executeDeleteApp(appId),
    });
    setContextMenu(null);
  };

  const executeDeleteApp = (appId: string) => {
    setDesktopApps(prev => prev.filter(app => app.id !== appId));
    setOpenWindows(prev => prev.filter(win => win.appId !== appId));
    setConfirmationModal(null);
  };

  const handleResetSettingsRequest = () => {
    setConfirmationModal({
      isOpen: true,
      title: texts.resetSettingsConfirmationTitle,
      message: texts.resetSettingsConfirmationMessage,
      onConfirm: executeResetSettings,
    });
  };

  const executeResetSettings = () => {
    const currentApiKey = currentSettings.apiKey; 
    setCurrentSettings({...DEFAULT_SETTINGS, apiKey: currentApiKey});
    setConfirmationModal(null);
    // After resetting, example apps might need re-evaluation if they were AI generated based on old themes
    // For simplicity, a soft refresh might be good here or just rely on next full load.
    // Or call initializeDefaultExampleApps again if needed.
  };

  const handleDesktopContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    const items: ContextMenuItem[] = DESKTOP_CONTEXT_MENU_ITEMS(currentSettings.language, handleOpenNewAppModal, handleArrangeIcons, handleSoftRefresh);
    setContextMenu({ x: event.clientX, y: event.clientY, items });
  };

  const handleAppIconContextMenu = (event: React.MouseEvent, appId: string) => {
    event.preventDefault();
    event.stopPropagation();
    const app = desktopApps.find(a => a.id === appId);
    const items: ContextMenuItem[] = APP_CONTEXT_MENU_ITEMS(
        currentSettings.language, app, openApp, handleOpenEditAppModal, handleDeleteAppRequest
    );
    if (items.length > 0) {
        setContextMenu({ x: event.clientX, y: event.clientY, items, targetId: appId });
    }
  };

  const handleTabContextMenu = (event: React.MouseEvent, windowId: string) => {
    event.preventDefault();
    event.stopPropagation();
    const items: ContextMenuItem[] = TAB_CONTEXT_MENU_ITEMS(currentSettings.language, windowId, closeWindow);
     if (items.length > 0) {
        setContextMenu({ x: event.clientX, y: event.clientY, items, targetId: windowId });
    }
  };
  
  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  useEffect(() => {
    // For closing custom context menu with a left click
    document.addEventListener('click', closeContextMenu);
    
    // For preventing browser's native context menu
    const preventNativeContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };
    document.addEventListener('contextmenu', preventNativeContextMenu);

    return () => {
      document.removeEventListener('click', closeContextMenu);
      document.removeEventListener('contextmenu', preventNativeContextMenu);
    };
  }, [closeContextMenu]);

  useEffect(() => {
    setOpenWindows(prevWindows => 
        prevWindows.map(win => {
            const app = desktopApps.find(a => a.id === win.appId);
            if (app) {
                return {
                    ...win,
                    title: (currentSettings.language === LanguageOption.Turkish && app.id === 'app-settings') 
                           ? UI_TEXTS[LanguageOption.Turkish].settingsTitle 
                           : (app.defaultWindowTitle || app.name),
                };
            }
            return null; 
        }).filter(win => win !== null) as WindowState[] 
    );
  }, [currentSettings.language, desktopApps]); 

  const dynamicBgAndTextColorClass = getBackgroundColorClass(currentSettings.desktopBackground);
  const dynamicFontStyle = getFontStyle(currentSettings.fontFamily);

  if (showWelcomeScreen && !currentSettings.apiKey) { // Ensure API key is truly missing
    return (
      <WelcomeSetupScreen
        onApiKeySubmit={handleApiKeySubmit}
        themeColor={currentSettings.themeColor}
        texts={{
          welcomeTitle: texts.welcomeTitle,
          welcomeMessage: texts.welcomeMessage,
          apiKeyLabel: texts.apiKeyLabel,
          apiKeyPlaceholder: texts.apiKeyPlaceholder,
          saveAndContinue: texts.saveAndContinue,
        }}
        currentBgIsLight={currentBgIsLight}
      />
    );
  }

  return (
    <div 
        className={`h-screen w-screen flex flex-col overflow-hidden transition-colors duration-300 ${dynamicBgAndTextColorClass}`}
        style={dynamicFontStyle}
    >
      <TopBar 
        settings={currentSettings} 
        openWindows={openWindows} 
        desktopApps={desktopApps}
        onFocusWindow={focusWindow} 
        onCloseWindow={closeWindow}
        onOpenApp={openApp}
        onOpenNewAppModal={handleOpenNewAppModal}
        onTabContextMenu={handleTabContextMenu}
      />
      <Desktop
        apps={desktopApps.filter(app => app.id !== 'app-settings')} 
        iconSize={currentSettings.iconSize}
        iconArrangement={currentSettings.iconArrangement}
        onOpenApp={openApp}
        onAppContextMenu={handleAppIconContextMenu}
        onDesktopContextMenu={handleDesktopContextMenu}
      />
      {openWindows.map(win => {
        const appForWindow = desktopApps.find(app => app.id === win.appId);
        if (!appForWindow) return null; 
        return (
            <WindowComponent
            key={win.id}
            windowData={win}
            themeColor={currentSettings.themeColor}
            appIconId={appForWindow.iconId}
            desktopBackground={currentSettings.desktopBackground}
            onClose={closeWindow}
            onFocus={focusWindow}
            onDragStop={updateWindowPosition}
            onResizeStop={updateWindowSizeAndPosition}
            >
            {getWindowContent(appForWindow)}
            </WindowComponent>
        );
      })}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={closeContextMenu}
          currentBgIsLight={currentBgIsLight}
          themeColor={currentSettings.themeColor}
        />
      )}
      {isNewAppModalOpen && (
        <NewAppModal
          isOpen={isNewAppModalOpen}
          onClose={() => { setIsNewAppModalOpen(false); setGenerationError(null); }}
          onSubmit={handleCreateNewApp}
          isGenerating={isGeneratingApp}
          generationError={generationError}
          texts={texts}
          themeColor={currentSettings.themeColor}
          currentBgIsLight={currentBgIsLight}
        />
      )}
      {isEditAppModalOpen && appToEdit && (
        <EditAppModal
          isOpen={isEditAppModalOpen}
          appToEdit={appToEdit}
          onClose={() => { setIsEditAppModalOpen(false); setAppToEdit(null); }}
          onSubmit={handleUpdateApp}
          texts={texts}
          themeColor={currentSettings.themeColor}
          currentBgIsLight={currentBgIsLight}
        />
      )}
      {confirmationModal?.isOpen && (
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          title={confirmationModal.title}
          message={confirmationModal.message}
          onConfirm={confirmationModal.onConfirm}
          onClose={() => setConfirmationModal(null)}
          themeColor={currentSettings.themeColor}
          confirmText={texts.confirm}
          cancelText={texts.cancel}
          currentBgIsLight={currentBgIsLight}
        />
      )}
    </div>
  );
};

export default App;