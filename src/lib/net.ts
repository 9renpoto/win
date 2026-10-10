export function getDomainUrl(request: Request) {
  const headers = request.headers;
  const forwardedHost = headers.get("X-Forwarded-Host")?.split(",")[0]?.trim();
  const forwardedProto = headers
    .get("X-Forwarded-Proto")
    ?.split(",")[0]
    ?.trim();
  if (forwardedHost) {
    const protocol =
      forwardedProto ?? (isLoopback(forwardedHost) ? "http" : "https");
    return `${protocol}://${forwardedHost}`;
  }

  const host = headers.get("host")?.split(",")[0]?.trim();
  if (host) {
    const protocol = forwardedProto ?? (isLoopback(host) ? "http" : "https");
    return `${protocol}://${host}`;
  }

  const url = new URL(request.url);
  if (url.origin && url.origin !== "null") {
    return url.origin;
  }

  throw new Error("Could not determine domain URL.");
}

function isLoopback(host: string): boolean {
  return /^(localhost(?::|$)|127\.|\[::1\])/.test(host);
}
