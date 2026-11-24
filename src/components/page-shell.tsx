import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background overflow-x-hidden w-full">
      <SiteHeader />
      <main className="flex-1 w-full overflow-x-hidden">{children}</main>
      <SiteFooter />
      <CartDrawer />
    </div>
  );
}
