"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type SyntheticEvent,
} from "react";

type ZoomableImageProps = ComponentPropsWithoutRef<"img"> & {
  src: string;
};

export function ZoomableImage({ src, alt = "", onLoad, ...props }: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const updateOrientation = (image: HTMLImageElement) => {
    setIsPortrait(image.naturalHeight > image.naturalWidth * 1.1);
  };

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    updateOrientation(event.currentTarget);
    onLoad?.(event);
  };

  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete) updateOrientation(image);
  }, [src]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <>
      <button
        className={`zoomable-image-trigger${isPortrait ? " is-portrait" : ""}`}
        type="button"
        aria-label={`${alt || "사진"} 크게 보기`}
        onClick={() => setIsOpen(true)}
      >
        <img ref={imageRef} src={src} alt={alt} onLoad={handleLoad} {...props} />
        <span aria-hidden="true">크게 보기</span>
      </button>
      {isOpen && (
        <div
          className="image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${alt || "사진"} 확대 보기`}
          onClick={() => setIsOpen(false)}
        >
          <button
            className="image-lightbox-close"
            type="button"
            aria-label="확대 사진 닫기"
            onClick={() => setIsOpen(false)}
          >
            닫기 ×
          </button>
          <img src={src} alt={alt} onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </>
  );
}

export function MarkdownImage({ src, alt, ...props }: ComponentPropsWithoutRef<"img">) {
  return typeof src === "string" ? (
    <ZoomableImage src={src} alt={alt ?? ""} {...props} />
  ) : null;
}
