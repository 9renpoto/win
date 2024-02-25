export const Bio = ({ author }: { author: string }) => (
  <div class="flex items-center">
    <img class="w-10 h-10 rounded-full mr-4" src="/profile-pic.jpg" />
    <p>
      Written by <strong>{author}</strong>{" "}
      who lives and works in Japan building useful things.
      {` `}
      <a href={`https://bsky.app/profile/9renpoto.win`}>
        You should follow him on Bluesky
      </a>
    </p>
  </div>
);
