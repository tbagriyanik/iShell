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
  let iconContainerClassOverride = "";

  if (iconArrangement === IconArrangementOption.Horizontal) {
    // Icons arranged in a vertical list (flex-col), items flow downwards.
    // Each item (icon + name) should take full width of its column.
    desktopWrapperClass = "flex-col content-start items-start gap-0.5 sm:gap-1"; 
    iconContainerClassOverride = "w-full"; // Make each icon container take the full width of the Desktop column
  } else if (iconArrangement === IconArrangementOption.Vertical) {
    // Icons arranged in horizontal rows (flex-row), items flow across then wrap.
    desktopWrapperClass = "flex-row content-start items-start gap-1 sm:gap-1.5"; // default content-start ensures they align top
     iconContainerClassOverride = ""; // Use default width from getIconSizeClasses
  }
  
  const { container: iconContainerBaseClassFromSettings } = getIconSizeClasses(iconSize);


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
        // Determine the specific container class for this icon
        let currentIconContainerClass = iconContainerBaseClassFromSettings;
        if (iconArrangement === IconArrangementOption.Horizontal) {
            // For horizontal arrangement, we want a list-like view.
            // The container will be full-width, but AppIcon itself will manage its internal layout.
            currentIconContainerClass = `${getIconSizeClasses(iconSize).container.replace(/w-\d+|w-auto/, 'w-full')} py-1`;
        } else if (iconArrangement === IconArrangementOption.Vertical) {
            currentIconContainerClass = getIconSizeClasses(iconSize).container;
        } else { // Free
            currentIconContainerClass = getIconSizeClasses(iconSize).container;
        }

        return (
        <div key={app.id} 
             className={`${currentIconContainerClass} ${iconContainerClassOverride}`}
            // style={iconArrangement === IconArrangementOption.Free && app.x !== undefined && app.y !== undefined ? { position: 'absolute', left: app.x, top: app.y } : {}}
        >
            <AppIcon
            app={app}
            iconSize={iconSize} 
            isHorizontalArrange={iconArrangement === IconArrangementOption.Horizontal} // Pass arrangement type
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