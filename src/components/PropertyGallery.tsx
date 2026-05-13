"use client";

import Image from "next/image";
import { useState } from "react";
import { PropertyImageLightbox } from "@/components/PropertyImageLightbox";
import { buildPropertyImageAlt } from "@/lib/seo";
import type { Property } from "@/types/property";

type PropertyGalleryProps = {
  property: Property;
};

export function PropertyGallery({ property }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const imageAlt = buildPropertyImageAlt(property);
  const images = property.images.length > 0 ? property.images : [property.mainImage];
  const selectedImage = images[selectedIndex] || images[0];

  function openLightbox(index: number) {
    setSelectedIndex(index);
    setLightboxOpen(true);
  }

  return (
    <div className="grid gap-4">
      <button
        type="button"
        onClick={() => openLightbox(selectedIndex)}
        className="relative aspect-square overflow-hidden rounded-lg bg-[#f1f5ef] outline-none ring-brand transition focus-visible:ring-2"
        aria-label="Abrir galería de imágenes"
      >
        <Image
          src={selectedImage}
          alt={imageAlt}
          fill
          unoptimized
          className="object-contain"
          priority
          sizes="(min-width: 1024px) 900px, 100vw"
        />
      </button>

      {images.length > 1 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {images.map((image, index) => (
            <button
              type="button"
              key={`${image}-${index}`}
              onClick={() => openLightbox(index)}
              className={`relative aspect-square overflow-hidden rounded-md border bg-[#f1f5ef] outline-none ring-brand transition focus-visible:ring-2 ${
                index === selectedIndex ? "border-brand" : "border-black/5"
              }`}
              aria-label={`Abrir imagen ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${imageAlt} - imagen ${index + 1}`}
                fill
                unoptimized
                className="object-contain"
                sizes="160px"
              />
            </button>
          ))}
        </div>
      ) : null}

      <PropertyImageLightbox
        images={images}
        altText={imageAlt}
        currentIndex={selectedIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onSelect={setSelectedIndex}
      />
    </div>
  );
}
