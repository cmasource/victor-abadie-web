import Image from "next/image";
import { buildPropertyImageAlt } from "@/lib/seo";
import type { Property } from "@/types/property";

type PropertyGalleryProps = {
  property: Property;
};

export function PropertyGallery({ property }: PropertyGalleryProps) {
  const [mainImage, ...rest] = property.images;
  const imageAlt = buildPropertyImageAlt(property);

  return (
    <div className="grid gap-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface md:aspect-[16/9]">
        <Image
          src={mainImage}
          alt={imageAlt}
          fill
          unoptimized
          className="object-cover"
          priority
        />
      </div>
      {rest.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {property.images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="relative aspect-[4/3] overflow-hidden rounded-md border border-black/5 bg-surface"
            >
              <Image
                src={image}
                alt={`${imageAlt} - imagen ${index + 1}`}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
