"use client"
import { AdminSidebar } from "@/components/admin/adminSidebar/AdminSidebar";
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar";
import { ReactNode } from "react";


export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <div className="h-screen p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
