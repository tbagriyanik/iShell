import React from 'react';
import { ContextMenuItem as ContextMenuItemType, ThemeColorOption } from '../types';
import { getThemeColorClass } from '../constants';


interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItemType[];
  onClose: () => void;
  currentBgIsLight: boolean;
  themeColor: ThemeColorOption;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose, currentBgIsLight, themeColor }) => {
  const handleItemClick = (itemAction: () => void) => {
    itemAction();
    onClose();
  };

  const menuClasses = currentBgIsLight
    ? 'bg-stone-50/95 text-neutral-800 border-stone-300'
    : 'bg-neutral-800/95 text-white border-neutral-700';
  
  // For item hover, use a subtle theme color accent in light mode, and a generic highlight in dark mode.
  const itemHoverClasses = currentBgIsLight
    ? `hover:bg-${themeColor}-500/10 hover:text-${themeColor}-700` // very light theme color for bg, darker theme text
    : 'hover:bg-neutral-700/90';


  return (
    <div
      className={`fixed backdrop-blur-md rounded-lg shadow-2xl py-1.5 z-[1000] ${menuClasses}`}
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()} // Prevent closing from click inside
    >
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => handleItemClick(item.action)}
              disabled={item.disabled}
              className={`w-full text-left px-3.5 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2.5 transition-colors duration-75 ${itemHoverClasses}`}
            >
              {item.icon && <item.icon className="w-4 h-4 opacity-80" />}
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;