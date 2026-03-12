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
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
      const primaryModifier = isMac ? e.metaKey : e.ctrlKey;

      const keyMatch = e.key.toUpperCase() === key.toUpperCase();

      let modifiersMatch: boolean;
      if (options.cmdOrCtrl) {
        // Require the platform's primary modifier (Cmd on Mac, Ctrl on Win/Linux)
        const cmdOrCtrlMatch = primaryModifier;
        const shiftMatch = options.shift ? e.shiftKey : !e.shiftKey;
        modifiersMatch = cmdOrCtrlMatch && shiftMatch;
      } else {
        // Explicit ctrl/shift flags — each must match exactly
        const ctrlMatch = options.ctrl ? e.ctrlKey : !e.ctrlKey;
        const shiftMatch = options.shift ? e.shiftKey : !e.shiftKey;
        modifiersMatch = ctrlMatch && shiftMatch;
      }

      if (keyMatch && modifiersMatch) {
        e.preventDefault();
        stableCallback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, stableCallback, options.ctrl, options.shift, options.cmdOrCtrl]);
}
