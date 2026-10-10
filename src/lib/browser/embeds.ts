export function resizeSocialEmbed(event: MessageEvent): void {
  const data: unknown = event.data;
  if (event.origin === "https://embed.bsky.app") {
    if (
      !data ||
      typeof data !== "object" ||
      !("id" in data) ||
      !("height" in data)
    )
      return;
    if (
      typeof data.id !== "string" ||
      typeof data.height !== "number" ||
      !Number.isFinite(data.height) ||
      data.height <= 0
    )
      return;
    for (const frame of document.querySelectorAll<HTMLIFrameElement>(
      "iframe[data-bsky-id]",
    )) {
      if (
        frame.dataset.bskyId === data.id &&
        frame.contentWindow === event.source
      ) {
        frame.style.height = `${data.height}px`;
        break;
      }
    }
    return;
  }
  if (
    ![
      "https://platform.twitter.com",
      "https://syndication.twitter.com",
    ].includes(event.origin)
  )
    return;
  let message = data;
  if (typeof message === "string") {
    try {
      message = JSON.parse(message);
    } catch {
      return;
    }
  }
  if (!message || typeof message !== "object" || !("height" in message)) return;
  const height = message.height;
  if (
    typeof height !== "number" ||
    !Number.isFinite(height) ||
    height <= 0 ||
    !event.source
  )
    return;
  for (const frame of document.querySelectorAll<HTMLIFrameElement>(
    "iframe.x-embed-frame",
  )) {
    if (frame.contentWindow === event.source) {
      frame.style.height = `${Math.max(360, Math.ceil(height) + 16)}px`;
      break;
    }
  }
}

export function refreshInstagramEmbeds(): void {
  if (!document.querySelector(".instagram-media")) return;
  const instagram = (
    window as Window & { instgrm?: { Embeds: { process(): void } } }
  ).instgrm;
  if (instagram) {
    instagram.Embeds.process();
    return;
  }
  if (document.querySelector("script[data-instagram-loader]")) return;
  const script = document.createElement("script");
  script.src = "https://www.instagram.com/embed.js";
  script.async = true;
  script.dataset.instagramLoader = "true";
  script.onload = () => refreshInstagramEmbeds();
  script.onerror = () => script.remove();
  document.head.append(script);
}
