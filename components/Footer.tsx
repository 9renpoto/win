import Campfire from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/campfire.tsx";
import BrandGithub from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/brand-github.tsx";

export function Footer() {
  const menus = [
    {
      title: "Links",
      children: [
        { name: "Upptime", href: "https://9renpoto.github.io/upptime/" },
      ],
    },
  ];

  return (
    <footer class="flex flex-col md:flex-row w-full gap-8 md:gap-16 px-8 py-8 text-sm">
      <div class="flex-1">
        <div class="flex items-center gap-1">
          <Campfire class="inline-block" />
          <div class="font-bold text-2xl">
            Keisuke Umeno
          </div>
        </div>
        <div class="text-gray-500">
          Lazy builder
        </div>
      </div>

      {menus.map((item) => (
        <div class="mb-4" key={item.title}>
          <div class="font-bold">{item.title}</div>
          <ul class="mt-2">
            {item.children.map((child) => (
              <li class="mt-2" key={child.name}>
                <a
                  class="text-gray-500 hover:text-gray-700"
                  href={child.href}
                >
                  {child.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div class="text-gray-500 space-y-2">
        <div class="text-xs">
          Copyright © {new Date().getFullYear()} github.com/9renpoto<br />
          All right reserved.
        </div>

        <a
          href="https://github.com/9renpoto/poem"
          class="inline-block hover:text-black"
        >
          <BrandGithub />
        </a>
      </div>
    </footer>
  );
}
