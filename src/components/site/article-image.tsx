import Image from "next/image";

/** Shared article cropping and missing-image treatment; the parent defines the ratio. */
export function ArticleImage({ src, sizes, preload = false }: {
  src?: string | null;
  sizes: string;
  preload?: boolean;
}) {
  return src ? (
    <Image src={src} alt="" fill unoptimized preload={preload} sizes={sizes}
      className="object-cover object-center" />
  ) : <span className="story-card-placeholder absolute inset-0" />;
}
