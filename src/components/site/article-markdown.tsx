import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

export function ArticleMarkdown({ content }: { content: string }) {
  return <div className="article-prose">
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]} components={{
      a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
      img: ({ alt, src }) => typeof src === "string" ? <Image src={src} alt={alt ?? ""} width={900} height={600} unoptimized className="h-auto max-w-full rounded-lg" /> : null,
    }}>{content}</ReactMarkdown>
  </div>;
}
