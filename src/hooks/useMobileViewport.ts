import { useState, useEffect, useCallback } from 'react';

interface ViewportState {
  viewportHeight: number;
  viewportWidth: number;
  keyboardHeight: number;
  isKeyboardOpen: boolean;
  safeAreaBottom: number;
  safeAreaTop: number;
  offsetTop: number;
  offsetLeft: number;
  isLandscape: boolean;
  isSafari: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}

interface ViewportOptions {
  keyboardThreshold?: number;
  debounceDelay?: number;
  debug?: boolean;
  cssProperties?: {
    viewportHeight?: string;
    keyboardHeight?: string;
    safeAreaBottom?: string;
  };
}

const defaultOptions: Required<ViewportOptions> = {
  keyboardThreshold: 150,
  debounceDelay: 50,
  debug: false,
  cssProperties: {
    viewportHeight: '--viewport-height',
    keyboardHeight: '--keyboard-height',
    safeAreaBottom: '--safe-area-bottom',
  },
};

export const useMobileViewport = (options: ViewportOptions = {}) => {
  const opts = { ...defaultOptions, ...options };
  
  const [viewportState, setViewportState] = useState<ViewportState>(() => {
    const initialHeight = window.visualViewport?.height || window.innerHeight;
    const initialWidth = window.visualViewport?.width || window.innerWidth;
    
    return {
      viewportHeight: initialHeight,
      viewportWidth: initialWidth,
      keyboardHeight: 0,
      isKeyboardOpen: false,
      safeAreaBottom: 0,
      safeAreaTop: 0,
      offsetTop: window.visualViewport?.offsetTop || 0,
      offsetLeft: window.visualViewport?.offsetLeft || 0,
      isLandscape: initialWidth > initialHeight,
      isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
      isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
      isAndroid: /Android/.test(navigator.userAgent),
    };
  });

  const getSafeAreas = useCallback(() => {
    const computedStyle = getComputedStyle(document.documentElement);
    const bottom = parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0');
    const top = parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0');
    return { bottom, top };
  }, []);

  const handleViewportChange = useCallback(() => {
    if (!window.visualViewport) {
      if (opts.debug) console.warn('Visual Viewport API not supported');
      return;
    }

    const viewport = window.visualViewport;
    const { bottom: safeBottom, top: safeTop } = getSafeAreas();
    
    const keyboardHeight = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
    const isKeyboardOpen = keyboardHeight > opts.keyboardThreshold;
    
    const newState: ViewportState = {
      viewportHeight: viewport.height,
      viewportWidth: viewport.width,
      keyboardHeight,
      isKeyboardOpen,
      safeAreaBottom: safeBottom,
      safeAreaTop: safeTop,
      offsetTop: viewport.offsetTop,
      offsetLeft: viewport.offsetLeft,
      isLandscape: viewport.width > viewport.height,
      isSafari: viewportState.isSafari,
      isIOS: viewportState.isIOS,
      isAndroid: viewportState.isAndroid,
    };

    setViewportState(newState);

    const root = document.documentElement;
    root.style.setProperty(opts.cssProperties.viewportHeight, `${viewport.height}px`);
    root.style.setProperty(opts.cssProperties.keyboardHeight, `${keyboardHeight}px`);
    root.style.setProperty(opts.cssProperties.safeAreaBottom, `${safeBottom}px`);

    if (opts.debug) {
      console.log('Viewport changed:', newState);
    }
  }, [opts.keyboardThreshold, opts.debug, opts.cssProperties, getSafeAreas, viewportState.isSafari, viewportState.isIOS, viewportState.isAndroid]);

  const debouncedHandler = useCallback(() => {
    let timeoutId: NodeJS.Timeout;
    
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleViewportChange, opts.debounceDelay);
    };
  }, [handleViewportChange, opts.debounceDelay]);

  useEffect(() => {
    if (!window.visualViewport) {
      if (opts.debug) console.warn('Visual Viewport API not supported, falling back to window events');
      
      const fallbackHandler = () => {
        setViewportState(prev => ({
          ...prev,
          viewportHeight: window.innerHeight,
          viewportWidth: window.innerWidth,
          isLandscape: window.innerWidth > window.innerHeight,
        }));
      };
      
      window.addEventListener('resize', fallbackHandler);
      window.addEventListener('orientationchange', fallbackHandler);
      
      return () => {
        window.removeEventListener('resize', fallbackHandler);
        window.removeEventListener('orientationchange', fallbackHandler);
      };
    }

    const handler = debouncedHandler();
    
    window.visualViewport.addEventListener('resize', handler);
    window.visualViewport.addEventListener('scroll', handler);
    
    handleViewportChange();
    
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handler);
        window.visualViewport.removeEventListener('scroll', handler);
      }
    };
  }, [debouncedHandler, handleViewportChange, opts.debug]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const getComposerOffset = useCallback((composerHeight: number = 0) => {
    const { keyboardHeight, safeAreaBottom, isIOS } = viewportState;
    
    if (isIOS) {
      return Math.max(keyboardHeight, safeAreaBottom);
    } else {
      return keyboardHeight + safeAreaBottom;
    }
  }, [viewportState]);

  return {
    ...viewportState,
    scrollToTop,
    getComposerOffset,
    rawViewport: window.visualViewport,
  };
};

export const useKeyboard = (threshold = 150) => {
  const { keyboardHeight, isKeyboardOpen } = useMobileViewport({ keyboardThreshold: threshold });
  return { keyboardHeight, isKeyboardOpen };
};