
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WindowState, ThemeColorOption, BackgroundColorOption } from '../types';
import { XMarkIcon } from './icons'; // GridIcon removed
import { getThemeColorClass, DESKTOP_BACKGROUND_PALETTE, APP_ICON_COMPONENT_MAP } from '../constants';

interface WindowProps {
  windowData: WindowState;
  themeColor: ThemeColorOption;
  appIconId: string; // Added to pass the specific app icon
  desktopBackground: BackgroundColorOption; 
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onDragStop: (id: string, newPosition: { x: number; y: number }) => void; 
  onResizeStop: (id: string, newSize: { width: number; height: number }, newPosition?: { x: number; y: number }) => void;
  children: React.ReactNode;
}

type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw' | null;

const WindowComponent: React.FC<WindowProps> = ({ 
    windowData, themeColor, appIconId, desktopBackground, onClose, onFocus, onDragStop, onResizeStop, children 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<ResizeDirection>(null);
  const [dragStartOffset, setDragStartOffset] = useState({ x: 0, y: 0 });
  const [originalWindowRect, setOriginalWindowRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const windowRef = useRef<HTMLDivElement>(null);

  const currentBgIsLight = DESKTOP_BACKGROUND_PALETTE.find(p => p.value === desktopBackground)?.isLight ?? false;
  const titleBarBgClass = getThemeColorClass(themeColor, 'bg', '600');
  const titleBarTextClass = 'text-white'; 
  
  const activeRingClass = `ring-2 ring-offset-2 ${getThemeColorClass(themeColor, 'ring', '400')} ${currentBgIsLight ? 'ring-offset-stone-200 dark:ring-offset-neutral-800' : 'ring-offset-stone-800 dark:ring-offset-neutral-900'}`; 
  const inactiveRingClass = `ring-1 ${currentBgIsLight ? 'ring-black/10' : 'ring-black/20 dark:ring-white/10'}`;

  const MIN_WIDTH = 200; // Increased min width slightly
  const MIN_HEIGHT = 150; // Increased min height slightly
  const TOP_BAR_HEIGHT = 48; 

  const AppSpecificIcon = APP_ICON_COMPONENT_MAP[appIconId] || APP_ICON_COMPONENT_MAP['DefaultAppIcon'];

  const handleTitleBarMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return; 
    
    onFocus(windowData.id);
    setIsDragging(true);
    
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
        setDragStartOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    } else { 
         setDragStartOffset({ x: e.clientX - windowData.x, y: e.clientY - windowData.y });
    }
    e.preventDefault();
  }, [windowData.id, windowData.x, windowData.y, onFocus]);

  const handleResizeHandleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, direction: ResizeDirection) => {
    e.stopPropagation(); 
    onFocus(windowData.id);
    setIsResizing(direction);
    setDragStartOffset({ x: e.clientX, y: e.clientY });
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setOriginalWindowRect({ x: rect.left, y: rect.top, width: rect.width, height: rect.height });
    }
    e.preventDefault();
  }, [windowData.id, onFocus]);


  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!windowRef.current) return;
    e.preventDefault();

    if (isDragging) {
      let newX = e.clientX - dragStartOffset.x;
      let newY = e.clientY - dragStartOffset.y;

      const vpWidth = window.innerWidth;
      const vpHeight = window.innerHeight;
      const winWidth = windowRef.current.offsetWidth;
      
      newX = Math.max(0, Math.min(newX, vpWidth - winWidth));
      newY = Math.max(TOP_BAR_HEIGHT, Math.min(newY, vpHeight - windowRef.current.offsetHeight));

      windowRef.current.style.left = `${newX}px`;
      windowRef.current.style.top = `${newY}px`;
    } else if (isResizing) {
      let newX = originalWindowRect.x;
      let newY = originalWindowRect.y;
      let newWidth = originalWindowRect.width;
      let newHeight = originalWindowRect.height;
      
      const dx = e.clientX - dragStartOffset.x;
      const dy = e.clientY - dragStartOffset.y;

      if (isResizing.includes('e')) newWidth = Math.max(MIN_WIDTH, originalWindowRect.width + dx);
      if (isResizing.includes('w')) {
        newWidth = Math.max(MIN_WIDTH, originalWindowRect.width - dx);
        newX = originalWindowRect.x + dx;
        if (newWidth === MIN_WIDTH) newX = originalWindowRect.x + originalWindowRect.width - MIN_WIDTH;
      }
      if (isResizing.includes('s')) newHeight = Math.max(MIN_HEIGHT, originalWindowRect.height + dy);
      if (isResizing.includes('n')) {
        newHeight = Math.max(MIN_HEIGHT, originalWindowRect.height - dy);
        newY = originalWindowRect.y + dy;
        if (newHeight === MIN_HEIGHT) newY = originalWindowRect.y + originalWindowRect.height - MIN_HEIGHT;
      }
      
      if(newX < 0) { newWidth += newX; newX = 0; }
      if(newY < TOP_BAR_HEIGHT) { newHeight += (newY - TOP_BAR_HEIGHT); newY = TOP_BAR_HEIGHT; }
      if(newX + newWidth > window.innerWidth) newWidth = window.innerWidth - newX;
      if(newY + newHeight > window.innerHeight) newHeight = window.innerHeight - newY;

      windowRef.current.style.left = `${newX}px`;
      windowRef.current.style.top = `${newY}px`;
      windowRef.current.style.width = `${newWidth}px`;
      windowRef.current.style.height = `${newHeight}px`;
    }
  }, [isDragging, isResizing, dragStartOffset, originalWindowRect, TOP_BAR_HEIGHT, MIN_WIDTH, MIN_HEIGHT]);

  const handleMouseUp = useCallback(() => {
    if (isDragging && windowRef.current) {
      onDragStop(windowData.id, { x: parseInt(windowRef.current.style.left, 10), y: parseInt(windowRef.current.style.top, 10) });
    }
    if (isResizing && windowRef.current) {
      const newX = parseInt(windowRef.current.style.left, 10);
      const newY = parseInt(windowRef.current.style.top, 10);
      const newWidth = parseInt(windowRef.current.style.width, 10);
      const newHeight = parseInt(windowRef.current.style.height, 10);

      if (isResizing.includes('n') || isResizing.includes('w')) {
         onResizeStop(windowData.id, { width: newWidth, height: newHeight }, {x: newX, y: newY});
      } else {
         onResizeStop(windowData.id, { width: newWidth, height: newHeight });
      }
    }
    setIsDragging(false);
    setIsResizing(null);
    if (document.body.style.cursor !== 'default') document.body.style.cursor = 'default';
  }, [isDragging, isResizing, windowData.id, onDragStop, onResizeStop]);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      if (isResizing) document.body.style.cursor = `${isResizing}-resize`;
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      if (document.body.style.cursor !== 'default') document.body.style.cursor = 'default';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      if (document.body.style.cursor !== 'default') document.body.style.cursor = 'default';
    };
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  if (windowData.isMinimized) {
    return null;
  }

  const resizeHandleClass = "absolute bg-transparent z-10";

  return (
    <div
      ref={windowRef}
      className={`fixed flex flex-col ${currentBgIsLight ? 'bg-stone-100/95' : 'bg-stone-800/90 dark:bg-neutral-900/90'} backdrop-blur-md shadow-2xl rounded-lg overflow-hidden 
                  ${currentBgIsLight ? 'border border-stone-300/50' : 'border border-stone-700 dark:border-neutral-700'}
                  ${windowData.isActive ? activeRingClass : inactiveRingClass}
                  transition-shadow duration-150 ease-in-out`}
      style={{
        left: windowData.x,
        top: windowData.y,
        width: windowData.width,
        height: windowData.height,
        zIndex: windowData.zIndex,
        minWidth: `${MIN_WIDTH}px`, 
        minHeight: `${MIN_HEIGHT}px`,
        maxWidth: '100vw', 
        maxHeight: `calc(100vh - ${TOP_BAR_HEIGHT}px)`,
      }}
      onClick={() => onFocus(windowData.id)}
      onTouchStart={() => onFocus(windowData.id)} 
    >
      <div className={`${resizeHandleClass} top-0 left-0 w-full h-2 cursor-n-resize`} onMouseDown={(e) => handleResizeHandleMouseDown(e, 'n')}></div>
      <div className={`${resizeHandleClass} top-0 right-0 w-2 h-full cursor-e-resize`} onMouseDown={(e) => handleResizeHandleMouseDown(e, 'e')}></div>
      <div className={`${resizeHandleClass} bottom-0 left-0 w-full h-2 cursor-s-resize`} onMouseDown={(e) => handleResizeHandleMouseDown(e, 's')}></div>
      <div className={`${resizeHandleClass} top-0 left-0 w-2 h-full cursor-w-resize`} onMouseDown={(e) => handleResizeHandleMouseDown(e, 'w')}></div>
      <div className={`${resizeHandleClass} top-0 left-0 w-3 h-3 cursor-nw-resize`} onMouseDown={(e) => handleResizeHandleMouseDown(e, 'nw')}></div>
      <div className={`${resizeHandleClass} top-0 right-0 w-3 h-3 cursor-ne-resize`} onMouseDown={(e) => handleResizeHandleMouseDown(e, 'ne')}></div>
      <div className={`${resizeHandleClass} bottom-right-0 w-3 h-3 cursor-se-resize bottom-0 right-0`} onMouseDown={(e) => handleResizeHandleMouseDown(e, 'se')}></div>
      <div className={`${resizeHandleClass} bottom-left-0 w-3 h-3 cursor-sw-resize bottom-0 left-0`} onMouseDown={(e) => handleResizeHandleMouseDown(e, 'sw')}></div>
      
      <div
        className={`window-title-bar h-8 sm:h-9 ${titleBarBgClass} ${titleBarTextClass} flex items-center justify-between px-2 sm:px-2.5 cursor-grab active:cursor-grabbing select-none shrink-0 relative z-20`}
        onMouseDown={handleTitleBarMouseDown}
      >
        <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-hidden">
          <div className="w-4 h-4 sm:w-5 sm:h-5 shrink-0">
            <AppSpecificIcon className="w-full h-full rounded-sm" iconSizeClass="w-full h-full"/>
          </div>
          <span className="text-xs sm:text-sm font-medium truncate">{windowData.title}</span>
        </div>
        <div className="flex items-center">
          <button
            onClick={(e) => { e.stopPropagation(); onClose(windowData.id); }}
            className={`p-1 sm:p-1.5 rounded-full hover:bg-black/20 transition-colors`}
            aria-label="Close window"
          >
            <XMarkIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>
      <div className={`flex-grow overflow-auto scrollbar-thin ${currentBgIsLight ? 'scrollbar-thumb-stone-400' : 'scrollbar-thumb-stone-600 dark:scrollbar-thumb-neutral-700'} scrollbar-track-transparent relative z-0`}>
        {children}
      </div>
    </div>
  );
};

export default WindowComponent;
