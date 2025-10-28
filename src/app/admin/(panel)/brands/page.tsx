'use client'

import { AdminDialog } from "@/components/admin/adminPage/AdminDialog";
import { AdminPageHeader } from "@/components/admin/adminPage/AdminPageHeader";
import { AdminTable } from "@/components/admin/adminPage/AdminTable";
import { AdminTableActions } from "@/components/admin/adminPage/AdminTableActions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Brand, getBrands } from "@/lib/api/brand";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef
} from "@tanstack/react-table";
import { Eye, Pen, RefreshCcw, Trash } from "lucide-react";
import { useState } from "react";


export const columns: ColumnDef<Brand>[] = [
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
    cell: ({ row }) => (
      <div>{row.getValue("image_url")}</div>
    ),
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
    size: 200,
    header: () => <div className="">Дата створення</div>,
    cell: ({ row }) => {
      const formatDate = (value?: string | null) => {
        if (!value) return "-";
        return new Date(value).toLocaleString("uk-UA");
      }

      return (
        <div className="">
          <div className="font-medium">{formatDate(row.original.created_at)}</div>
          <div className="text-muted-foreground">Оновлено: {formatDate(row.original.updated_at)}</div>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    size: 50,
    header: ({ table }) => {
      if (!table.getIsSomeRowsSelected()) return null;

      return (
        <div className="justify-self-end">
          <AdminTableActions
            title="Дії"
            actions={[{ title: "Видалити", icon: <Trash className="h-4 w-4 text-red-600" /> }]}
          />
        </div>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="justify-self-end">
          <AdminTableActions
            title="Дії"
            actions={[
              { title: "Переглянути", icon: <Eye className="h-4 w-4" /> },
              { title: "Редагувати", icon: <Pen className="h-4 w-4" /> },
              { title: "Видалити", icon: <Trash className="h-4 w-4 text-red-600" /> },
            ]}
          />
        </div>
      )
    },
  },
]


export default function AdminBrands() {
  const [dialog, setDialog] = useState<'add' | 'edit' | null>(null);

  const { data = [], isFetching, refetch } = useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrands(),
  });

  return (
    <div className="h-full space-y-4">
      <AdminPageHeader title="Бренди" subtitle="Управління брендами товарів" />
      <div className="h-4/5 space-y-2">
        <div className="flex items-center py-4 gap-2">
          <Button size="icon" onClick={() => refetch()}><RefreshCcw /></Button>
          <Button onClick={() => setDialog('add')}>Додати бренд</Button>
        </div>
        <AdminTable data={data} columns={columns} isLoading={isFetching} />
      </div>
      <AdminDialog open={!!dialog} onOpenChange={() => setDialog(null)} title="Заголовок" description="Опис">
        text
      </AdminDialog>
    </div>
  );
}