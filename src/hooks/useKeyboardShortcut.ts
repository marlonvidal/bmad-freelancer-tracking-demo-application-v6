import { useEffect, useCallback } from 'react';

interface ShortcutOptions {
  ctrl?: boolean;
  shift?: boolean;
  /** On Mac this maps to Cmd (metaKey); on Windows/Linux it maps to Ctrl */
  cmdOrCtrl?: boolean;
}

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: ShortcutOptions = {}
) {
  const stableCallback = useCallback(callback, [callback]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
      const primaryModifier = isMac ? e.metaKey : e.ctrlKey;

      const cmdOrCtrlMatch = options.cmdOrCtrl ? primaryModifier : true;
      const shiftMatch = options.shift ? e.shiftKey : !e.shiftKey;
      const ctrlMatch = options.ctrl ? e.ctrlKey : true;
      const keyMatch = e.key.toUpperCase() === key.toUpperCase();

      // When cmdOrCtrl is set, don't also require separate ctrl check
      const modifiersMatch = options.cmdOrCtrl
        ? cmdOrCtrlMatch && (options.shift ? e.shiftKey : !e.shiftKey)
        : ctrlMatch && shiftMatch;

      if (keyMatch && modifiersMatch) {
        e.preventDefault();
        stableCallback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, stableCallback, options.ctrl, options.shift, options.cmdOrCtrl]);
}
