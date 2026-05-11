import Image from "next/image";

type PropertyGalleryProps = {
  title: string;
  images: string[];
};

export function PropertyGallery({ title, images }: PropertyGalleryProps) {
  const [mainImage, ...rest] = images;

  return (
    <div className="grid gap-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface md:aspect-[16/9]">
        <Image
          src={mainImage}
          alt={title}
          fill
          unoptimized
          className="object-cover"
          priority
        />
      </div>
      {rest.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="relative aspect-[4/3] overflow-hidden rounded-md border border-black/5 bg-surface"
            >
              <Image
                src={image}
                alt={`${title} imagen ${index + 1}`}
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
