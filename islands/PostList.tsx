import { useEffect, useRef, useState } from "preact/hooks";

export interface PostItem {
  slug: string;
  title: string;
  publishedAt: string;
  snippet: string;
}

interface PostListProps {
  initialPosts: PostItem[];
  initialHasMore: boolean;
}

export default function PostList({
  initialPosts,
  initialHasMore,
}: PostListProps) {
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const pageRef = useRef(2);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);
    setLoadError(null);

    try {
      const res = await fetch(`/api/posts?page=${pageRef.current}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch page ${pageRef.current}`);
      }

      const { posts: newPosts, hasMore: nextHasMore } = await res.json();
      setPosts((prev) => [...prev, ...newPosts]);
      setHasMore(nextHasMore);
      pageRef.current++;
    } catch (_error) {
      setLoadError("Failed to load more posts");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        void loadMore();
      },
      { rootMargin: "400px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, posts.length]);

  useEffect(() => {
    if (loading || !hasMore || typeof window === "undefined") return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const rect = sentinel.getBoundingClientRect();
    if (rect.top <= globalThis.innerHeight + 400) {
      void loadMore();
    }
  }, [hasMore, loading, posts.length]);

  return (
    <div>
      {posts.map((post, i) => (
        <PostCard
          post={post}
          key={`${post.slug}-${i}`}
        />
      ))}
      <div ref={sentinelRef} class="h-1" />
      {loading && <div class="py-8 text-center text-gray-500">Loading...</div>}
      {loadError && <div class="py-4 text-center text-red-600">{loadError}
      </div>}
      {hasMore && !loading && (
        <div class="py-6 text-center">
          <button
            type="button"
            class="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:border-gray-400 hover:text-gray-900"
            onClick={() => void loadMore()}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

function PostCard({ post }: { post: PostItem }) {
  return (
    <div class="flex-grow py-8 border-t border-gray-200">
      <a class="sm:col-span-2" href={`/entry/${post.slug}`}>
        <h3 class="text-2xl text-gray-900 font-bold">{post.title}</h3>
        <time class="text-gray-500">
          {new Date(post.publishedAt).toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <div class="mt-4 text-gray-900 overflow-hidden text-ellipsis">
          {post.snippet}
        </div>
      </a>
    </div>
  );
}
