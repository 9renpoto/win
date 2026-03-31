import IconMenu2 from "@/components/icons/Menu.tsx";
import IconX from "@/components/icons/X.tsx";
import { useState } from "preact/hooks";
import type { ComponentChildren } from "preact";

export default function HamburgerButton({
  children,
}: {
  children: ComponentChildren;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div class="relative md:hidden">
      <button
        type="button"
        onClick={toggleMenu}
        class="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        aria-expanded={isOpen}
        title="Open menu"
      >
        {isOpen ? <IconX /> : <IconMenu2 />}
      </button>
      {isOpen && (
        <div class="absolute right-0 top-full z-40 mt-3 min-w-48 rounded-md bg-white p-4 shadow-lg">
          <ul class="flex flex-col gap-4">{children}</ul>
        </div>
      )}
    </div>
  );
}
