import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "./utils";

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center z-50",
        className,
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        // ✨ iOS Glassmorphism: Размытие, полупрозрачный фон, закругления
        "group flex flex-1 list-none items-center justify-center gap-2 bg-white/5 backdrop-blur-2xl border border-white/10 p-2 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

const navigationMenuTriggerStyle = cva(
  // ✨ Стили кнопок меню: прозрачные по умолчанию, подсвечиваются при наведении
  "group inline-flex h-11 w-max items-center justify-center rounded-2xl bg-transparent px-5 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-white/15 data-[state=open]:text-white outline-none transition-all duration-300 active:scale-95",
);

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-[1px] ml-1.5 size-4 text-zinc-400 transition-transform duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:text-white"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 md:absolute md:w-auto",
        // Стили для контента (если viewport=false) - тоже стеклянные
        "group-data-[viewport=false]/navigation-menu:bg-zinc-900/60 group-data-[viewport=false]/navigation-menu:backdrop-blur-3xl group-data-[viewport=false]/navigation-menu:text-white group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-3 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-[2rem] group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:border-white/10 group-data-[viewport=false]/navigation-menu:shadow-[0_10px_40px_rgba(0,0,0,0.5)] group-data-[viewport=false]/navigation-menu:duration-300",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 isolate z-50 flex justify-center",
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          // ✨ Выпадающее меню (Viewport): Стеклянный эффект и плавная анимация
          "origin-top-center bg-zinc-900/60 backdrop-blur-3xl text-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-3 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] md:w-[var(--radix-navigation-menu-viewport-width)] transition-[width,height] duration-300",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        // ✨ Ссылки внутри выпадающего меню
        "data-[active=true]:bg-white/15 data-[active=true]:text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white text-zinc-300 flex flex-col gap-1 rounded-2xl p-3 text-sm transition-all outline-none",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-3 items-end justify-center overflow-hidden",
        className,
      )}
      {...props}
    >
      {/* Маленькая стрелочка-указатель */}
      <div className="bg-white/10 backdrop-blur-md border-t border-l border-white/10 relative top-[60%] h-3 w-3 rotate-45 rounded-tl-sm shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};