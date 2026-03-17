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

export default function PostList(
  { initialPosts, initialHasMore }: PostListProps,
) {
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const hasMoreRef = useRef(initialHasMore);
  const pageRef = useRef(2);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (
          !entries[0].isIntersecting ||
          loadingRef.current ||
          !hasMoreRef.current
        ) return;

        loadingRef.current = true;
        setLoading(true);
        try {
          const res = await fetch(`/api/posts?page=${pageRef.current}`);
          if (res.ok) {
            const { posts: newPosts, hasMore } = await res.json();
            setPosts((prev) => [...prev, ...newPosts]);
            hasMoreRef.current = hasMore;
            pageRef.current++;
          }
        } finally {
          loadingRef.current = false;
          setLoading(false);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {posts.map((post, i) => (
        <PostCard post={post} key={`${post.slug}-${i}`} />
      ))}
      <div ref={sentinelRef} />
      {loading && (
        <div class="py-8 text-center text-gray-500">Loading...</div>
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
