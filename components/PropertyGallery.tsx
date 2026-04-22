"use client";
import Image from "next/image";
import { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";

interface PropertyGalleryProps {
  images: { id: string; url: string; isPrimary: boolean }[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    setSelected((s) => (s === 0 ? images.length - 1 : s - 1));
  }, [emblaApi, images.length]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    setSelected((s) => (s === images.length - 1 ? 0 : s + 1));
  }, [emblaApi, images.length]);

  const goTo = useCallback(
    (i: number) => {
      emblaApi?.scrollTo(i);
      setSelected(i);
    },
    [emblaApi]
  );

  if (images.length === 0) {
    return (
      <div className="h-72 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
        No images available
      </div>
    );
  }

  return (
    <>
      {/* Main carousel */}
      <div className="relative rounded-2xl overflow-hidden group">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images.map((img, i) => (
              <div key={img.id} className="flex-shrink-0 w-full relative h-72 md:h-96">
                <Image
                  src={img.url}
                  alt={`${title} - Image ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Counter badge */}
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
          {selected + 1} / {images.length}
        </div>

        {/* Fullscreen button */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute bottom-3 right-3 h-9 w-9 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
          aria-label="Fullscreen"
        >
          <Expand className="h-4 w-4" />
        </button>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => goTo(i)}
              className={`relative flex-shrink-0 h-16 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                i === selected
                  ? "border-orange-500 shadow-md"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close fullscreen"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative w-full max-w-5xl aspect-[16/10]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selected].url}
              alt={`${title} - Full view`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected((s) => (s === 0 ? images.length - 1 : s - 1));
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected((s) => (s === images.length - 1 ? 0 : s + 1));
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
            {selected + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
