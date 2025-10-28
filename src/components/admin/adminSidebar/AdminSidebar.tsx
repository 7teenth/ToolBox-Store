'use client';

import { AdminThemeToggle } from "@/components/admin/adminSidebar/AdminThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { adminSidebarConfig } from "@/constants/adminSidebarConfig";
import { LogOut, ShieldUser } from "lucide-react";
import { AdminSidebarGroup } from "./AdminSidebarGroup";

export function AdminSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex justify-center items-center gap-2">
          <SidebarTrigger variant="outline" />
          {
            open && (
              <div className="font-medium flex-1">
                ToolBox
              </div>
            )
          }
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {
          adminSidebarConfig.map((group) => (
            <AdminSidebarGroup
              key={group.title}
              title={group.title}
              items={group.items}
            />
          ))
        }
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex-1 flex justify-center items-center gap-2">
            <ShieldUser/>
            {
              open && (
                <div className="w-full font-medium">
                  Admin
                </div>
              )
            }
          </div>
          <div className="flex flex-wrap flex-grow-0 items-center gap-0.5">
            <AdminThemeToggle />
            <SidebarMenuButton className="size-8"><LogOut/></SidebarMenuButton>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
