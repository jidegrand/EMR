import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for speech-to-text functionality
 * Uses Web Speech API (built into Chrome/Edge/Safari)
 * 
 * For production, swap this implementation with:
 * - Microsoft Azure Speech Services (includes Nuance Dragon Medical)
 * - Google Cloud Speech-to-Text with Medical model
 * 
 * Azure Speech SDK: npm install microsoft-cognitiveservices-speech-sdk
 */

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const onResultCallbackRef = useRef(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      
      // Configuration
      recognition.continuous = true;        // Keep listening until stopped
      recognition.interimResults = true;    // Show results while speaking
      recognition.lang = 'en-US';           // Language
      recognition.maxAlternatives = 1;
      
      // Event handlers
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onerror = (event) => {
        setError(event.error);
        setIsListening(false);
        
        // Common errors:
        // 'not-allowed' - Microphone permission denied
        // 'no-speech' - No speech detected
        // 'network' - Network error (for cloud-based recognition)
      };
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimText = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimText += result[0].transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
          // Call the callback with the final transcript
          if (onResultCallbackRef.current) {
            onResultCallbackRef.current(finalTranscript);
          }
        }
        
        setInterimTranscript(interimText);
      };
      
      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser. Try Chrome or Edge.');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback((onResult) => {
    if (recognitionRef.current && !isListening) {
      onResultCallbackRef.current = onResult;
      setTranscript('');
      setInterimTranscript('');
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Already started
        console.log('Recognition already started');
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setInterimTranscript('');
    }
  }, [isListening]);

  const toggleListening = useCallback((onResult) => {
    if (isListening) {
      stopListening();
    } else {
      startListening(onResult);
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    toggleListening,
  };
};

export default useSpeechRecognition;

/**
 * PRODUCTION IMPLEMENTATION NOTES:
 * ================================
 * 
 * To integrate Microsoft Azure Speech Services (with Nuance Dragon Medical):
 * 
 * 1. Install SDK: npm install microsoft-cognitiveservices-speech-sdk
 * 
 * 2. Get Azure Speech resource key and region from Azure Portal
 * 
 * 3. Replace the Web Speech API code with:
 * 
 * import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
 * 
 * const speechConfig = sdk.SpeechConfig.fromSubscription(AZURE_KEY, AZURE_REGION);
 * speechConfig.speechRecognitionLanguage = 'en-US';
 * 
 * // Enable medical vocabulary (requires Healthcare tier)
 * speechConfig.setProperty(
 *   sdk.PropertyId.SpeechServiceConnection_LanguageIdMode, 
 *   "Continuous"
 * );
 * 
 * const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
 * const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
 * 
 * recognizer.recognizing = (s, e) => {
 *   // Interim results
 *   setInterimTranscript(e.result.text);
 * };
 * 
 * recognizer.recognized = (s, e) => {
 *   if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
 *     // Final result
 *     onResult(e.result.text);
 *   }
 * };
 * 
 * recognizer.startContinuousRecognitionAsync();
 * 
 * 4. For HIPAA compliance:
 *    - Sign BAA with Microsoft
 *    - Use Azure Government or Healthcare-compliant region
 *    - Don't log/store audio without patient consent
 */
