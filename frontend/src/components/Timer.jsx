import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, X, Clock, Bell, Volume2, VolumeX } from 'lucide-react';

export default function Timer({ defaultSeconds = 300, onClose, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAlarmActive, setIsAlarmActive] = useState(false);

  const timerRef = useRef(null);
  const audioContextRef = useRef(null);

  // Play procedural cooking bell sound
  const playAlarmSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      // Lazy init AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Procedural synthetic cooking bell sound (pleasant high beep)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note

      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn('AudioContext warning:', e);
    }
  }, [soundEnabled]);

  // Handle countdown logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsAlarmActive(true);
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  // Alarm sound interval
  useEffect(() => {
    let alarmInterval;
    if (isAlarmActive) {
      playAlarmSound();
      alarmInterval = setInterval(() => {
        playAlarmSound();
      }, 2000);
    }

    return () => clearInterval(alarmInterval);
  }, [isAlarmActive, playAlarmSound]);

  // Trigger onComplete callback when alarm becomes active
  useEffect(() => {
    if (isAlarmActive && onComplete) {
      onComplete();
    }
  }, [isAlarmActive, onComplete]);

  // Synchronize timeLeft state with defaultSeconds when prop changes
  useEffect(() => {
    setTimeLeft(defaultSeconds);
    setIsRunning(false);
    setIsAlarmActive(false);
  }, [defaultSeconds]);

  const handleStartPause = () => {
    if (isAlarmActive) {
      setIsAlarmActive(false);
    }
    // Audio resume for browsers
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsAlarmActive(false);
    setTimeLeft(defaultSeconds);
  };

  const adjustTime = (seconds) => {
    setIsAlarmActive(false);
    setTimeLeft((prev) => Math.max(0, prev + seconds));
  };

  // Formatting helpers
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      padding: '20px',
      borderRadius: 'var(--radius-md)',
      backgroundColor: 'hsl(var(--bg-secondary))',
      border: '1px solid hsl(var(--border))',
      boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      width: '100%',
      maxWidth: '300px',
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'hsl(var(--primary))' }}>
          <Clock size={16} />
          <span style={{ fontWeight: 700, fontSize: '0.85rem', uppercase: true, letterSpacing: '0.05em' }}>
            Cooking Timer
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Sound Toggle */}
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            style={{ color: 'hsl(var(--text-secondary))', display: 'flex', padding: '4px' }}
            title={soundEnabled ? 'Mute Alert' : 'Unmute Alert'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          
          {/* Close Timer */}
          {onClose && (
            <button 
              onClick={onClose} 
              style={{ color: 'hsl(var(--text-secondary))', display: 'flex', padding: '4px' }}
              title="Close Timer"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Clock display */}
      <div style={{
        textAlign: 'center',
        padding: '16px 0',
        backgroundColor: 'hsl(var(--bg-tertiary))',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid hsl(var(--border))',
        fontSize: '2.5rem',
        fontWeight: 800,
        fontFamily: 'monospace',
        color: isAlarmActive ? 'hsl(var(--primary))' : 'hsl(var(--text-primary))',
        animation: isAlarmActive ? 'pulse 1s infinite' : 'none',
        transition: 'color var(--transition-fast)'
      }}>
        {formatTime(timeLeft)}
      </div>

      {/* Time adjusters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        <button 
          onClick={() => adjustTime(-60)} 
          style={{
            padding: '6px 0',
            borderRadius: '4px',
            border: '1px solid hsl(var(--border))',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: 'hsl(var(--bg-secondary))'
          }}
          disabled={timeLeft <= 60}
        >
          -1m
        </button>
        <button 
          onClick={() => adjustTime(-10)} 
          style={{
            padding: '6px 0',
            borderRadius: '4px',
            border: '1px solid hsl(var(--border))',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: 'hsl(var(--bg-secondary))'
          }}
          disabled={timeLeft <= 10}
        >
          -10s
        </button>
        <button 
          onClick={() => adjustTime(10)} 
          style={{
            padding: '6px 0',
            borderRadius: '4px',
            border: '1px solid hsl(var(--border))',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: 'hsl(var(--bg-secondary))'
          }}
        >
          +10s
        </button>
        <button 
          onClick={() => adjustTime(60)} 
          style={{
            padding: '6px 0',
            borderRadius: '4px',
            border: '1px solid hsl(var(--border))',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: 'hsl(var(--bg-secondary))'
          }}
        >
          +1m
        </button>
      </div>

      {/* Action controls */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
        {/* Play/Pause */}
        <button
          onClick={handleStartPause}
          style={{
            flexGrow: 1,
            padding: '10px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: isRunning ? 'hsl(var(--text-primary))' : 'hsl(var(--primary))',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all var(--transition-fast)'
          }}
        >
          {isRunning ? (
            <>
              <Pause size={16} fill="currentColor" /> Pause
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" /> {isAlarmActive ? 'Stop' : 'Start'}
            </>
          )}
        </button>

        {/* Reset */}
        <button
          onClick={handleReset}
          style={{
            padding: '10px 16px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid hsl(var(--border))',
            backgroundColor: 'hsl(var(--bg-tertiary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'hsl(var(--text-primary))',
            transition: 'all var(--transition-fast)'
          }}
          title="Reset Timer"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Alarm Message Banner */}
      {isAlarmActive && (
        <div style={{
          position: 'absolute',
          top: '-45px',
          left: '0',
          right: '0',
          backgroundColor: 'hsl(var(--primary))',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          boxShadow: 'var(--shadow-md)',
          animation: 'pulse 1s infinite'
        }}>
          <Bell size={14} className="animate-bounce" /> Time is up! Your culinary masterpiece is ready!
        </div>
      )}
    </div>
  );
}
