import { useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/experience-gallery.css";

interface ExperienceGalleryProps {
  images: string[];
  fallback: string;
  alt: string;
}

const ExperienceGallery = ({ images, fallback, alt }: ExperienceGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const allImages = images.length > 0 ? images : [fallback];

  const goTo = useCallback((index: number) => {
    if (isTransitioning || allImages.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, allImages.length]);

  const prev = useCallback(() => {
    goTo((currentIndex - 1 + allImages.length) % allImages.length);
  }, [currentIndex, allImages.length, goTo]);

  const next = useCallback(() => {
    goTo((currentIndex + 1) % allImages.length);
  }, [currentIndex, allImages.length, goTo]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = fallback;
  };

  return (
    <div
      className="exp-gallery"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={`exp-gallery__img-wrap ${isTransitioning ? "transitioning" : ""}`}>
        <img
          key={currentIndex}
          src={allImages[currentIndex]}
          alt={`${alt} — image ${currentIndex + 1}`}
          className="exp-gallery__img"
          onError={handleError}
          loading="lazy"
        />
      </div>

      {allImages.length > 1 && (
        <>
          <button
            className="exp-gallery__nav exp-gallery__nav--prev"
            onClick={prev}
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="exp-gallery__nav exp-gallery__nav--next"
            onClick={next}
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>

          <div className="exp-gallery__dots">
            {allImages.map((_, i) => (
              <button
                key={i}
                className={`exp-gallery__dot ${i === currentIndex ? "active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ExperienceGallery;
