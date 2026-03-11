import { useRef, useEffect, useState } from 'react';

const ScrollPicker = ({ values, selectedValue, onChange, label }) => {
  const containerRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const itemHeight = 44;
  const visibleItems = 5;

  useEffect(() => {
    if (containerRef.current && !isScrolling) {
      const index = values.indexOf(selectedValue);
      if (index !== -1) {
        containerRef.current.scrollTop = index * itemHeight;
      }
    }
  }, [selectedValue, values, isScrolling]);

  const handleScroll = () => {
    if (!containerRef.current) return;

    setIsScrolling(true);
    const scrollTop = containerRef.current.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, values.length - 1));

    if (values[clampedIndex] !== selectedValue) {
      onChange(values[clampedIndex]);
    }
  };

  const handleScrollEnd = () => {
    if (!containerRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, values.length - 1));

    containerRef.current.scrollTo({
      top: clampedIndex * itemHeight,
      behavior: 'smooth'
    });

    setIsScrolling(false);
  };

  // Debounce scroll end
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout;
    const onScroll = () => {
      handleScroll();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollEnd, 100);
    };

    container.addEventListener('scroll', onScroll);
    return () => {
      container.removeEventListener('scroll', onScroll);
      clearTimeout(scrollTimeout);
    };
  }, [selectedValue, values]);

  return (
    <div className="scroll-picker-wrapper">
      {label && <div className="scroll-picker-label">{label}</div>}
      <div className="scroll-picker-container">
        {/* Gradient overlays */}
        <div className="scroll-picker-gradient scroll-picker-gradient--top" />
        <div className="scroll-picker-gradient scroll-picker-gradient--bottom" />

        {/* Selection highlight */}
        <div className="scroll-picker-highlight" />

        {/* Scrollable area */}
        <div
          ref={containerRef}
          className="scroll-picker-scroll"
          style={{
            height: `${itemHeight * visibleItems}px`,
            paddingTop: `${itemHeight * 2}px`,
            paddingBottom: `${itemHeight * 2}px`,
          }}
        >
          {values.map((value, index) => {
            const isSelected = value === selectedValue;
            return (
              <div
                key={index}
                className={`scroll-picker-item ${isSelected ? 'scroll-picker-item--selected' : ''}`}
                style={{ height: `${itemHeight}px` }}
                onClick={() => {
                  onChange(value);
                  if (containerRef.current) {
                    containerRef.current.scrollTo({
                      top: index * itemHeight,
                      behavior: 'smooth'
                    });
                  }
                }}
              >
                {String(value).padStart(2, '0')}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScrollPicker;
