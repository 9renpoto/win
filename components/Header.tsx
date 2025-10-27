import IconActivity from "@/components/icons/Activity.tsx";
import Campfire from "@/components/icons/Campfire.tsx";
import IconRss from "@/components/icons/Rss.tsx";
import HamburgerButton from "../islands/HamburgerButton.tsx";

export function Header({ title }: { title: string }) {
  const menus = [
    { name: <IconRss />, href: "/rss.xml" },
    { name: <IconActivity />, href: "https://9renpoto.github.io/upptime" },
    { name: <>About me</>, href: "/about" },
  ];
  return (
    <header class="w-full">
      <div class="max-w-screen-lg w-full mx-auto py-6 px-4 flex flex-row items-center gap-4">
        <div class="flex items-center flex-1">
          <Campfire />
          <a href="/">
            <div class="text-2xl ml-1 font-bold">{title}</div>
          </a>
        </div>
        <div class="hidden md:flex items-center gap-6">
          {menus.map((menu) => (
            <a
              href={menu.href}
              class="text-gray-500 hover:text-gray-700 py-1 border-gray-500"
            >
              {menu.name}
            </a>
          ))}
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
    </header>
  );
}
