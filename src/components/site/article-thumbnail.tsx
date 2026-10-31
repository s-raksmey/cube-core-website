import { ArticleImage } from "@/components/site/article-image";

export function ArticleThumbnail({ src, className = "" }: {
  src?: string | null;
  className?: string;
}) {
  return (
    <div className={`article-thumbnail relative aspect-video shrink-0 overflow-hidden rounded-none bg-muted ${className}`}>
      <ArticleImage src={src} sizes="(max-width: 767px) 32vw, (max-width: 1023px) 14vw, (max-width: 1720px) 11vw, 180px" />
    </div>
  );
}
