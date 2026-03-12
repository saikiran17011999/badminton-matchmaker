import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// Video data organized by category
const videoData = {
  warmup: [
    {
      id: 'OrvAMerIaug',
      title: 'Badminton Warmup Routine',
      startTime: 221,
    },
    {
      id: 'YH8Ihl1P9w0',
      title: 'Dynamic Stretching',
      startTime: 0,
    },
    {
      id: '0kuXTh9foT0',
      title: 'Pre-Game Exercises',
      startTime: 0,
    },
  ],
  singles: [],
  doubles: [],
};

const CombosPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const comboTypes = [
    {
      id: 'warmup',
      titleKey: 'videos.warmup',
      descKey: 'videos.warmupDesc',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'var(--orange)',
      videoCount: videoData.warmup.length,
    },
    {
      id: 'singles',
      titleKey: 'videos.singles',
      descKey: 'videos.singlesDesc',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'var(--primary)',
      videoCount: videoData.singles.length,
    },
    {
      id: 'doubles',
      titleKey: 'videos.doubles',
      descKey: 'videos.doublesDesc',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'var(--green)',
      videoCount: videoData.doubles.length,
    },
  ];

  const handleComboClick = (comboId) => {
    const videos = videoData[comboId];
    if (videos && videos.length > 0) {
      setSelectedCategory(comboId);
    }
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseVideoList = () => {
    setSelectedCategory(null);
  };

  const handleClosePlayer = () => {
    setSelectedVideo(null);
  };

  const getYouTubeEmbedUrl = (videoId, startTime = 0) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&start=${startTime}&rel=0`;
  };

  const getYouTubeUrl = (videoId, startTime = 0) => {
    return startTime > 0
      ? `https://www.youtube.com/watch?v=${videoId}&t=${startTime}s`
      : `https://www.youtube.com/watch?v=${videoId}`;
  };

  const getYouTubeThumbnail = (videoId) => {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  };

  return (
    <div className="combos-page">
      {/* Header */}
      <header className="combos-header">
        <button onClick={() => navigate(-1)} className="combos-back-btn">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="combos-title">{t('videos.title')}</h1>
        <div className="w-10" />
      </header>

      <div className="combos-content">
        <p className="combos-subtitle">{t('videos.selectCategory')}</p>

        <div className="combos-grid">
          {comboTypes.map((combo) => (
            <button
              key={combo.id}
              onClick={() => handleComboClick(combo.id)}
              className={`combo-card ${combo.videoCount === 0 ? 'combo-card--disabled' : ''}`}
              style={{ '--combo-color': combo.color }}
              disabled={combo.videoCount === 0}
            >
              <div className="combo-icon">
                {combo.icon}
              </div>
              <div className="combo-info">
                <h3 className="combo-title">{t(combo.titleKey)}</h3>
                <p className="combo-description">{t(combo.descKey)}</p>
                {combo.videoCount > 0 && (
                  <span className="combo-video-count">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    {combo.videoCount} {t('videos.videosCount')}
                  </span>
                )}
              </div>
              <div className="combo-arrow">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        <p className="combos-coming-soon">
          {t('videos.comingSoon')}
        </p>
      </div>

      {/* Video List Modal */}
      {selectedCategory && !selectedVideo && (
        <>
          <div className="video-modal-backdrop" onClick={handleCloseVideoList} />
          <div className="video-list-modal">
            <div className="video-list-header">
              <h3 className="video-list-title">
                {t(`videos.${selectedCategory}`)}
              </h3>
              <button className="video-list-close" onClick={handleCloseVideoList}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="video-list-content">
              {videoData[selectedCategory].map((video, index) => (
                <button
                  key={video.id}
                  className="video-list-item"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="video-thumbnail">
                    <img
                      src={getYouTubeThumbnail(video.id)}
                      alt={video.title}
                      loading="lazy"
                    />
                    <div className="video-play-overlay">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="video-info">
                    <span className="video-number">{index + 1}</span>
                    <span className="video-title">{video.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <>
          <div className="video-modal-backdrop" onClick={handleClosePlayer} />
          <div className="video-player-modal">
            <div className="video-player-header">
              <h3 className="video-player-title">{selectedVideo.title}</h3>
              <button className="video-player-close" onClick={handleClosePlayer}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="video-player-container">
              <iframe
                src={getYouTubeEmbedUrl(selectedVideo.id, selectedVideo.startTime)}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="video-player-footer">
              <a
                href={getYouTubeUrl(selectedVideo.id, selectedVideo.startTime)}
                target="_blank"
                rel="noopener noreferrer"
                className="video-youtube-link"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                {t('videos.openInYouTube')}
              </a>
              <button className="video-close-btn" onClick={handleClosePlayer}>
                {t('videos.close')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CombosPage;
