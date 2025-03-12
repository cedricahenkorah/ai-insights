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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/custom/mode-toggle";

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
      <SidebarInset className="px-5 py-2">
        <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ToggleSidebar />
            <ModeToggle />
            <h1 className="text-indigo-600 font-semibold">AI Insights</h1>
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="hover:scale-110 transition-transform duration-200 w-14 h-14">
                  <AvatarImage
                    src={user.image as string}
                    alt={user.name as string}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user?.name ? user?.name.charAt(0) : "?"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mr-4" forceMount>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem disabled>API</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
