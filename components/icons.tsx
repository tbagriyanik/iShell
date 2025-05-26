
import React from 'react';

// Raw Cog Icon
export const CogIconComponent: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.067-1.007h1.066c.507 0 .976.465 1.067 1.007L13.58 7.5h2.84c.569 0 1.066.428 1.182.996l.398 2.003c.03.15.03.303 0 .453l-.398 2.004c-.116.568-.613.996-1.182.996h-2.84l-.876 3.56c-.09.542-.56 1.007-1.067 1.007h-1.066c-.507 0-.976-.465-1.067-1.007l-.875-3.56H7.42c-.569 0-1.066-.428-1.182-.996l-.398-2.003c-.03-.15-.03-.303 0-.453l.398-2.004c.116-.568.613.996 1.182.996h2.84l.875-3.56zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
  </svg>
);
// Keep CogIcon as the framed one for now if used elsewhere directly, or switch to CogIconComponent
export const CogIcon: React.FC<{ className?: string }> = CogIconComponent;


export const PlusIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const FolderOpenIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 0A2.25 2.25 0 015.25 7.5h13.5A2.25 2.25 0 0120.25 9.75M3.75 9.75A2.25 2.25 0 001.5 12v7.5A2.25 2.25 0 003.75 21.75h16.5A2.25 2.25 0 0022.5 19.5v-7.5A2.25 2.25 0 0020.25 9.75m-16.5 0v0M12 12.75h.008v.008H12v-.008z" />
  </svg>
);

export const PencilIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
  </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.24.03 3.22.077m3.22-.077L10.88 12.5m2.244-7.158l-.002.002A48.22 48.22 0 0112 5.695a48.218 48.218 0 01-2.343-.086m0 0a48.108 48.108 0 00-3.478.397m12.56 0c1.153 0 2.24.03 3.22.077M6.832 5.79L6.730 2.036A1.5 1.5 0 018.23 0h7.54a1.5 1.5 0 011.5 1.998l-.001.002L17.168 5.79" />
  </svg>
);

export const ArrowUturnLeftIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
  </svg>
);

export const Bars3BottomLeftIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
</svg>
);

export const WindowIconComponent: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);
export const WindowIcon: React.FC<{ className?: string }> = WindowIconComponent;


export const XMarkIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const PlaceholderAppIconComponent: React.FC<{ className?: string }> = ({ className = "w-3/5 h-3/5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
    </svg>
);
export const PlaceholderAppIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <div className={`flex items-center justify-center bg-purple-500 rounded-lg text-white ${className}`}>
    <PlaceholderAppIconComponent className="w-3/5 h-3/5" />
  </div>
);


export const SettingsAppIconFrame: React.FC<{ className?: string; children: React.ReactNode; bgColorClass?: string }> = ({ className, children, bgColorClass = 'bg-blue-500' }) => (
  <div className={`flex items-center justify-center rounded-lg text-white ${className} ${bgColorClass}`}>
    {children}
  </div>
);


export const NewAppPlaceholderIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => ( 
  <div className={`flex items-center justify-center bg-green-500 rounded-lg text-white ${className}`}>
    <PlusIcon className="w-3/5 h-3/5" />
  </div>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

// GridIcon is fine as is for a generic title bar helper if needed, but will be replaced by app icon
export const GridIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6A2.25 2.25 0 0115.75 3.75h2.25A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75A2.25 2.25 0 0115.75 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
</svg>
);


export const CalculatorIconComponent: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 10.5h6m-3-3v6" />
  </svg>
);
export const CalculatorIcon: React.FC<{ className?: string }> = CalculatorIconComponent;

export const DocumentTextIconComponent: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);
export const DocumentTextIcon: React.FC<{ className?: string }> = DocumentTextIconComponent;

export const PuzzlePieceIconComponent: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.083A11.952 11.952 0 0118.75 9.75M14.25 6.083A11.938 11.938 0 0012 5.25c-1.024 0-2.014.147-2.95.418M14.25 6.083v2.834c0 .328.079.643.229.928M10.125 9.75a11.952 11.952 0 014.5-3.667M3.75 9.75a11.952 11.952 0 014.125-3.275M3.75 9.75A11.938 11.938 0 001.5 12c0 1.024.147 2.014.418 2.95M3.75 9.75v2.834c0 .328.079.643.229.928M9.375 14.25v2.834c0 .328-.079.643-.229.928M9.375 14.25A11.952 11.952 0 005.25 10.125M9.375 14.25a11.938 11.938 0 012.25 4.125c.936.27.1902.418 2.95.418M9.375 14.25H6.546A4.502 4.502 0 012.044 12c0-1.512.747-2.873 1.918-3.716M14.625 10.125v2.834c0 .328.079.643.229.928M14.625 10.125A11.952 11.952 0 0118.75 6.083M14.625 10.125a11.938 11.938 0 00-2.25-4.125C11.439 5.682 10.49 5.25 9.75 5.25c-.936 0-1.872.27-2.625.936M14.625 10.125H17.45a4.502 4.502 0 014.502 2.456c0 1.512-.747 2.873-1.918 3.716M19.875 10.125A11.952 11.952 0 0015.75 6.083M19.875 10.125A11.938 11.938 0 0122.5 12c0 .936-.27 1.872-.936 2.625" />
</svg>
);
export const PuzzlePieceIcon: React.FC<{ className?: string }> = PuzzlePieceIconComponent;

export const PhotoIconComponent: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
</svg>
);
export const PhotoIcon: React.FC<{ className?: string }> = PhotoIconComponent;

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

export const ChevronUpIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
</svg>
);

export const SpeakerWaveIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
);

export const SpeakerXMarkIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0L21.75 9.75M19.5 12l2.25 2.25M19.5 12l-2.25 2.25M15.75 9.75l-3-3L9.75 4.5M12 9.75L9.75 7.5M12 9.75l2.25-2.25M12 9.75l-2.25 2.25m-7.5-3l3-3L9.75 4.5M6.75 9.75L9 7.5M6.75 9.75L4.5 12m2.25-2.25l-2.25 2.25M6.75 15.75l-3 3L1.5 15.75M4.5 15.75l2.25-2.25M4.5 15.75l-2.25-2.25m19.5-3l-3-3-2.25-2.25M19.5 15.75l-2.25 2.25M19.5 15.75l2.25 2.25M19.5 15.75l-2.25-2.25M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
);

export const ArrowsPointingOutIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => ( // For maximize or view
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9M20.25 20.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
  </svg>
);

// ArrowsUpDownIcon (for vertical sort) and ArrowsLeftRightIcon (for horizontal sort)
export const ArrowsUpDownIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v18m13.5-4.5L16.5 21m0 0L12 16.5m4.5 4.5V3" />
  </svg>
);

export const ArrowsLeftRightIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h18m-4.5-13.5L21 7.5m0 0L16.5 12M21 7.5H3" />
  </svg>
);
