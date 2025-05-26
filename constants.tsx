import React from 'react';
import { SettingsState, DesktopApp, ThemeColorOption, BackgroundColorOption, FontFamilyOption, IconSizeOption, LanguageOption, TimeFormatOption, ColorPaletteEntry, UITranslation, AppIconOption, IconArrangementOption, SettingsTabOption, StringKeys } from './types';
import { 
    CogIconComponent, PlusIcon, FolderOpenIcon, PencilIcon, TrashIcon, ArrowUturnLeftIcon, Bars3BottomLeftIcon,
    PlaceholderAppIconComponent, SettingsAppIconFrame, NewAppPlaceholderIcon, 
    CalculatorIconComponent, DocumentTextIconComponent, PuzzlePieceIconComponent, PhotoIconComponent, WindowIconComponent,
    ArrowsUpDownIcon, ArrowsLeftRightIcon, XMarkIcon as CloseIcon // For tab context menu
} from './components/icons';

export const DEFAULT_SETTINGS: SettingsState = {
  themeColor: ThemeColorOption.Orange,
  desktopBackground: BackgroundColorOption.Stone,
  fontFamily: FontFamilyOption.Inter, 
  iconSize: IconSizeOption.Medium,
  language: LanguageOption.English, 
  timeFormat: TimeFormatOption.TwentyFourHour,
  apiKey: null,
  iconArrangement: IconArrangementOption.Free,
  showSeconds: true,
  showDate: true,
};

export const EXAMPLE_APP_PROMPTS: Record<string, {name: string, nameTr: string, prompt: string, iconId: string}> = {
    'calculator': {
        name: 'Calculator',
        nameTr: 'Hesap Makinesi',
        prompt: `Create a fully functional calculator.
Layout:
- A display screen at the top (readonly input field or div).
- Buttons for numbers 0-9.
- Buttons for operators: +, -, *, /.
- Button for decimal point: .
- Button for equals: =.
- Button for clear entry: CE (clears current entry).
- Button for clear all: C (clears all, including memory).
- Optional: Buttons for square root (√) and percentage (%).

Functionality:
- Basic arithmetic operations: addition, subtraction, multiplication, division.
- Handle multiple operations sequentially (e.g., 5 + 3 * 2 = 11, following order of operations if simple, or left-to-right if complex order is too much).
- Display current input and results on the screen.
- Clear button (C) should reset the calculator.
- CE should clear the last number entered.
- Prevent division by zero (show "Error" or "Cannot divide by zero").
- Handle decimal inputs and outputs correctly.
- Clicking a number button appends it to the current input.
- Clicking an operator button stores the operator and current number, preparing for the next number. If an operator is already pending, calculate the previous operation first.
- Equals button (=) calculates the result of the current expression.
- After a result is shown, if a number is pressed, it should start a new calculation. If an operator is pressed, it should use the result as the first operand.

Styling:
- Clean, modern, and user-friendly design.
- Buttons should be clearly labeled and easy to click.
- Display screen should be prominent.
- Responsive layout (buttons adjust size for smaller views if possible).
- The prompt used to generate this app should be visible as a comment in the HTML or a very small, non-intrusive note at the bottom of the app body. Example: <!-- AI Prompt: [the prompt text] --> or <p style="font-size:8px; color:grey; text-align:center; margin-top:10px;">Generated from: [the prompt text]</p>`,
        iconId: 'CalculatorIcon',
    },
    'notepad': {
        name: 'Notepad',
        nameTr: 'Not Defteri',
        prompt: `Create a simple but functional notepad application.
Features:
- A large textarea for users to type and edit text.
- Display character count and word count below the textarea, updating in real-time as the user types.
- Basic toolbar with buttons for:
    - Bold (wraps selected text with <strong> or applies bold style)
    - Italic (wraps selected text with <em> or applies italic style)
    - Underline (wraps selected text with <u> or applies underline style)
    - Clear All (clears the textarea content after confirmation).
- The content should be editable and selectable.
- Ensure the layout is clean and the textarea is the primary focus.
- The prompt used to generate this app should be visible as a comment in the HTML or a very small, non-intrusive note at the bottom of the app body. Example: <!-- AI Prompt: [the prompt text] --> or <p style="font-size:8px; color:grey; text-align:center; margin-top:10px;">Generated from: [the prompt text]</p>`,
        iconId: 'DocumentTextIcon',
    },
    'musicplayer': {
        name: 'Music Player',
        nameTr: 'Müzik Çalar',
        prompt: `Create a simple visual placeholder for a music player UI. No actual audio playback is required.
Elements:
- Display "Music Player" as a title.
- Show a placeholder for album art (e.g., a generic musical note icon or a grey square).
- Display placeholder text for "Song Title" and "Artist Name" below the album art.
- Include visual buttons (non-functional) for:
    - Play (icon: triangle pointing right)
    - Pause (icon: two vertical bars)
    - Previous (icon: triangle pointing left with a vertical bar)
    - Next (icon: triangle pointing right with a vertical bar)
- Include a visual (non-functional) progress bar for the song.
- Include a visual (non-functional) volume slider.
- Style it to look like a modern music player interface.
- The prompt used to generate this app should be visible as a comment in the HTML or a very small, non-intrusive note at the bottom of the app body. Example: <!-- AI Prompt: [the prompt text] --> or <p style="font-size:8px; color:grey; text-align:center; margin-top:10px;">Generated from: [the prompt text]</p>`,
        iconId: 'PuzzlePieceIcon',
    }
};


export const THEME_COLOR_PALETTE: ColorPaletteEntry[] = [
  { name: 'Blue', value: ThemeColorOption.Blue, tailwindClass: 'bg-blue-500' },
  { name: 'Purple', value: ThemeColorOption.Purple, tailwindClass: 'bg-purple-500' },
  { name: 'Green', value: ThemeColorOption.Green, tailwindClass: 'bg-green-500' },
  { name: 'Orange', value: ThemeColorOption.Orange, tailwindClass: 'bg-orange-500' },
  { name: 'Red', value: ThemeColorOption.Red, tailwindClass: 'bg-red-500' },
  { name: 'Pink', value: ThemeColorOption.Pink, tailwindClass: 'bg-pink-500' },
  { name: 'Indigo', value: ThemeColorOption.Indigo, tailwindClass: 'bg-indigo-500' },
  { name: 'Teal', value: ThemeColorOption.Teal, tailwindClass: 'bg-teal-500' },
];

export const DESKTOP_BACKGROUND_PALETTE: ColorPaletteEntry[] = [
  { name: 'Slate', value: BackgroundColorOption.Slate, tailwindClass: 'bg-slate-800', isLight: false },
  { name: 'Gray', value: BackgroundColorOption.Gray, tailwindClass: 'bg-gray-800', isLight: false },
  { name: 'Zinc', value: BackgroundColorOption.Zinc, tailwindClass: 'bg-zinc-800', isLight: false },
  { name: 'Neutral', value: BackgroundColorOption.Neutral, tailwindClass: 'bg-neutral-800', isLight: false },
  { name: 'Stone', value: BackgroundColorOption.Stone, tailwindClass: 'bg-stone-800', isLight: false }, 
  { name: 'Emerald', value: BackgroundColorOption.Emerald, tailwindClass: 'bg-emerald-800', isLight: false },
  { name: 'Sky', value: BackgroundColorOption.Sky, tailwindClass: 'bg-sky-800', isLight: false },
  { name: 'Amber', value: BackgroundColorOption.Amber, tailwindClass: 'bg-amber-800', isLight: false },
  { name: 'Light Stone', value: BackgroundColorOption.LightStone, tailwindClass: 'bg-stone-300', isLight: true },
  { name: 'Light Sky', value: BackgroundColorOption.LightSky, tailwindClass: 'bg-sky-300', isLight: true },
  { name: 'Light Green', value: BackgroundColorOption.LightGreen, tailwindClass: 'bg-green-300', isLight: true },
  { name: 'Light Gray', value: BackgroundColorOption.LightGray, tailwindClass: 'bg-gray-300', isLight: true },
];


export const FONT_FAMILY_OPTIONS: { name: string, value: FontFamilyOption, tailwindClass: string, style: React.CSSProperties }[] = [
  { name: 'Inter', value: FontFamilyOption.Inter, tailwindClass: 'font-sans', style: {fontFamily: 'Inter, sans-serif'} },
  { name: 'Roboto', value: FontFamilyOption.Roboto, tailwindClass: 'font-sans', style: {fontFamily: 'Roboto, sans-serif'} },
  { name: 'Verdana', value: FontFamilyOption.Verdana, tailwindClass: 'font-sans', style: {fontFamily: 'Verdana, sans-serif'} },
  { name: 'Arial', value: FontFamilyOption.Arial, tailwindClass: 'font-sans', style: {fontFamily: 'Arial, sans-serif'} },
  { name: 'Tahoma', value: FontFamilyOption.Tahoma, tailwindClass: 'font-sans', style: {fontFamily: 'Tahoma, sans-serif'} },
  { name: 'Georgia', value: FontFamilyOption.Georgia, tailwindClass: 'font-serif', style: {fontFamily: 'Georgia, serif'} },
  { name: 'Times New Roman', value: FontFamilyOption.TimesNewRoman, tailwindClass: 'font-serif', style: {fontFamily: '"Times New Roman", serif'} },
  { name: 'Courier New', value: FontFamilyOption.CourierNew, tailwindClass: 'font-mono', style: {fontFamily: '"Courier New", monospace'} },
  { name: 'Comic Sans MS', value: FontFamilyOption.ComicSans, tailwindClass: 'font-sans', style: {fontFamily: '"Comic Sans MS", cursive'} },
];

export const ICON_SIZE_OPTIONS: { name: string, nameTr: string, value: IconSizeOption, appIconClass: string, textClass: string, desktopIconContainerClass: string }[] = [
  { name: 'Small', nameTr: 'Küçük', value: IconSizeOption.Small, appIconClass: 'w-10 h-10', textClass: 'text-xs', desktopIconContainerClass: 'w-16 h-auto p-1' },
  { name: 'Medium', nameTr: 'Orta', value: IconSizeOption.Medium, appIconClass: 'w-12 h-12', textClass: 'text-sm', desktopIconContainerClass: 'w-20 h-auto p-1.5' },
  { name: 'Large', nameTr: 'Büyük', value: IconSizeOption.Large, appIconClass: 'w-16 h-16', textClass: 'text-base', desktopIconContainerClass: 'w-24 h-auto p-2' },
];

export const ICON_ARRANGEMENT_OPTIONS: { nameKey: StringKeys<UITranslation>, value: IconArrangementOption, icon: React.FC<{className?:string}> }[] = [
    { nameKey: 'arrangeIconsHorizontally', value: IconArrangementOption.Horizontal, icon: ArrowsLeftRightIcon },
    { nameKey: 'arrangeIconsVertically', value: IconArrangementOption.Vertical, icon: ArrowsUpDownIcon },
];


export const LANGUAGE_OPTIONS: { name: string, value: LanguageOption }[] = [
  { name: 'English', value: LanguageOption.English },
  { name: 'Türkçe', value: LanguageOption.Turkish },
];

export const TIME_FORMAT_OPTIONS: { name: string, value: TimeFormatOption }[] = [
  { name: '12 Hour', value: TimeFormatOption.TwelveHour },
  { name: '24 Hour', value: TimeFormatOption.TwentyFourHour },
];

// Map of Icon IDs to their raw SVG components (unframed)
export const RAW_APP_ICON_COMPONENTS: Record<string, React.FC<{className?: string}>> = {
    'SettingsAppIcon': CogIconComponent,
    'PlaceholderAppIcon': PlaceholderAppIconComponent,
    'CalculatorIcon': CalculatorIconComponent,
    'DocumentTextIcon': DocumentTextIconComponent,
    'PuzzlePieceIcon': PuzzlePieceIconComponent,
    'PhotoIcon': PhotoIconComponent,
    'WindowIcon': WindowIconComponent,
    'NewAppPlaceholderIcon': PlusIcon, 
};

// Framed components for use on Desktop and Window Title bars
export const APP_ICON_COMPONENT_MAP: Record<string, React.FC<{className?: string, iconSizeClass?: string}>> = {
    'SettingsAppIcon': ({className, iconSizeClass}) => <SettingsAppIconFrame className={className} bgColorClass="bg-gray-500"><CogIconComponent className={iconSizeClass || "w-3/5 h-3/5"}/></SettingsAppIconFrame>,
    'PlaceholderAppIcon': ({className, iconSizeClass}) => <SettingsAppIconFrame className={className} bgColorClass="bg-purple-500"><PlaceholderAppIconComponent className={iconSizeClass || "w-3/5 h-3/5"}/></SettingsAppIconFrame>,
    'NewAppPlaceholderIcon': ({className, iconSizeClass}) => <SettingsAppIconFrame className={className} bgColorClass="bg-green-500"><PlusIcon className={iconSizeClass || "w-3/5 h-3/5"}/></SettingsAppIconFrame>,
    'CalculatorIcon': ({className, iconSizeClass}) => <SettingsAppIconFrame className={className} bgColorClass="bg-yellow-500"><CalculatorIconComponent className={iconSizeClass || "w-3/5 h-3/5"}/></SettingsAppIconFrame>,
    'DocumentTextIcon': ({className, iconSizeClass}) => <SettingsAppIconFrame className={className} bgColorClass="bg-blue-500"><DocumentTextIconComponent className={iconSizeClass || "w-3/5 h-3/5"}/></SettingsAppIconFrame>,
    'PuzzlePieceIcon': ({className, iconSizeClass}) => <SettingsAppIconFrame className={className} bgColorClass="bg-red-500"><PuzzlePieceIconComponent className={iconSizeClass || "w-3/5 h-3/5"}/></SettingsAppIconFrame>,
    'PhotoIcon': ({className, iconSizeClass}) => <SettingsAppIconFrame className={className} bgColorClass="bg-pink-500"><PhotoIconComponent className={iconSizeClass || "w-3/5 h-3/5"}/></SettingsAppIconFrame>,
    'WindowIcon': ({className, iconSizeClass}) => <SettingsAppIconFrame className={className} bgColorClass="bg-teal-500"><WindowIconComponent className={iconSizeClass || "w-3/5 h-3/5"}/></SettingsAppIconFrame>,
    'DefaultAppIcon': ({className, iconSizeClass}) => <SettingsAppIconFrame className={className} bgColorClass="bg-gray-400"><PlaceholderAppIconComponent className={iconSizeClass || "w-3/5 h-3/5"}/></SettingsAppIconFrame>,
};


export const INITIAL_DESKTOP_APPS: DesktopApp[] = [
  { id: 'app-settings', name: 'Settings', iconId: 'SettingsAppIcon', appComponentType: 'SettingsApp', defaultWindowTitle: 'Settings', isSystemApp: true },
];

export const AVAILABLE_APP_ICONS: AppIconOption[] = [
    { id: 'PlaceholderAppIcon', name: 'Generic', rawIconComponent: RAW_APP_ICON_COMPONENTS['PlaceholderAppIcon'], frameColorClass: 'bg-purple-500' },
    { id: 'CalculatorIcon', name: 'Calc', rawIconComponent: RAW_APP_ICON_COMPONENTS['CalculatorIcon'], frameColorClass: 'bg-yellow-500' },
    { id: 'DocumentTextIcon', name: 'Doc', rawIconComponent: RAW_APP_ICON_COMPONENTS['DocumentTextIcon'], frameColorClass: 'bg-blue-500' },
    { id: 'PuzzlePieceIcon', name: 'Game/Music', rawIconComponent: RAW_APP_ICON_COMPONENTS['PuzzlePieceIcon'], frameColorClass: 'bg-red-500' }, // Generic enough for music too
    { id: 'PhotoIcon', name: 'Image', rawIconComponent: RAW_APP_ICON_COMPONENTS['PhotoIcon'], frameColorClass: 'bg-pink-500' },
    { id: 'WindowIcon', name: 'Utility', rawIconComponent: RAW_APP_ICON_COMPONENTS['WindowIcon'], frameColorClass: 'bg-teal-500' },
    { id: 'NewAppPlaceholderIcon', name: 'New', rawIconComponent: RAW_APP_ICON_COMPONENTS['NewAppPlaceholderIcon'], frameColorClass: 'bg-green-500' },
];


export const UI_TEXTS: Record<LanguageOption, UITranslation> = {
  [LanguageOption.English]: {
    settingsTitle: "Settings",
    themeColor: "Theme Color",
    desktopBackground: "Desktop Background",
    fontType: "Font Type",
    iconSize: "Icon Size",
    language: "Language",
    timeFormat: "Time Format",
    searchApps: "Search apps...",
    open: "Open",
    edit: "Edit",
    delete: "Delete",
    newApp: "New AI App",
    sortIcons: "Sort Icons (Old)",
    refresh: "Refresh Desktop",
    createAppTitle: "Create New AI Application",
    appNameLabel: "Application Name",
    appNamePlaceholder: "e.g., My Calculator",
    aiPromptLabel: "AI Prompt for App Logic",
    aiPromptPlaceholder: "Describe the app you want to create...",
    appIconLabel: "Application Icon",
    createButton: "Create App",
    creatingButton: "Creating...",
    importSettings: "Import",
    exportSettings: "Export",
    noResults: "No apps found.",
    errorAIGeneration: "Error generating AI content. Please check console or API key.",
    errorImport: "Failed to import settings. Invalid file format.",
    resetSettings: "Reset All Settings",
    resetSettingsConfirmationTitle: "Confirm Reset",
    resetSettingsConfirmationMessage: "Are you sure you want to reset all settings to their defaults? API Key will be preserved. This action cannot be undone.",
    deleteAppConfirmationTitle: "Confirm Delete",
    deleteAppConfirmationMessage: (appName: string) => `Are you sure you want to delete "${appName}"? This cannot be undone.`,
    editAppTitle: "Edit Application",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    confirm: "Confirm",
    appCannotBeEdited: "This application cannot be edited.",
    appCannotBeDeleted: "This application cannot be deleted.",
    geminiApiKey: "Gemini API Key",
    geminiApiKeyPlaceholder: "Enter your Gemini API Key",
    welcomeTitle: "Welcome to iShell!",
    welcomeMessage: "Please enter your Gemini API Key to enable AI features. You can get a key from Google AI Studio.",
    apiKeyLabel: "Gemini API Key",
    apiKeyPlaceholder: "Paste your API Key here",
    saveAndContinue: "Save and Continue",
    apiKeyMissingError: "Gemini API Key is required for AI features.",
    aiFeaturesDisabled: "AI features disabled. Set API Key in Settings.",
    arrangeIconsHorizontally: "Arrange Horizontally",
    arrangeIconsVertically: "Arrange Vertically",
    iconArrangement: "Icon Arrangement",
    tabAppearance: "Appearance",
    tabSystemApi: "System & API",
    tabBackupRestore: "Backup & Restore",
    loadingPleaseWait: "Processing... Please wait.",
    selectIcon: "Select Icon",
    showSeconds: "Show Seconds in Clock",
    showDate: "Show Date in Clock",
    close: "Close",
    appIsRegenerating: "Regenerating content...",
    searchActionNewApp: "Create New AI App",
  },
  [LanguageOption.Turkish]: {
    settingsTitle: "Ayarlar",
    themeColor: "Tema Rengi",
    desktopBackground: "Masaüstü Arkaplanı",
    fontType: "Yazı Tipi",
    iconSize: "Simge Boyutu",
    language: "Dil",
    timeFormat: "Saat Formatı",
    searchApps: "Uygulama ara...",
    open: "Aç",
    edit: "Düzenle",
    delete: "Sil",
    newApp: "Yeni AI Uygulama",
    sortIcons: "Simgeleri Diz (Eski)",
    refresh: "Masaüstünü Yenile",
    createAppTitle: "Yeni AI Uygulama Oluştur",
    appNameLabel: "Uygulama Adı",
    appNamePlaceholder: "örn. Hesap Makinem",
    aiPromptLabel: "Uygulama İçin AI İstemcisi",
    aiPromptPlaceholder: "Oluşturmak istediğiniz uygulamayı tanımlayın...",
    appIconLabel: "Uygulama Simgesi",
    createButton: "Uygulama Oluştur",
    creatingButton: "Oluşturuluyor...",
    importSettings: "İçe Aktar",
    exportSettings: "Dışa Aktar",
    noResults: "Uygulama bulunamadı.",
    errorAIGeneration: "AI içeriği oluşturulamadı. Konsolu veya API anahtarını kontrol edin.",
    errorImport: "Ayarlar içe aktarılamadı. Geçersiz dosya.",
    resetSettings: "Tüm Ayarları Sıfırla",
    resetSettingsConfirmationTitle: "Sıfırlamayı Onayla",
    resetSettingsConfirmationMessage: "Tüm ayarları varsayılana sıfırlamak istediğinizden emin misiniz? API Anahtarı korunacaktır. Bu işlem geri alınamaz.",
    deleteAppConfirmationTitle: "Silmeyi Onayla",
    deleteAppConfirmationMessage: (appName: string) => `"${appName}" uygulamasını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`,
    editAppTitle: "Uygulamayı Düzenle",
    saveChanges: "Değişiklikleri Kaydet",
    cancel: "İptal",
    confirm: "Onayla",
    appCannotBeEdited: "Bu uygulama düzenlenemez.",
    appCannotBeDeleted: "Bu uygulama silinemez.",
    geminiApiKey: "Gemini API Anahtarı",
    geminiApiKeyPlaceholder: "Gemini API Anahtarınızı girin",
    welcomeTitle: "iShell'e Hoş Geldiniz!",
    welcomeMessage: "AI özelliklerini etkinleştirmek için lütfen Gemini API Anahtarınızı girin. Google AI Studio'dan edinebilirsiniz.",
    apiKeyLabel: "Gemini API Anahtarı",
    apiKeyPlaceholder: "API Anahtarınızı buraya yapıştırın",
    saveAndContinue: "Kaydet ve Devam Et",
    apiKeyMissingError: "AI özellikleri için Gemini API Anahtarı gerekli.",
    aiFeaturesDisabled: "AI özellikleri devre dışı. Ayarlar'dan API Anahtarını girin.",
    arrangeIconsHorizontally: "Yatay Sırala",
    arrangeIconsVertically: "Dikey Sırala",
    iconArrangement: "Simge Düzeni",
    tabAppearance: "Görünüm",
    tabSystemApi: "Sistem & API",
    tabBackupRestore: "Yedekleme & Geri Yükleme",
    loadingPleaseWait: "İşleniyor... Lütfen bekleyin.",
    selectIcon: "Simge Seç",
    showSeconds: "Saatte Saniyeyi Göster",
    showDate: "Saatte Tarihi Göster",
    close: "Kapat",
    appIsRegenerating: "İçerik yeniden oluşturuluyor...",
    searchActionNewApp: "Yeni AI Uygulama Oluştur",
  }
};

export const DESKTOP_CONTEXT_MENU_ITEMS = (
    lang: LanguageOption, 
    openNewAppModal: () => void,
    arrangeIcons: (arrangement: IconArrangementOption) => void,
    softRefresh: () => void // Added softRefresh
) => [
  { id: 'new-app', label: UI_TEXTS[lang].newApp, icon: PlusIcon, action: openNewAppModal },
  { id: 'arrange-horizontally', label: UI_TEXTS[lang].arrangeIconsHorizontally, icon: ArrowsLeftRightIcon, action: () => arrangeIcons(IconArrangementOption.Horizontal) },
  { id: 'arrange-vertically', label: UI_TEXTS[lang].arrangeIconsVertically, icon: ArrowsUpDownIcon, action: () => arrangeIcons(IconArrangementOption.Vertical) },
  { id: 'refresh', label: UI_TEXTS[lang].refresh, icon: ArrowUturnLeftIcon, action: softRefresh, disabled: false },
];

export const APP_CONTEXT_MENU_ITEMS = (
    lang: LanguageOption,
    app: DesktopApp | undefined,
    openApp: (appId: string) => void,
    editApp: (appId: string) => void,
    deleteApp: (appId: string) => void
) => {
  if (!app) return [];
  const texts = UI_TEXTS[lang];
  return [
    { id: 'open', label: texts.open, icon: FolderOpenIcon, action: () => openApp(app.id) },
    { id: 'edit', label: texts.edit, icon: PencilIcon, action: () => editApp(app.id), disabled: !!app.isSystemApp },
    { id: 'delete', label: texts.delete, icon: TrashIcon, action: () => deleteApp(app.id), disabled: (!!app.isSystemApp && !app.isExampleApp) }, // Example apps are deletable
  ];
};

export const TAB_CONTEXT_MENU_ITEMS = (
    lang: LanguageOption,
    windowId: string,
    closeWindow: (windowId: string) => void
) => {
    const texts = UI_TEXTS[lang];
    return [
        { id: 'close-tab', label: texts.close, icon: CloseIcon, action: () => closeWindow(windowId) }
    ];
};


export const getBackgroundColorClass = (bgColorOption: BackgroundColorOption): string => {
  const entry = DESKTOP_BACKGROUND_PALETTE.find(p => p.value === bgColorOption);
  const baseClass = entry ? entry.tailwindClass : 'bg-stone-300'; 
  const textClass = entry?.isLight ? 'text-neutral-800' : 'text-white'; 
  return `${baseClass} ${textClass}`;
};

export const getThemeColorClass = (themeColorOption: ThemeColorOption, type: 'bg' | 'text' | 'border' | 'ring' = 'bg', intensity: string = '500'): string => {
  return `${type}-${themeColorOption}-${intensity}`;
};

export const getFontClass = (fontFamily: FontFamilyOption): string => {
  const font = FONT_FAMILY_OPTIONS.find(f => f.value === fontFamily);
  return font ? font.tailwindClass : 'font-sans'; 
};
export const getFontStyle = (fontFamily: FontFamilyOption): React.CSSProperties => {
    const font = FONT_FAMILY_OPTIONS.find(f => f.value === fontFamily);
    return font ? font.style : { fontFamily: 'Inter, sans-serif' };
};


export const getIconSizeClasses = (iconSize: IconSizeOption): { container: string, iconFrame: string, iconItself: string, text: string } => {
  const sizeOpt = ICON_SIZE_OPTIONS.find(s => s.value === iconSize) || ICON_SIZE_OPTIONS[1]; 
  return {
    container: `${sizeOpt.desktopIconContainerClass} flex flex-col items-center justify-start`, // for Desktop.tsx item
    iconFrame: `${sizeOpt.appIconClass} rounded-lg`, // for the colored frame part of the icon
    iconItself: `w-3/5 h-3/5`, // for the SVG inside the frame
    text: `${sizeOpt.textClass} mt-1 text-center truncate w-full`
  };
};


export const DEFAULT_WINDOW_WIDTH = 600;
export const DEFAULT_WINDOW_HEIGHT = 450;
export const SETTINGS_WINDOW_WIDTH = 520; 
export const SETTINGS_WINDOW_HEIGHT = 650; 

export const LOCALSTORAGE_SETTINGS_KEY = 'iShellSettings_v6'; // Incremented version for new settings
export const LOCALSTORAGE_APPS_KEY = 'iShellApps_v4'; // Incremented for example apps logic
export const LOCALSTORAGE_WINDOWS_KEY = 'iShellWindows_v1';
export const LOCALSTORAGE_INITIAL_APPS_SET_KEY = 'iShellInitialAppsSet_v2'; // Incremented due to prompt changes & generation logic for examples
export const SYSTEM_INSTRUCTION_FOR_APP_GENERATION = (appName: string, userPrompt: string, fontFamily: string, themeHexColor: string) => `You are an expert web developer. Your task is to generate complete, self-contained, single-page web applications based on user prompts.
The output MUST be only the raw HTML code, starting with <!DOCTYPE html> and ending with </html>.
It must include a <head> with a <title>${appName}</title>, a <style> tag for all CSS, and a <body> with content and a <script> tag for all JS (if JS is needed for functionality).
Do not include any explanations, markdown code fences (\`\`\`html ... \`\`\`), or any text outside the HTML structure.
The application should be functional and try to match the user's description.
Default body styling should be: body { font-family: ${fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'}; margin: 0; padding: 15px; background-color: #f0f2f5; color: #1f2937; display: flex; flex-direction: column; align-items: center; min-height: calc(100vh - 30px); box-sizing: border-box; }
Buttons should be styled: button { padding: 10px 15px; margin: 5px; border: none; border-radius: 6px; cursor: pointer; background-color: #${themeHexColor}; color: white; font-size: 1em; transition: background-color 0.2s ease; } button:hover { background-color: #${themeHexColor}DD; }
Inputs should be styled: input, textarea, select { padding: 10px; margin: 5px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1em; box-sizing: border-box; }
At the very end of the HTML body, include the AI prompt that was used to generate this app inside an HTML comment. Example: <!-- AI Prompt: ${userPrompt.replace(/-->/g, '--&gt;')} -->
The application name is "${appName}". The user's core functionality request is: "${userPrompt}".`;
