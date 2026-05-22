'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const SAMPLE_TEXTS = [
  "The Sun is a star at the center of our solar system. It's about 4.6 billion years old and provides the energy that sustains life on Earth.",
  "Did you know? A teaspoon of neutron star material would weigh about 6 billion tons on Earth.",
  "Correct! The answer is photosynthesis. Plants convert sunlight into chemical energy through this process.",
  "Great job! You've completed this lesson. Let's review what you learned today.",
  "Hint: Think about what happens when light passes through a prism. It separates into different wavelengths.",
];

export default function VoiceTestPage() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  const [rate, setRate] = useState(0.95);
  const [pitch, setPitch] = useState(1);
  const [text, setText] = useState(SAMPLE_TEXTS[0]);
  const [speaking, setSpeaking] = useState(false);
  const [filter, setFilter] = useState('');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const v = speechSynthesis.getVoices();
      if (v.length > 0) {
        setVoices(v);
        // Try to auto-select a good English voice
        const preferred = v.findIndex(
          (voice) =>
            voice.lang.startsWith('en') &&
            (voice.name.includes('Google') ||
              voice.name.includes('Samantha') ||
              voice.name.includes('Natural') ||
              voice.name.includes('Neural'))
        );
        if (preferred >= 0) setSelectedVoiceIndex(preferred);
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(() => {
    stop();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices[selectedVoiceIndex] || null;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    setSpeaking(true);
    speechSynthesis.speak(utterance);
  }, [text, voices, selectedVoiceIndex, rate, pitch, stop]);

  const filteredVoices = voices.filter((v) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return v.name.toLowerCase().includes(q) || v.lang.toLowerCase().includes(q);
  });

  const selectedVoice = voices[selectedVoiceIndex];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            Voice Test
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            {voices.length} voices available on your device
          </p>
        </div>

        {/* Sample text buttons */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Sample texts
          </label>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_TEXTS.map((t, i) => (
              <button
                key={i}
                onClick={() => setText(t)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                  text === t
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-primary-300'
                }`}
              >
                Sample {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Text input */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Text to speak
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-3 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Speed: {rate.toFixed(2)}x
            </label>
            <input
              type="range"
              min={0.5}
              max={1.5}
              step={0.05}
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full accent-primary-500"
            />
            <div className="flex justify-between text-xs text-surface-400">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Pitch: {pitch.toFixed(2)}
            </label>
            <input
              type="range"
              min={0.5}
              max={1.5}
              step={0.05}
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full accent-primary-500"
            />
            <div className="flex justify-between text-xs text-surface-400">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>

        {/* Play / Stop */}
        <div className="flex gap-3">
          <button
            onClick={speak}
            className="flex-1 py-3 rounded-xl font-bold text-white bg-primary-500 hover:bg-primary-600 active:scale-[0.98] transition-all"
          >
            {speaking ? '🔄 Replay' : '▶ Play'}
          </button>
          {speaking && (
            <button
              onClick={stop}
              className="px-6 py-3 rounded-xl font-bold text-white bg-danger-500 hover:bg-danger-600 active:scale-[0.98] transition-all"
            >
              ■ Stop
            </button>
          )}
        </div>

        {/* Current voice badge */}
        {selectedVoice && (
          <div className="bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 rounded-xl p-4">
            <div className="text-sm font-medium text-primary-700 dark:text-primary-300">
              Selected voice
            </div>
            <div className="text-lg font-bold text-primary-900 dark:text-primary-100">
              {selectedVoice.name}
            </div>
            <div className="text-sm text-primary-600 dark:text-primary-400">
              {selectedVoice.lang} · {selectedVoice.localService ? 'Local' : 'Remote'}
            </div>
          </div>
        )}

        {/* Voice list */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              All voices
            </label>
            <input
              type="text"
              placeholder="Filter..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-3 py-1.5 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 w-48"
            />
          </div>
          <div className="space-y-1 max-h-80 overflow-y-auto rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 p-2">
            {filteredVoices.length === 0 && (
              <div className="text-center py-4 text-surface-400 text-sm">No voices match filter</div>
            )}
            {filteredVoices.map((voice) => {
              const realIndex = voices.indexOf(voice);
              const isSelected = realIndex === selectedVoiceIndex;
              return (
                <button
                  key={voice.name + voice.lang}
                  onClick={() => {
                    setSelectedVoiceIndex(realIndex);
                    // Quick preview
                    speechSynthesis.cancel();
                    const u = new SpeechSynthesisUtterance('Hello!');
                    u.voice = voice;
                    u.rate = rate;
                    u.pitch = pitch;
                    speechSynthesis.speak(u);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    isSelected
                      ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-900 dark:text-primary-100'
                      : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{voice.name}</span>
                    <span className="text-xs text-surface-400 ml-2 shrink-0">
                      {voice.lang}
                    </span>
                  </div>
                  {voice.localService && (
                    <span className="text-xs text-surface-400">Local</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
