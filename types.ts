import React from 'react';

export enum ThemeColorOption {
  Blue = 'blue',
  Purple = 'purple',
  Green = 'green',
  Orange = 'orange',
  Red = 'red',
  Pink = 'pink',
  Indigo = 'indigo',
  Teal = 'teal',
}

export enum BackgroundColorOption {
  Stone = 'stone', 
  Slate = 'slate',
  Gray = 'gray',
  Zinc = 'zinc',
  Neutral = 'neutral',
  Emerald = 'emerald',
  Sky = 'sky',
  Amber = 'amber',
  // Light Colors
  LightStone = 'light-stone',
  LightSky = 'light-sky',
  LightGreen = 'light-green',
  LightGray = 'light-gray',
}

export enum FontFamilyOption {
  Inter = 'Inter',
  Roboto = 'Roboto',
  OpenSans = 'Open Sans',
  Lato = 'Lato',
  Montserrat = 'Montserrat',
  Verdana = 'Verdana',
  Arial = 'Arial',
  Tahoma = 'Tahoma',
  Georgia = 'Georgia',
  CourierNew = 'Courier New',
}

export enum IconSizeOption {
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large',
}

export enum LanguageOption {
  English = 'English',
  Turkish = 'Turkish',
}

export enum TimeFormatOption {
  TwelveHour = '12 Hour',
  TwentyFourHour = '24 Hour',
}

export enum IconArrangementOption {
  Free = 'Free',
  Horizontal = 'Horizontal',
  Vertical = 'Vertical',
}

export enum SettingsTabOption {
  Appearance = 'Appearance',
  System = 'System & API', // Combined for API and future system items
  Backup = 'Backup & Restore',
}

export interface SettingsState {
  themeColor: ThemeColorOption;
  desktopBackground: BackgroundColorOption;
  fontFamily: FontFamilyOption;
  iconSize: IconSizeOption;
  language: LanguageOption;
  timeFormat: TimeFormatOption;
  apiKey: string | null;
  iconArrangement: IconArrangementOption;
  showSeconds: boolean;
  showDate: boolean;
}

export type AppComponentType = 'SettingsApp' | 'PlaceholderApp' | 'GeneratedApp';

export interface DesktopApp {
  id: string;
  name: string;
  iconId: string; 
  appComponentType: AppComponentType;
  defaultWindowTitle: string;
  aiPrompt?: string;
  generatedHtmlContent?: string;
  isSystemApp?: boolean; 
  isExampleApp?: boolean; // To identify default example apps
  x?: number; 
  y?: number;
  isGeneratingContent?: boolean; // For individual app regeneration status
}

export interface ActionSearchResult {
  id: string; // e.g., 'action-new-app'
  name: string; // Display name in search results
  iconId: string; // Icon to display
  action: () => void; // Function to execute on click
  isAction: true; // Differentiator
}

export type SearchResultItem = DesktopApp | ActionSearchResult;


export interface SerializableWindowState { 
  id: string;
  appId: string;
  title: string; 
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
}

export interface WindowState extends SerializableWindowState { 
  isActive: boolean;
}


export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.FC<{ className?: string }>;
  action: () => void;
  disabled?: boolean;
}

export interface ContextMenuState {
  x: number;
  y: number;
  items: ContextMenuItem[];
  targetId?: string;
  currentBgIsLight: boolean; // Added for theming context menu
  themeColor: ThemeColorOption; // Added for theming context menu hover
}

export interface ColorPaletteEntry {
  name: string;
  value: ThemeColorOption | BackgroundColorOption;
  tailwindClass: string;
  isLight?: boolean;
}

export interface AppIconOption {
  id: string; 
  name: string; 
  rawIconComponent: React.FC<{ className?: string }>; // The SVG component itself
  frameColorClass: string; // e.g., 'bg-red-500' for the picker
}

export interface NewAppModalState {
  appName: string;
  aiPrompt: string;
  iconId: string;
}

export interface EditAppModalState {
  appName: string;
  aiPrompt?: string; 
  iconId?: string; 
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  themeColor: ThemeColorOption;
  onConfirm: () => void;
  onClose: () => void;
  currentBgIsLight: boolean;
}

export interface WelcomeSetupScreenProps {
  onApiKeySubmit: (apiKey: string) => void;
  themeColor: ThemeColorOption;
  texts: Pick<UITranslation, 'welcomeTitle' | 'welcomeMessage' | 'apiKeyLabel' | 'apiKeyPlaceholder' | 'saveAndContinue'>;
  currentBgIsLight: boolean;
}

export interface UITranslation {
  settingsTitle: string;
  themeColor: string;
  desktopBackground: string;
  fontType: string;
  iconSize: string;
  language: string;
  timeFormat: string;
  searchApps: string;
  open: string;
  edit: string;
  delete: string;
  newApp: string;
  sortIcons: string; 
  refresh: string;
  createAppTitle: string;
  appNameLabel: string;
  appNamePlaceholder: string;
  aiPromptLabel: string;
  aiPromptPlaceholder: string;
  appIconLabel: string;
  createButton: string;
  creatingButton: string;
  importSettings: string;
  exportSettings: string;
  noResults: string;
  errorAIGeneration: string;
  errorImport: string;
  resetSettings: string;
  resetSettingsConfirmationTitle: string;
  resetSettingsConfirmationMessage: string;
  deleteAppConfirmationTitle: string;
  deleteAppConfirmationMessage: (appName: string) => string;
  editAppTitle: string;
  saveChanges: string;
  cancel: string;
  confirm: string;
  appCannotBeEdited: string;
  appCannotBeDeleted: string;
  geminiApiKey: string; 
  geminiApiKeyPlaceholder: string; 
  welcomeTitle: string; 
  welcomeMessage: string; 
  apiKeyLabel: string; 
  apiKeyPlaceholder: string; 
  saveAndContinue: string; 
  apiKeyMissingError: string; 
  aiFeaturesDisabled: string; 
  arrangeIconsHorizontally: string;
  arrangeIconsVertically: string;
  iconArrangement: string;
  tabAppearance: string;
  tabSystemApi: string;
  tabBackupRestore: string;
  loadingPleaseWait: string;
  selectIcon: string;
  showSeconds: string;
  showDate: string;
  close: string; // For tab context menu
  appIsRegenerating: string;
  searchActionNewApp: string; // For search results
}

// Utility type to get keys of T where the value is a string
export type StringKeys<T> = { [K in keyof T]: T[K] extends string ? K : never }[keyof T];