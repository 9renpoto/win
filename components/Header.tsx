import IconActivity from "@/components/icons/Activity.tsx";
import Campfire from "@/components/icons/Campfire.tsx";
import IconRss from "@/components/icons/Rss.tsx";
import AlgoliaSearch from "@/islands/AlgoliaSearch.tsx";
import HamburgerButton from "../islands/HamburgerButton.tsx";

interface HeaderProps {
  title: string;
  algoliaAppId?: string;
  algoliaSearchApiKey?: string;
  algoliaIndexName?: string;
}

export function Header({
  title,
  algoliaAppId,
  algoliaSearchApiKey,
  algoliaIndexName,
}: HeaderProps) {
  const menus = [
    { name: <IconRss />, href: "/rss.xml" },
    { name: <IconActivity />, href: "https://9renpoto.github.io/upptime" },
    { name: <>About me</>, href: "/about" },
  ];
  return (
    <header class="w-full">
      <div class="max-w-screen-lg w-full mx-auto py-6 px-4 flex flex-row flex-wrap items-center gap-4 md:gap-6">
        <div class="flex w-full items-center justify-between gap-4 md:w-auto md:flex-1">
          <div class="flex min-w-0 items-center">
            <Campfire />
            <a href="/" class="min-w-0">
              <div class="text-2xl ml-1 font-bold break-words">{title}</div>
            </a>
          </div>
          <HamburgerButton>
            {menus.map((menu) => (
              <li>
                <a
                  href={menu.href}
                  class="text-gray-500 hover:text-gray-700 py-1 border-gray-500"
                >
                  {menu.name}
                </a>
              </li>
            ))}
          </HamburgerButton>
        </div>
        <div class="order-3 w-full md:order-none md:max-w-sm md:flex-none">
          <AlgoliaSearch
            appId={algoliaAppId}
            apiKey={algoliaSearchApiKey}
            indexName={algoliaIndexName}
            placeholder="Search posts"
          />
        </div>
        <div class="hidden md:ml-auto md:flex items-center gap-6">
          {menus.map((menu) => (
            <a
              href={menu.href}
              class="text-gray-500 hover:text-gray-700 py-1 border-gray-500"
            >
              {menu.name}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
