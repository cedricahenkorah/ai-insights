"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { ToggleSidebar } from "@/components/sidebar/toggle-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { User } from "next-auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GetSession } from "../actions/get-session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const session = await GetSession();

      if (session?.user) {
        console.log(session?.user);
        setUser(session?.user);
      }
    }

    fetchSession();
  }, []);

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className="p-4">
        <div className="flex justify-between items-center">
          <ToggleSidebar />

          {user ? (
            <Avatar className="hover:scale-110 transition-transform duration-200 w-14 h-14">
              <AvatarImage
                src={user.image as string}
                alt={user.name as string}
              />
              <AvatarFallback className="rounded-lg">
                {user?.name ? user?.name.charAt(0) : "?"}
              </AvatarFallback>
            </Avatar>
          ) : (
            <>
              <div className="flex items-center gap-x-2">
                <Button asChild>
                  <Link href="/auth">Log in</Link>
                </Button>

                <Button asChild variant="outline">
                  <Link href="/auth">Sign up</Link>
                </Button>
              </div>
            </>
          )}
        </div>

        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
