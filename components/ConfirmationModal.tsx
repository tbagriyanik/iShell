import React from 'react';
import { ConfirmationModalProps, ThemeColorOption } from '../types';
import { getThemeColorClass } from '../constants';
import { XMarkIcon } from './icons';

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  themeColor,
  onConfirm,
  onClose,
  currentBgIsLight,
}) => {
  if (!isOpen) return null;

  const modalTitleBarBgClass = getThemeColorClass(themeColor, 'bg', '600');
  const confirmButtonBgClass = getThemeColorClass(themeColor, 'bg', '500');
  const confirmButtonHoverBgClass = getThemeColorClass(themeColor, 'bg', '700');

  // Light/Dark theme adaptations
  const modalBgClass = currentBgIsLight ? 'bg-stone-100' : 'bg-stone-800 dark:bg-neutral-900';
  const textColorClass = currentBgIsLight ? 'text-neutral-800' : 'text-white';
  const messageTextColorClass = currentBgIsLight ? 'text-gray-700' : 'text-gray-300 dark:text-gray-400';
  const cancelBgClass = currentBgIsLight ? 'bg-stone-200 hover:bg-stone-300' : 'bg-stone-600 hover:bg-stone-500 dark:bg-neutral-700 dark:hover:bg-neutral-600';
  const cancelTextColorClass = currentBgIsLight ? 'text-neutral-700' : 'text-white';
  const titleBarTextColorClass = 'text-white'; // Title bar usually has contrast text for theme color

  return (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1050] p-2 sm:p-4"
        onClick={onClose} // Allow closing by clicking overlay
    >
      <div
        className={`${modalBgClass} rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md relative ${textColorClass} border ${currentBgIsLight ? 'border-stone-300' : 'border-stone-700 dark:border-neutral-700'} flex flex-col overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-message"
      >
        {/* Title Bar */}
        <div className={`h-8 sm:h-9 ${modalTitleBarBgClass} ${titleBarTextColorClass} flex items-center justify-between px-2 sm:px-3 select-none shrink-0`}>
            <h2 id="confirmation-modal-title" className="text-sm sm:text-base font-medium truncate">
            {title}
            </h2>
            <button 
                onClick={onClose} 
                className="p-1 sm:p-1.5 rounded-full hover:bg-black/20 transition-colors"
                aria-label="Close dialog"
            >
                <XMarkIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
            <p id="confirmation-modal-message" className={`text-sm sm:text-base ${messageTextColorClass} my-3 text-center px-1`}>
            {message}
            </p>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-5">
            <button
                onClick={onClose}
                className={`w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2.5 rounded-md text-sm sm:text-base ${cancelBgClass} ${cancelTextColorClass} transition-colors`}
            >
                {cancelText}
            </button>
            <button
                onClick={onConfirm}
                className={`w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2.5 rounded-md text-sm sm:text-base text-white font-semibold transition-colors ${confirmButtonBgClass} hover:${confirmButtonHoverBgClass}`}
            >
                {confirmText}
            </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;