import Campfire from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/campfire.tsx";

export function Header({ title }: { title: string }) {
  return (
    <div class="bg-white w-full max-w-screen-lg py-6 px-8 flex flex-col md:flex-row gap-4">
      <div class="flex items-center flex-1">
        <Campfire />
        <a href="/">
          <div class="text-2xl ml-1 font-bold">
            {title}
          </div>
        </a>
      </div>
    </div>
  );
}
