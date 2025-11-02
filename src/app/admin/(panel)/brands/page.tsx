'use client'

import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTable } from "@/components/admin/adminTable/AdminTable";
import { getBrandColumns } from "@/components/admin/adminTable/columns/brandColumns";
import { BrandAddEditForm } from "@/components/admin/BrandAddEditForm";
import { Button } from "@/components/ui/button";
import useConfirm from "@/hooks/use-confirm";
import { BrandCreate, deleteBrand, getBrands } from "@/lib/api/brand";
import { useQuery } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


export default function AdminBrands() {
  const [ConfirmationDialog, confirmDelete] = useConfirm({
    Dialog: AdminConfirmDialog,
    title: 'Видалення бренду',
    description: 'Ви впевнені, що хочете видалити бренд?',
  })

  const [dialog, setDialog] = useState<'add' | 'edit' | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<BrandCreate | null>(null);

  const { data = [], isFetching, refetch } = useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrands(),
  });

  const handleCompleteForm = () => {
    setDialog(null);
    refetch();
  }

  const handleEdit = (id: string) => {
    const selected = data.find((brand) => brand.id === id);
    if (selected) {
      setDialog('edit');
      setSelectedBrand(selected);
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const confirm = await confirmDelete();
      if (!confirm) return;

      const response = await deleteBrand(id);
      if (response) {
        toast.success('Бренд успішно видалено');
        refetch();
      }

    } catch (error) {
      console.log(error);
      toast.error('Помилка видалення бренду');
    }
  }

  const columns = getBrandColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onDeleteBulk: (ids) => { }
  });

  return (
    <div className="h-full space-y-4">
      <AdminPageHeader title="Бренди" subtitle="Управління брендами товарів" />
      <div className="h-4/5 space-y-2">
        <div className="flex items-center py-4 gap-2">
          <Button size="icon" onClick={() => refetch()}><RefreshCcw /></Button>
          <Button onClick={() => setDialog('add')}>Додати бренд</Button>
        </div>
        <AdminTable
          data={data}
          columns={columns}
          isLoading={isFetching}
        />
      </div>
      <AdminDialog
        open={!!dialog}
        onOpenChange={() => setDialog(null)}
        title={`${dialog === 'add' ? 'Додати' : 'Редагувати'} бренд`}
        className="max-w-xl"
      >
        <BrandAddEditForm type={dialog} selectedBrand={selectedBrand} onComplete={handleCompleteForm} onCancel={() => setDialog(null)} />
      </AdminDialog>
      <ConfirmationDialog />
    </div>
  );
}