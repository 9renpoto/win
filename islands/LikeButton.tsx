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
    <button
      onClick={handleClick}
      class={`px-4 py-2 font-bold text-white rounded ${
        isLiked
          ? "bg-red-500 hover:bg-red-700"
          : "bg-blue-500 hover:bg-blue-700"
      }`}
    >
      👍 {likeCount} Likes
    </button>
  );
}
