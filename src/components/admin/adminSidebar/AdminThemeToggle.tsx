'use client'

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";


export const AdminThemeToggle = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const getIcon = () => (theme === "dark" ? <Sun /> : <MoonStar />);

  if (!mounted) {
    return null;
  }

  return (
    <SidebarMenuButton className="size-8" onClick={handleToggle}>
      {getIcon()}
    </SidebarMenuButton>
  )
}
