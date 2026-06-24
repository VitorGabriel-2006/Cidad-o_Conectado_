"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useA11yStore } from "@/store/useA11yStore";

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useVoiceSearch(onSearch: (transcript: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { announce } = useA11yStore();

  // Initialize SpeechRecognition on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "pt-BR";

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          
          setTranscript(currentTranscript);

          // Reset silence timer
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }

          // Trigger search after 2 seconds of silence
          silenceTimerRef.current = setTimeout(() => {
            recognition.stop();
            // Pass the final transcript state
            if (currentTranscript.trim()) {
              announce(`Você pesquisou por: ${currentTranscript}`);
            }
            onSearch(currentTranscript);
          }, 2000);
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          if (event.error === "not-allowed") {
            toast.error("Para usar a busca por voz, permita o acesso ao microfone no seu navegador.");
          } else {
            toast.error("Ocorreu um erro no reconhecimento de voz.");
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
        };

        recognitionRef.current = recognition;
      } else {
        console.warn("Speech Recognition API não suportada neste navegador.");
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, [onSearch]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast.error("Busca por voz não é suportada no seu navegador.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      // Se parou manualmente, dispara a busca
      if (transcript.trim()) {
        onSearch(transcript);
      }
    } else {
      setTranscript("");
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  }, [isListening, transcript, onSearch]);

  return {
    isListening,
    transcript,
    toggleListening,
    isSupported: typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  };
}
