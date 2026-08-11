import React, { useCallback, useEffect } from "react";

interface LightboxImage {
  _id?: string;
  id?: string;
  signedUrl: string;
  originalName?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  activeIndex: number;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export const PastEventLightbox: React.FC<LightboxProps> = ({
  images,
  activeIndex,
  onClose,
  onSelectIndex,
}) => {
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === images.length - 1;

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!isFirst) onSelectIndex(activeIndex - 1);
    },
    [activeIndex, isFirst, onSelectIndex]
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!isLast) onSelectIndex(activeIndex + 1);
    },
    [activeIndex, isLast, onSelectIndex]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlePrev, handleNext, onClose]);

  if (!images || images.length === 0) return null;

  return (
    <div className="past-event-lightbox" onClick={onClose}>
      <div
        className="past-event-lightbox-backdrop"
        role="button"
        tabIndex={-1}
        aria-label="Close lightbox"
      />

      {!isFirst && (
        <button
          type="button"
          className="past-event-lightbox-nav past-event-lightbox-nav--left"
          onClick={handlePrev}
          aria-label="Previous image"
        >
          &#8249;
        </button>
      )}

      {!isLast && (
        <button
          type="button"
          className="past-event-lightbox-nav past-event-lightbox-nav--right"
          onClick={handleNext}
          aria-label="Next image"
        >
          &#8250;
        </button>
      )}

      <div className="past-event-lightbox-stage">
        <div className="past-event-lightbox-viewport">
          <div
            className="past-event-lightbox-track"
            style={{
              transform: `translateX(calc(50vw - ((var(--lightbox-slide-width) + var(--lightbox-gap)) / 2) - (${activeIndex} * (var(--lightbox-slide-width) + var(--lightbox-gap)))))`,
            }}
          >
            {images.map((img, index) => {
              const isActive = index === activeIndex;

              return (
                <div
                  key={img._id || img.id || index}
                  className={`past-event-lightbox-slide ${
                    isActive ? "past-event-lightbox-slide--active" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isActive) {
                      onSelectIndex(index);
                    }
                  }}
                >
                  <div className="past-event-lightbox-frame">
                    <img
                      src={img.signedUrl}
                      alt={img.originalName || `Event photo ${index + 1}`}
                      className="past-event-lightbox-image"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
