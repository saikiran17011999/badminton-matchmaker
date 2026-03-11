import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [feedbackType, setFeedbackType] = useState('text');
  const [textFeedback, setTextFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const handleSubmit = async () => {
    if (feedbackType === 'text' && !textFeedback.trim()) {
      alert('Please enter your feedback');
      return;
    }

    if (feedbackType === 'voice' && !audioBlob) {
      alert('Please record your feedback');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formData = new FormData();
      formData.append('type', feedbackType);
      formData.append('email', email || 'Not provided');

      if (feedbackType === 'text') {
        formData.append('message', textFeedback);
      } else {
        formData.append('audio', audioBlob, 'feedback.webm');
      }

      const response = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTextFeedback('');
        setEmail('');
        setAudioBlob(null);
        setAudioUrl(null);
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-page">
      {/* Header */}
      <header className="feedback-header">
        <button onClick={() => navigate(-1)} className="feedback-back-btn">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="feedback-title">{t('feedback.title')}</h1>
        <div className="w-10" />
      </header>

      <div className="feedback-content">
        {/* Type Toggle */}
        <div className="feedback-type-toggle">
          <button
            className={`feedback-type-btn ${feedbackType === 'text' ? 'feedback-type-btn--active' : ''}`}
            onClick={() => setFeedbackType('text')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {t('feedback.write')}
          </button>
          <button
            className={`feedback-type-btn ${feedbackType === 'voice' ? 'feedback-type-btn--active' : ''}`}
            onClick={() => setFeedbackType('voice')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            {t('feedback.record')}
          </button>
        </div>

        {feedbackType === 'text' ? (
          <div className="feedback-text-section">
            <textarea
              value={textFeedback}
              onChange={(e) => setTextFeedback(e.target.value)}
              placeholder={t('feedback.placeholder')}
              className="feedback-textarea"
              rows={6}
            />
          </div>
        ) : (
          <div className="feedback-voice-section">
            {!audioUrl ? (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`feedback-record-btn ${isRecording ? 'feedback-record-btn--recording' : ''}`}
              >
                <div className="feedback-record-icon">
                  {isRecording ? (
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h12v12H6z" />
                    </svg>
                  ) : (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  )}
                </div>
                <span className="feedback-record-text">
                  {isRecording ? t('feedback.tapToStop') : t('feedback.tapToRecord')}
                </span>
                {isRecording && (
                  <span className="feedback-recording-indicator" />
                )}
              </button>
            ) : (
              <div className="feedback-audio-preview">
                <audio src={audioUrl} controls className="feedback-audio-player" />
                <button onClick={deleteRecording} className="feedback-delete-btn">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {t('feedback.deleteReRecord')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Email (Optional) */}
        <div className="feedback-email-section">
          <label className="feedback-email-label">
            {t('feedback.email')}
            <span className="feedback-email-hint">{t('feedback.emailHint')}</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('feedback.emailPlaceholder')}
            className="feedback-email-input"
          />
        </div>

        {/* Submit Status */}
        {submitStatus && (
          <div className={`feedback-status feedback-status--${submitStatus}`}>
            {submitStatus === 'success' ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('feedback.thankYou')}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('feedback.failed')}
              </>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="feedback-submit-btn"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t('feedback.sending')}
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              {t('feedback.sendFeedback')}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FeedbackPage;
