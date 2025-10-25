import { AdminSidebarGroupItem, IAdminSidebarGroupItem } from "./AdminSidebarGroupItem";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu
} from "@/components/ui/sidebar";

interface IAdminSidebarGroup {
  title?: string;
  items: IAdminSidebarGroupItem[];
}

export const AdminSidebarGroup = ({ title, items }: IAdminSidebarGroup) => {
  return (
    <SidebarGroup>
      {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => (
          <AdminSidebarGroupItem key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}