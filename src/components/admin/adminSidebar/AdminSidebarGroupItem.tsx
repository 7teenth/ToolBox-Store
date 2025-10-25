import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import {
  ChevronRight,
  LucideIcon
} from "lucide-react";
import Link from "next/link";

export interface IAdminSidebarGroupItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: IAdminSidebarGroupItem[];
}

export const AdminSidebarGroupItem = ({ item }: { item: IAdminSidebarGroupItem }) => {
  return (
    <Collapsible
      key={item.title}
      asChild
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <Link href={item.url}>
            <SidebarMenuButton tooltip={item.title}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              {item.items && <ChevronRight className="w-4 ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />}
            </SidebarMenuButton>
          </Link>
        </CollapsibleTrigger>
        {
          item.items && (
            <CollapsibleContent asChild>
              <SidebarMenuSub>
                {item.items.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <Link href={subItem.url}>
                      <SidebarMenuSubButton asChild>
                        <span>{subItem.title}</span>
                      </SidebarMenuSubButton>
                    </Link>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          )
        }
      </SidebarMenuItem>
    </Collapsible>
  );
}