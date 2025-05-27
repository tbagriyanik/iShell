import React from 'react';
import { DesktopApp, IconSizeOption, IconArrangementOption } from '../types';
import AppIcon from './AppIcon';
import { getIconSizeClasses } from '../constants';

interface DesktopProps {
  apps: DesktopApp[];
  iconSize: IconSizeOption;
  iconArrangement: IconArrangementOption;
  onOpenApp: (appId: string) => void;
  onAppContextMenu: (event: React.MouseEvent, appId: string) => void;
  onDesktopContextMenu: (event: React.MouseEvent) => void;
}

const Desktop: React.FC<DesktopProps> = ({ apps, iconSize, iconArrangement, onOpenApp, onAppContextMenu, onDesktopContextMenu }) => {
  
  let desktopWrapperClass = "flex-wrap content-start gap-2 sm:gap-3"; // Default 'Free' arrangement

  if (iconArrangement === IconArrangementOption.Horizontal) {
    // Horizontal: Icons arranged in horizontal rows, wrapping. Items have their natural width.
    desktopWrapperClass = "flex-row flex-wrap content-start items-start gap-1 sm:gap-1.5"; 
  } else if (iconArrangement === IconArrangementOption.Vertical) {
    // Vertical: Icons arranged in a vertical list (column). Items take their natural width and align left due to items-start.
    desktopWrapperClass = "flex-col content-start items-start gap-0.5 sm:gap-1";
  }
  
  const baseIconContainerClass = getIconSizeClasses(iconSize).container;

  return (
    <div
      className={`flex-grow w-full h-full p-2 sm:p-4 flex ${desktopWrapperClass} overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30`}
      onContextMenu={(e) => {
        if ((e.target as HTMLElement).closest('button[aria-label^="Open"]')) return;
        e.preventDefault();
        onDesktopContextMenu(e);
      }}
    >
      {apps.map(app => {
        // For Vertical arrangement, items-start on desktopWrapperClass will align items to the left.
        // The baseIconContainerClass defines the icon's own width. No need to force w-full.
        const currentIconContainerClass = baseIconContainerClass;

        return (
        <div key={app.id} 
             className={`${currentIconContainerClass}`}
            // style={iconArrangement === IconArrangementOption.Free && app.x !== undefined && app.y !== undefined ? { position: 'absolute', left: app.x, top: app.y } : {}}
        >
            <AppIcon
            app={app}
            iconSize={iconSize} 
            onOpen={onOpenApp}
            onContextMenu={onAppContextMenu}
            />
        </div>
      );
    })}
    </div>
  );
};

export default Desktop;