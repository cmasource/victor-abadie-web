"use client";

import Image from "next/image";
import { useEffect } from "react";

type PropertyImageLightboxProps = {
  images: string[];
  altText: string;
  currentIndex: number;
  open: boolean;
  onClose: () => void;
  onSelect: (index: number) => void;
};

export function PropertyImageLightbox({
  images,
  altText,
  currentIndex,
  open,
  onClose,
  onSelect,
}: PropertyImageLightboxProps) {
  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentIndex];

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowLeft" && hasMultipleImages) {
        onSelect((currentIndex - 1 + images.length) % images.length);
      }
      if (event.key === "ArrowRight" && hasMultipleImages) {
        onSelect((currentIndex + 1) % images.length);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [currentIndex, hasMultipleImages, images.length, onClose, onSelect, open]);

  if (!open || !currentImage) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 px-4 py-5 text-white"
      role="dialog"
      aria-modal="true"
      aria-label="Galería de propiedad"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl font-black transition hover:bg-white/20"
        aria-label="Cerrar galería"
      >
        ×
      </button>

      <div className="mx-auto flex h-full max-w-6xl flex-col gap-4">
        <div className="flex items-center justify-center text-sm font-bold text-white/80">
          {currentIndex + 1} / {images.length}
        </div>

        <div className="relative min-h-0 flex-1">
          <Image
            src={currentImage}
            alt={`${altText} - imagen ${currentIndex + 1}`}
            fill
            unoptimized
            className="object-contain"
            sizes="100vw"
            priority
          />

          {hasMultipleImages ? (
            <>
              <button
                type="button"
                onClick={() => onSelect((currentIndex - 1 + images.length) % images.length)}
                className="absolute left-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl font-black transition hover:bg-white/20 md:left-4"
                aria-label="Imagen anterior"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => onSelect((currentIndex + 1) % images.length)}
                className="absolute right-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl font-black transition hover:bg-white/20 md:right-4"
                aria-label="Imagen siguiente"
              >
                ›
              </button>
            </>
          ) : null}
        </div>

        {images.length > 1 ? (
          <div className="mx-auto flex max-w-full gap-2 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                type="button"
                key={`${image}-${index}`}
                onClick={() => onSelect(index)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border ${
                  index === currentIndex ? "border-white" : "border-white/20"
                } bg-white/10`}
                aria-label={`Ver imagen ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${altText} miniatura ${index + 1}`}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
