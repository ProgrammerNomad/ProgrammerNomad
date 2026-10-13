"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { X, ArrowLeft, ArrowRight, Expand } from "lucide-react";

export type GalleryPhoto = { src: string; alt: string; caption?: string };
export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  if (!photos.length) return null;
  const photo = photos[selected];
  const step = (delta: number) =>
    setSelected((index) => (index + delta + photos.length) % photos.length);
  return (
    <>
      <div className="photo-gallery">
        {photos.map((item, index) => (
          <figure key={item.src}>
            <button
              type="button"
              className="gallery-photo"
              aria-label={`Enlarge ${item.alt}`}
              onClick={(e) => {
                opener.current = e.currentTarget;
                setSelected(index);
                dialog.current?.showModal();
              }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={1200}
                height={900}
                sizes="(max-width:700px) 100vw, 600px"
              />
              <span aria-hidden="true">
                <Expand size={18} />
              </span>
            </button>
            <figcaption>
              <span className="atlas-meta">
                {String(index + 1).padStart(2, "0")} /{" "}
              </span>
              {item.caption ?? item.alt}
            </figcaption>
          </figure>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="gallery-dialog"
        aria-label="Photo viewer"
        onClose={() => opener.current?.focus()}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            step(1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            step(-1);
          }
        }}
      >
        <div className="gallery-lightbox">
          <div className="flex justify-between items-center gap-4">
            <p className="atlas-meta" role="status">
              {selected + 1} / {photos.length}
            </p>
            <button
              type="button"
              className="icon-action"
              aria-label="Close photo viewer"
              onClick={() => dialog.current?.close()}
            >
              <X />
            </button>
          </div>
          <Image
            src={photo.src}
            alt={photo.alt}
            width={1600}
            height={1200}
            sizes="95vw"
            className="lightbox-image"
          />
          <div className="flex items-center gap-4 justify-between">
            <button
              type="button"
              className="icon-action"
              aria-label="Previous photograph"
              onClick={() => step(-1)}
            >
              <ArrowLeft />
            </button>
            <p className="text-center text-sm text-paper/80" aria-live="polite">
              {photo.caption ?? photo.alt}
            </p>
            <button
              type="button"
              className="icon-action"
              aria-label="Next photograph"
              onClick={() => step(1)}
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
