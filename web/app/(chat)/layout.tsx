import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { ToggleSidebar } from "@/components/sidebar/toggle-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Link from "next/link";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className="p-4">
        <div className="flex justify-between items-center">
          <ToggleSidebar />

          <div className="flex items-center gap-x-2">
            <Button asChild>
              <Link href="/auth">Log in</Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/auth">Sign up</Link>
            </Button>
          </div>
        </div>

        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
