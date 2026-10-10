<script lang="ts">
  import { page } from "$app/state";

  let { measurementId }: { measurementId: string } = $props();
  let configuredId = "";
  $effect(() => {
    if (!measurementId) return;
    const pagePath = page.url.pathname + page.url.search;
    const target = window as Window & {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };
    target.dataLayer ??= [];
    target.gtag ??= (...args: unknown[]) => {
      target.dataLayer?.push(args);
    };
    if (configuredId !== measurementId) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.append(script);
      target.gtag("js", new Date());
      target.gtag("config", measurementId, { send_page_view: false });
      configuredId = measurementId;
    }
    target.gtag("event", "page_view", {
      page_path: pagePath,
      page_location: page.url.href,
      send_to: measurementId,
    });
  });
</script>
