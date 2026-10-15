export type SocialSharePlatform = "FACEBOOK" | "TELEGRAM";

export function socialShareUrl(
  platform: SocialSharePlatform,
  articleUrl: string,
  title: string,
) {
  const url = encodeURIComponent(articleUrl);
  return platform === "FACEBOOK"
    ? `https://www.facebook.com/sharer/sharer.php?u=${url}`
    : `https://t.me/share/url?url=${url}&text=${encodeURIComponent(title)}`;
}

export function openSocialShare(
  platform: SocialSharePlatform,
  articleUrl: string,
  title: string,
  open: (url: string) => void,
  onInitiated: (platform: SocialSharePlatform) => void,
) {
  open(socialShareUrl(platform, articleUrl, title));
  try {
    onInitiated(platform);
  } catch {
    /* Tracking cannot prevent the share action. */
  }
}

export async function copyArticleLink(
  url: string,
  writeText: (text: string) => Promise<void>,
  onCopied: () => void,
) {
  await writeText(url);
  try {
    onCopied();
  } catch {
    /* A successful copy remains successful. */
  }
}

export async function initiateNativeShare(
  data: { title: string; url: string },
  share: (data: { title: string; url: string }) => Promise<void>,
  onShared: () => void,
) {
  await share(data);
  try {
    onShared();
  } catch {
    /* A successful native share remains successful. */
  }
}
