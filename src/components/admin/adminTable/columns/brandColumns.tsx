import { AdminPopoverActions } from "@/components/admin/AdminPopoverActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Brand } from "@/lib/api/brand";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Trash } from "lucide-react";


type Params = {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDeleteBulk: (ids: string[]) => void;
}

export const getBrandColumns = ({ onEdit, onDelete, onDeleteBulk }: Params): ColumnDef<Brand>[] => ([
  {
    id: "select",
    size: 40,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image_url",
    header: "Зображення",
    size: 350,
    cell: ({ row }) => {
      const imageUrl = row.original.image_url
        ? `${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/brands/${row.original.image_url}`
        : "";

      return (
        <Avatar className="h-16 w-16 rounded-md" >
          <AvatarImage src={imageUrl} className="object-cover"/>
          <AvatarFallback className="rounded-md">{row.original.name}</AvatarFallback>
        </Avatar>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Назва",
    size: 1100,
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        <div className="text-muted-foreground">{row.original.slug}</div>
      </div>
    )
  },
  {
    accessorKey: "created_at",
    size: 300,
    header: () => <div className="">Дата створення</div>,
    cell: ({ row }) => {
      const formatDate = (value?: string | null) => {
        if (!value) return "-";
        return new Date(value).toLocaleString("uk-UA", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      };

      return (
        <div>
          <div className="font-medium">{formatDate(row.original.created_at)}</div>
          <div className="text-muted-foreground">
            Оновлено: {formatDate(row.original.updated_at)}
          </div>
        </div>
      );
    }
  },
  {
    id: "actions",
    enableHiding: false,
    size: 50,
    header: ({ table }) => {
      if (!table.getIsAllPageRowsSelected() && !table.getIsSomeRowsSelected()) return null;
      const selectedIds = Object.entries(table.getState().rowSelection)
        .filter(([_, selected]) => selected)
        .map(([id]) => id);

      return (
        <div className="justify-self-end">
          <AdminPopoverActions
            title="Дії"
            actions={[{ title: "Видалити", icon: <Trash className="h-4 w-4 text-red-600" />, onClick: () => onDeleteBulk(selectedIds) }]}
          />
        </div>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="justify-self-end">
          <AdminPopoverActions
            title="Дії"
            actions={[
              { title: "Редагувати", icon: <Pen className="h-4 w-4" />, onClick: () => onEdit(row.original.id) },
              { title: "Видалити", icon: <Trash className="h-4 w-4 text-red-600" />, onClick: () => onDelete(row.original.id) },
            ]}
          />
        </div>
      )
    },
  },
]);