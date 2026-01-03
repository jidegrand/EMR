import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader, AlertCircle } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks';

/**
 * DictationTextArea - Text area with speech-to-text capability
 * 
 * Features:
 * - Toggle microphone on/off
 * - Visual feedback while listening
 * - Interim results shown in real-time
 * - Appends dictated text to existing content
 */

const DictationTextArea = ({ 
  value, 
  onChange, 
  placeholder, 
  rows = 4, 
  label,
  disabled = false,
  dictationEnabled = true,  // Global toggle from settings
}) => {
  const textareaRef = useRef(null);
  const [localInterim, setLocalInterim] = useState('');
  
  const {
    isListening,
    isSupported,
    interimTranscript,
    error,
    toggleListening,
    stopListening,
  } = useSpeechRecognition();

  // Handle dictation result - append to current value
  const handleDictationResult = (text) => {
    const currentValue = value || '';
    const needsSpace = currentValue.length > 0 && !currentValue.endsWith(' ') && !currentValue.endsWith('\n');
    const newValue = currentValue + (needsSpace ? ' ' : '') + text;
    
    onChange({ target: { value: newValue } });
    setLocalInterim('');
  };

  // Update local interim when speech recognition interim changes
  useEffect(() => {
    if (isListening) {
      setLocalInterim(interimTranscript);
    }
  }, [interimTranscript, isListening]);

  // Stop listening if component unmounts
  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, []);

  const handleMicClick = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    toggleListening(handleDictationResult);
  };

  // Combine value with interim transcript for display
  const displayValue = isListening && localInterim 
    ? value + (value && !value.endsWith(' ') && !value.endsWith('\n') ? ' ' : '') + localInterim
    : value;

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-teal-400 mb-1">{label}</label>
      )}
      
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={displayValue}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled || isListening}
          className={`w-full px-3 py-2 pr-12 bg-slate-900 border rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none transition-colors ${
            isListening 
              ? 'border-rose-500 bg-rose-900/10' 
              : 'border-slate-600'
          }`}
        />
        
        {/* Dictation Controls */}
        {dictationEnabled && (
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {/* Mic Button */}
            <button
              type="button"
              onClick={handleMicClick}
              disabled={disabled || !isSupported}
              className={`p-2 rounded-lg transition-all ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-500/50'
                  : isSupported
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
              title={
                !isSupported 
                  ? 'Speech recognition not supported' 
                  : isListening 
                    ? 'Stop dictation' 
                    : 'Start dictation'
              }
            >
              {isListening ? (
                <Mic className="w-4 h-4" />
              ) : (
                <MicOff className="w-4 h-4" />
              )}
            </button>
            
            {/* Error indicator */}
            {error && (
              <div className="p-1" title={error}>
                <AlertCircle className="w-4 h-4 text-amber-400" />
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Listening indicator */}
      {isListening && (
        <div className="flex items-center gap-2 mt-1 text-xs text-rose-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            Listening... Speak now
          </span>
          <button 
            onClick={stopListening}
            className="text-slate-400 hover:text-white underline"
          >
            Stop
          </button>
        </div>
      )}
      
      {/* Interim preview */}
      {isListening && localInterim && (
        <div className="mt-1 px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-400 italic">
          {localInterim}...
        </div>
      )}
    </div>
  );
};

export default DictationTextArea;
