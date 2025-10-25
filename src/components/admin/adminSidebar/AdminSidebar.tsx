import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { adminSidebarConfig } from "@/constants/adminSidebarConfig";
import { LogOut, ShieldUser } from "lucide-react";
import { AdminSidebarGroup } from "./AdminSidebarGroup";

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="px-2">
          ToolBox Admin Panel
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
        <div className="flex items-center justify-between gap-4 pl-2">
          <div className="flex-1 flex items-center gap-1">
            <ShieldUser />
            <span className="truncate font-medium">Admin</span>
          </div>
          <Button size="icon" variant="ghost"><LogOut /></Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
