
import React from 'react';
import { ContextMenuItem as ContextMenuItemType } from '../types';

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItemType[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const handleItemClick = (itemAction: () => void) => {
    itemAction();
    onClose();
  };

  return (
    <div
      className="fixed bg-stone-700/80 dark:bg-neutral-800/80 backdrop-blur-md text-white rounded-lg shadow-2xl py-2 z-[1000] border border-stone-600 dark:border-neutral-700"
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()} // Prevent closing from click inside
    >
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => handleItemClick(item.action)}
              disabled={item.disabled}
              className="w-full text-left px-4 py-2 text-sm hover:bg-stone-600/70 dark:hover:bg-neutral-700/70 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
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
