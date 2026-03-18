import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ScrollPicker from '../components/ScrollPicker';
import { useLanguage } from '../context/LanguageContext';

const TimerPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [timerType, setTimerType] = useState('repeatable'); // 'repeatable' or 'single'

  // Timer settings
  const [trainingMinutes, setTrainingMinutes] = useState(1);
  const [trainingSeconds, setTrainingSeconds] = useState(0);
  const [restMinutes, setRestMinutes] = useState(0);
  const [restSeconds, setRestSeconds] = useState(30);
  const [repetitions, setRepetitions] = useState(5);

  // Single timer settings
  const [singleMinutes, setSingleMinutes] = useState(5);
  const [singleSeconds, setSingleSeconds] = useState(0);

  // Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('rest'); // 'training' or 'rest'
  const [currentRound, setCurrentRound] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isBeeping, setIsBeeping] = useState(false);

  const intervalRef = useRef(null);
  const audioContextRef = useRef(null);
  const beepIntervalRef = useRef(null);

  // Generate arrays for pickers
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const seconds = Array.from({ length: 60 }, (_, i) => i);
  const reps = Array.from({ length: 20 }, (_, i) => i + 1);

  // Single beep sound function
  const playBeep = useCallback((frequency = 880, duration = 200) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration / 1000);
  }, []);

  // Start countdown beeps (last 5 seconds)
  const startCountdownBeeps = useCallback(() => {
    if (isBeeping) return;
    setIsBeeping(true);
  }, [isBeeping]);

  // Stop countdown beeps
  const stopCountdownBeeps = useCallback(() => {
    setIsBeeping(false);
    if (beepIntervalRef.current) {
      clearInterval(beepIntervalRef.current);
      beepIntervalRef.current = null;
    }
  }, []);

  // Start timer
  const startTimer = () => {
    let initialTime;
    let initialPhase;

    if (timerType === 'single') {
      initialTime = singleMinutes * 60 + singleSeconds;
      initialPhase = 'training';
    } else {
      // Repeatable: start with REST
      initialTime = restMinutes * 60 + restSeconds;
      initialPhase = 'rest';
      // If no rest time, start with training instead
      if (initialTime === 0) {
        initialTime = trainingMinutes * 60 + trainingSeconds;
        initialPhase = 'training';
      }
    }

    if (initialTime === 0) return;

    setTimeRemaining(initialTime);
    setTotalTime(initialTime);
    setCurrentPhase(initialPhase);
    setCurrentRound(1);
    setIsRunning(true);
    setIsPaused(false);
    setIsBeeping(false);
  };

  // Pause/Resume
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Stop timer
  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(0);
    setCurrentRound(1);
    setCurrentPhase('rest');
    setIsBeeping(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (beepIntervalRef.current) {
      clearInterval(beepIntervalRef.current);
    }
  };

  // Timer countdown logic
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          // Play beep in last 5 seconds
          if (prev <= 5 && prev > 0) {
            playBeep(prev === 1 ? 1200 : 880, prev === 1 ? 500 : 200); // Higher pitch on last beep
          }

          if (prev <= 1) {
            // Timer finished
            setIsBeeping(false);

            if (timerType === 'single') {
              // Single timer done
              setIsRunning(false);
              return 0;
            }

            // Repeatable timer logic: REST → TRAINING → REST → TRAINING...
            if (currentPhase === 'rest') {
              // Switch to training
              const trainTime = trainingMinutes * 60 + trainingSeconds;
              if (trainTime > 0) {
                setCurrentPhase('training');
                setTotalTime(trainTime);
                return trainTime;
              } else {
                // No training time, go to next round or finish
                if (currentRound >= repetitions) {
                  setIsRunning(false);
                  return 0;
                }
                setCurrentRound((r) => r + 1);
                const restTime = restMinutes * 60 + restSeconds;
                setTotalTime(restTime);
                return restTime;
              }
            } else {
              // Training finished, go to next round or finish
              if (currentRound >= repetitions) {
                setIsRunning(false);
                return 0;
              }
              setCurrentRound((r) => r + 1);
              setCurrentPhase('rest');
              const restTime = restMinutes * 60 + restSeconds;
              // If no rest time, skip to training
              if (restTime === 0) {
                setCurrentPhase('training');
                const trainTime = trainingMinutes * 60 + trainingSeconds;
                setTotalTime(trainTime);
                return trainTime;
              }
              setTotalTime(restTime);
              return restTime;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, currentPhase, currentRound, repetitions, timerType,
      trainingMinutes, trainingSeconds, restMinutes, restSeconds, playBeep]);

  // Format time display
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Progress percentage
  const progress = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;

  return (
    <div className="timer-page">
      {/* Header */}
      <header className="timer-header">
        <button onClick={() => navigate(-1)} className="timer-back-btn">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="timer-title">{t('timer.title')}</h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {!isRunning ? (
        /* Timer Setup - Premium UI */
        <div className="timer-setup-premium">
          {/* Hero Section */}
          <div className="timer-hero">
            <div className="timer-hero-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="timer-hero-text">{t('timer.title')}</p>
          </div>

          {/* Timer Type Toggle */}
          <div className="timer-type-card">
            <div className="timer-type-toggle-premium">
              <button
                className={`timer-type-btn-premium ${timerType === 'repeatable' ? 'timer-type-btn-premium--active' : ''}`}
                onClick={() => setTimerType('repeatable')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('timer.repeatable')}
              </button>
              <button
                className={`timer-type-btn-premium ${timerType === 'single' ? 'timer-type-btn-premium--active' : ''}`}
                onClick={() => setTimerType('single')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('timer.single')}
              </button>
            </div>
          </div>

          {timerType === 'repeatable' ? (
            /* Repeatable Timer Settings */
            <div className="timer-settings-premium">
              {/* Rest Time - First since it starts with rest */}
              <div className="timer-setting-card timer-setting-card--rest">
                <div className="timer-setting-header">
                  <div className="timer-setting-icon timer-setting-icon--rest">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <h3 className="timer-setting-label">{t('timer.restTime')}</h3>
                </div>
                <div className="timer-pickers-premium">
                  <ScrollPicker values={minutes} selectedValue={restMinutes} onChange={setRestMinutes} label={t('timer.min')} />
                  <span className="timer-picker-colon">:</span>
                  <ScrollPicker values={seconds} selectedValue={restSeconds} onChange={setRestSeconds} label={t('timer.sec')} />
                </div>
              </div>

              {/* Training Time */}
              <div className="timer-setting-card timer-setting-card--training">
                <div className="timer-setting-header">
                  <div className="timer-setting-icon timer-setting-icon--training">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="timer-setting-label">{t('timer.trainingTime')}</h3>
                </div>
                <div className="timer-pickers-premium">
                  <ScrollPicker values={minutes} selectedValue={trainingMinutes} onChange={setTrainingMinutes} label={t('timer.min')} />
                  <span className="timer-picker-colon">:</span>
                  <ScrollPicker values={seconds} selectedValue={trainingSeconds} onChange={setTrainingSeconds} label={t('timer.sec')} />
                </div>
              </div>

              {/* Repetitions */}
              <div className="timer-setting-card timer-setting-card--reps">
                <div className="timer-setting-header">
                  <div className="timer-setting-icon timer-setting-icon--reps">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <h3 className="timer-setting-label">{t('timer.repetitions')}</h3>
                </div>
                <div className="timer-pickers-premium timer-pickers-premium--single">
                  <ScrollPicker values={reps} selectedValue={repetitions} onChange={setRepetitions} label={t('timer.rounds')} />
                </div>
              </div>
            </div>
          ) : (
            /* Single Timer Settings */
            <div className="timer-settings-premium">
              <div className="timer-setting-card timer-setting-card--single">
                <div className="timer-setting-header">
                  <div className="timer-setting-icon timer-setting-icon--training">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="timer-setting-label">{t('timer.duration')}</h3>
                </div>
                <div className="timer-pickers-premium">
                  <ScrollPicker values={minutes} selectedValue={singleMinutes} onChange={setSingleMinutes} label={t('timer.min')} />
                  <span className="timer-picker-colon">:</span>
                  <ScrollPicker values={seconds} selectedValue={singleSeconds} onChange={setSingleSeconds} label={t('timer.sec')} />
                </div>
              </div>
            </div>
          )}

          {/* Start Button */}
          <button onClick={startTimer} className="timer-start-btn-premium">
            <div className="timer-start-btn-glow" />
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>{t('timer.startTimer')}</span>
          </button>
        </div>
      ) : (
        /* Timer Running - Full Screen Landscape Optimized */
        <div className={`timer-fullscreen ${currentPhase === 'training' ? 'timer-fullscreen--training' : 'timer-fullscreen--rest'}`}>
          {/* Phase indicator bar */}
          <div className="timer-phase-bar">
            <span className={`timer-phase-label ${currentPhase === 'training' ? 'timer-phase-label--training' : 'timer-phase-label--rest'}`}>
              {currentPhase === 'training' ? t('timer.training') : t('timer.rest')}
            </span>
            {timerType === 'repeatable' && (
              <span className="timer-round-label">
                {t('timer.roundOf')} {currentRound} / {repetitions}
              </span>
            )}
          </div>

          {/* Main timer display */}
          <div className="timer-main-display">
            <div className={`timer-time-huge ${timeRemaining <= 5 ? 'timer-time-huge--warning' : ''}`}>
              {formatTime(timeRemaining)}
            </div>

            {/* Progress bar */}
            <div className="timer-progress-bar-container">
              <div
                className="timer-progress-bar-fill"
                style={{
                  width: `${progress}%`,
                  backgroundColor: currentPhase === 'training' ? 'var(--primary)' : 'var(--green)'
                }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="timer-fullscreen-controls">
            <button onClick={togglePause} className={`timer-big-btn ${isPaused ? 'timer-big-btn--play' : 'timer-big-btn--pause'}`}>
              {isPaused ? (
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              )}
            </button>
            <button onClick={stopTimer} className="timer-big-btn timer-big-btn--stop">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h12v12H6z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerPage;
