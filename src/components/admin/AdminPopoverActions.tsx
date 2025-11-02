import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface AdminPopoverActionsProps {
  title?: string
  actions?: { title: string, icon: React.ReactNode, onClick?: () => void }[]
  trigger?: React.ReactNode
}


export const AdminPopoverActions = ({ title, actions = [], trigger }: AdminPopoverActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {
          trigger || (
            <Button variant="secondary" className="h-8 w-8 p-0 ">
              <MoreHorizontal />
            </Button>
          )
        }
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {title && <DropdownMenuLabel>{title}</DropdownMenuLabel>}
        {
          actions.map((action) => (
            <DropdownMenuItem
              key={action.title}
              onClick={action.onClick}
            >
              {action.icon}{action.title}
            </DropdownMenuItem>
          )
          )
        }
      </DropdownMenuContent>
    </DropdownMenu>
  );
};