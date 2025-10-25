"use client"
import { AdminSidebar } from "@/components/admin/adminSidebar/AdminSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { adminSidebarConfig } from "@/constants/adminSidebarConfig";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";


export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentPathTitle = useMemo(() => {
    return adminSidebarConfig
      .flatMap((group) => group.items)
      .find((item) => item.url === pathname)?.title
  }, [pathname])

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger variant="outline" className="-ml-1" />
            <div className="text-lg ">{currentPathTitle}</div>
          </div>
        </header>
        <div className="p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
