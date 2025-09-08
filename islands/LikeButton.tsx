import { useEffect, useState } from "preact/hooks";
import { useSignal } from "@preact/signals";

interface LikeButtonProps {
  slug: string;
}

export default function LikeButton({ slug }: LikeButtonProps) {
  const likeCount = useSignal(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      const res = await fetch(`/api/likes?slug=${slug}`);
      if (res.ok) {
        const { count } = await res.json();
        likeCount.value = count;
      }
    };
    fetchLikes();

    const likedInStorage = localStorage.getItem(`liked-${slug}`);
    if (likedInStorage === "true") {
      setIsLiked(true);
    }
  }, [slug]);

  const handleClick = async () => {
    const action = isLiked ? "unlike" : "like";
    const res = await fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, action }),
    });

    if (res.ok) {
      if (action === "like") {
        likeCount.value++;
        setIsLiked(true);
        localStorage.setItem(`liked-${slug}`, "true");
      } else {
        likeCount.value--;
        setIsLiked(false);
        localStorage.setItem(`liked-${slug}`, "false");
      }
    }
  };

  return (
    <div class="flex flex-col items-center">
      <button
        onClick={handleClick}
        class={`flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200 ${
          isLiked
            ? "bg-red-100 text-red-500"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        }`}
        aria-label="Like this post"
      >
        <svg
          class="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clip-rule="evenodd"
          >
          </path>
        </svg>
      </button>
      <span class="mt-2 text-sm text-gray-500">{likeCount}</span>
    </div>
  );
}
