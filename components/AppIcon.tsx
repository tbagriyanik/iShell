import React from 'react';
import { DesktopApp, IconSizeOption } from '../types';
import { getIconSizeClasses, APP_ICON_COMPONENT_MAP } from '../constants';

interface AppIconProps {
  app: DesktopApp;
  iconSize: IconSizeOption;
  onOpen: (appId: string) => void;
  onContextMenu: (event: React.MouseEvent, appId: string) => void;
}

const AppIcon: React.FC<AppIconProps> = ({ app, iconSize, onOpen, onContextMenu }) => {
  const { iconFrame: iconFrameClass, iconItself: iconItselfClass, text: textClass } = getIconSizeClasses(iconSize);

  const handleClick = () => { 
    onOpen(app.id);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    onContextMenu(event, app.id);
  };

  const IconComponent = APP_ICON_COMPONENT_MAP[app.iconId] || APP_ICON_COMPONENT_MAP['DefaultAppIcon'];
  
  const buttonClasses = `focus:outline-none transition-colors duration-150 rounded-lg hover:bg-white/10 focus:bg-white/20 flex flex-col items-center justify-start w-full h-full p-1`;

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      aria-label={`Open ${app.name}`}
    >
      <div className={`${iconFrameClass}`}>
        <IconComponent className="w-full h-full" iconSizeClass={iconItselfClass} />
      </div>
      <span 
        className={`${textClass} text-shadow-sm select-none pt-0.5 text-center w-full truncate`}
      >
        {app.name}
      </span>
    </button>
  );
};

export default AppIcon;