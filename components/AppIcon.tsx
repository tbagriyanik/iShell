import React from 'react';
import { DesktopApp, IconSizeOption } from '../types';
import { getIconSizeClasses, APP_ICON_COMPONENT_MAP } from '../constants';

interface AppIconProps {
  app: DesktopApp;
  iconSize: IconSizeOption;
  isHorizontalArrange?: boolean; // Added to know the arrangement context
  onOpen: (appId: string) => void;
  onContextMenu: (event: React.MouseEvent, appId: string) => void;
}

const AppIcon: React.FC<AppIconProps> = ({ app, iconSize, isHorizontalArrange, onOpen, onContextMenu }) => {
  const { iconFrame: iconFrameClass, iconItself: iconItselfClass, text: textClass } = getIconSizeClasses(iconSize);

  const handleClick = () => { 
    onOpen(app.id);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    onContextMenu(event, app.id);
  };

  const IconComponent = APP_ICON_COMPONENT_MAP[app.iconId] || APP_ICON_COMPONENT_MAP['DefaultAppIcon'];
  
  // Base classes for the button
  let buttonClasses = `focus:outline-none transition-colors duration-150 rounded-lg hover:bg-white/10 focus:bg-white/20`;

  if (isHorizontalArrange) {
    // Horizontal arrangement: Icon on left, text on right, full width of its container (which is w-full of Desktop's column)
    buttonClasses += ` flex items-center justify-start w-full p-1 sm:p-1.5 space-x-2`;
  } else {
    // Vertical or Free arrangement: Icon on top, text below, centered
    buttonClasses += ` flex flex-col items-center justify-start w-full h-full p-1`;
  }


  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      aria-label={`Open ${app.name}`}
    >
      <div className={`${isHorizontalArrange ? 'shrink-0' : ''} ${iconFrameClass}`}>
        <IconComponent className="w-full h-full" iconSizeClass={iconItselfClass} />
      </div>
      <span 
        className={`${textClass} text-shadow-sm select-none ${isHorizontalArrange ? 'truncate flex-grow text-left' : 'pt-0.5 text-center w-full truncate'}`}
      >
        {app.name}
      </span>
    </button>
  );
};

export default AppIcon;