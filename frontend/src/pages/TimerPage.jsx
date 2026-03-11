import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ScrollPicker from '../components/ScrollPicker';

const TimerPage = () => {
  const navigate = useNavigate();
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
  const [currentPhase, setCurrentPhase] = useState('training'); // 'training' or 'rest'
  const [currentRound, setCurrentRound] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const intervalRef = useRef(null);
  const audioContextRef = useRef(null);

  // Generate arrays for pickers
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const seconds = Array.from({ length: 60 }, (_, i) => i);
  const reps = Array.from({ length: 20 }, (_, i) => i + 1);

  // Beep sound function
  const playBeep = useCallback((duration = 5000) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 880; // A5 note
    oscillator.type = 'sine';

    // Beep pattern for 5 seconds (beep on/off)
    const beepInterval = 500; // 500ms on, 500ms off
    const beepCount = Math.floor(duration / (beepInterval * 2));

    for (let i = 0; i < beepCount; i++) {
      const startTime = ctx.currentTime + (i * beepInterval * 2) / 1000;
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.setValueAtTime(0, startTime + beepInterval / 1000);
    }

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration / 1000);
  }, []);

  // Start timer
  const startTimer = () => {
    let initialTime;
    if (timerType === 'single') {
      initialTime = singleMinutes * 60 + singleSeconds;
    } else {
      initialTime = trainingMinutes * 60 + trainingSeconds;
    }

    if (initialTime === 0) return;

    setTimeRemaining(initialTime);
    setTotalTime(initialTime);
    setCurrentPhase('training');
    setCurrentRound(1);
    setIsRunning(true);
    setIsPaused(false);
    playBeep(5000); // Beep at start
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
    setCurrentPhase('training');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Timer countdown logic
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Timer finished
            playBeep(5000); // Beep at end

            if (timerType === 'single') {
              // Single timer done
              setIsRunning(false);
              return 0;
            }

            // Repeatable timer logic
            if (currentPhase === 'training') {
              // Switch to rest
              const restTime = restMinutes * 60 + restSeconds;
              if (restTime > 0) {
                setCurrentPhase('rest');
                setTotalTime(restTime);
                return restTime;
              } else {
                // No rest, go to next round or finish
                if (currentRound >= repetitions) {
                  setIsRunning(false);
                  return 0;
                }
                setCurrentRound((r) => r + 1);
                const trainTime = trainingMinutes * 60 + trainingSeconds;
                setTotalTime(trainTime);
                return trainTime;
              }
            } else {
              // Rest finished, go to next round or finish
              if (currentRound >= repetitions) {
                setIsRunning(false);
                return 0;
              }
              setCurrentRound((r) => r + 1);
              setCurrentPhase('training');
              const trainTime = trainingMinutes * 60 + trainingSeconds;
              setTotalTime(trainTime);
              return trainTime;
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
        <h1 className="timer-title">Timer</h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {!isRunning ? (
        /* Timer Setup */
        <div className="timer-setup">
          {/* Timer Type Toggle */}
          <div className="timer-type-toggle">
            <button
              className={`timer-type-btn ${timerType === 'repeatable' ? 'timer-type-btn--active' : ''}`}
              onClick={() => setTimerType('repeatable')}
            >
              Repeatable
            </button>
            <button
              className={`timer-type-btn ${timerType === 'single' ? 'timer-type-btn--active' : ''}`}
              onClick={() => setTimerType('single')}
            >
              Single
            </button>
          </div>

          {timerType === 'repeatable' ? (
            /* Repeatable Timer Settings */
            <div className="timer-settings">
              {/* Training Time */}
              <div className="timer-setting-group">
                <h3 className="timer-setting-title">Training Time</h3>
                <div className="timer-pickers">
                  <ScrollPicker
                    values={minutes}
                    selectedValue={trainingMinutes}
                    onChange={setTrainingMinutes}
                    label="min"
                  />
                  <span className="timer-picker-separator">:</span>
                  <ScrollPicker
                    values={seconds}
                    selectedValue={trainingSeconds}
                    onChange={setTrainingSeconds}
                    label="sec"
                  />
                </div>
              </div>

              {/* Rest Time */}
              <div className="timer-setting-group">
                <h3 className="timer-setting-title">Rest Time</h3>
                <div className="timer-pickers">
                  <ScrollPicker
                    values={minutes}
                    selectedValue={restMinutes}
                    onChange={setRestMinutes}
                    label="min"
                  />
                  <span className="timer-picker-separator">:</span>
                  <ScrollPicker
                    values={seconds}
                    selectedValue={restSeconds}
                    onChange={setRestSeconds}
                    label="sec"
                  />
                </div>
              </div>

              {/* Repetitions */}
              <div className="timer-setting-group">
                <h3 className="timer-setting-title">Repetitions</h3>
                <div className="timer-pickers timer-pickers--single">
                  <ScrollPicker
                    values={reps}
                    selectedValue={repetitions}
                    onChange={setRepetitions}
                    label="rounds"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Single Timer Settings */
            <div className="timer-settings">
              <div className="timer-setting-group">
                <h3 className="timer-setting-title">Duration</h3>
                <div className="timer-pickers">
                  <ScrollPicker
                    values={minutes}
                    selectedValue={singleMinutes}
                    onChange={setSingleMinutes}
                    label="min"
                  />
                  <span className="timer-picker-separator">:</span>
                  <ScrollPicker
                    values={seconds}
                    selectedValue={singleSeconds}
                    onChange={setSingleSeconds}
                    label="sec"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Start Button */}
          <button onClick={startTimer} className="timer-start-btn">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Start Timer
          </button>
        </div>
      ) : (
        /* Timer Running */
        <div className="timer-running">
          {/* Progress Ring */}
          <div className="timer-progress-container">
            <svg className="timer-progress-ring" viewBox="0 0 200 200">
              <circle
                className="timer-progress-bg"
                cx="100"
                cy="100"
                r="90"
                fill="none"
                strokeWidth="8"
              />
              <circle
                className="timer-progress-bar"
                cx="100"
                cy="100"
                r="90"
                fill="none"
                strokeWidth="8"
                strokeDasharray={565.48}
                strokeDashoffset={565.48 * (1 - progress / 100)}
                style={{
                  stroke: currentPhase === 'training' ? 'var(--primary)' : 'var(--green)'
                }}
              />
            </svg>

            <div className="timer-display">
              <span className="timer-time">{formatTime(timeRemaining)}</span>
              {timerType === 'repeatable' && (
                <>
                  <span className="timer-phase">
                    {currentPhase === 'training' ? 'TRAINING' : 'REST'}
                  </span>
                  <span className="timer-round">
                    Round {currentRound} / {repetitions}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="timer-controls">
            <button onClick={togglePause} className="timer-control-btn timer-control-btn--pause">
              {isPaused ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              )}
            </button>
            <button onClick={stopTimer} className="timer-control-btn timer-control-btn--stop">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
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
