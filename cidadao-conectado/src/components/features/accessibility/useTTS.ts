import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

export interface TTSState {
  isPlaying: boolean;
  isPaused: boolean;
  rate: number;
  wordIndex: number;
  charIndex: number;
  charLength: number;
}

export function useTTS(text: string) {
  const [state, setState] = useState<TTSState>({
    isPlaying: false,
    isPaused: false,
    rate: 1,
    wordIndex: 0,
    charIndex: 0,
    charLength: 0,
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  const setupUtterance = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.lang = 'pt-BR';
    utterance.rate = state.rate;

    utterance.onstart = () => {
      setState(s => ({ ...s, isPlaying: true, isPaused: false }));
    };

    utterance.onend = () => {
      setState(s => ({ ...s, isPlaying: false, isPaused: false, charIndex: 0, charLength: 0 }));
    };

    utterance.onpause = () => {
      setState(s => ({ ...s, isPlaying: true, isPaused: true }));
    };

    utterance.onresume = () => {
      setState(s => ({ ...s, isPlaying: true, isPaused: false }));
    };

    utterance.onerror = (e) => {
      // Ignorar erros de interrupção (cancelamento manual)
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        toast.error("Ocorreu um erro ao reproduzir o áudio. O motor de voz do seu sistema pode estar indisponível ou não suportar o texto.");
      }
      setState(s => ({ ...s, isPlaying: false, isPaused: false }));
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        let length = event.charLength;
        if (!length || length === 0) {
           const nextSpace = text.indexOf(' ', event.charIndex);
           length = nextSpace !== -1 ? nextSpace - event.charIndex : text.length - event.charIndex;
        }
        setState(s => ({
          ...s,
          charIndex: event.charIndex,
          charLength: length,
        }));
      }
    };

    // Workaround para bug do Chrome de Garbage Collection no SpeechSynthesis
    (window as any).__TTS_UTTERANCE__ = utterance;

    return utterance;
  }, [text, state.rate]);

  const play = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;

    if (state.isPaused) {
      window.speechSynthesis.resume();
      return;
    }

    const utterance = setupUtterance();
    if (utterance) {
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  }, [text, state.isPaused, setupUtterance]);

  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.pause();
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setState(s => ({ ...s, isPlaying: false, isPaused: false, charIndex: 0, charLength: 0 }));
    }
  }, []);

  const setRate = useCallback((newRate: number) => {
    setState(s => ({ ...s, rate: newRate }));
    // If it's playing, we need to restart from the current charIndex or just restart the utterance
    // Web Speech API doesn't support changing rate on the fly well, usually needs restart
    if (typeof window !== 'undefined' && window.speechSynthesis && (state.isPlaying && !state.isPaused)) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text.substring(state.charIndex));
        utterance.lang = 'pt-BR';
        utterance.rate = newRate;
        utterance.onboundary = (e) => {
            if (e.name === 'word') {
                setState(s => ({
                  ...s,
                  charIndex: state.charIndex + e.charIndex,
                  charLength: e.charLength || 0,
                }));
            }
        }
        utterance.onend = () => {
            setState(s => ({ ...s, isPlaying: false, isPaused: false, charIndex: 0, charLength: 0 }));
        };
        window.speechSynthesis.speak(utterance);
      }, 50);
    }
  }, [text, state.isPlaying, state.isPaused, state.charIndex]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    ...state,
    play,
    pause,
    stop,
    setRate
  };
}
