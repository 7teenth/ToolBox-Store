'use client'

import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTable } from "@/components/admin/adminTable/AdminTable";
import { getBrandColumns } from "@/components/admin/adminTable/columns/brandColumns";
import { BrandAddEditForm } from "@/components/admin/BrandAddEditForm";
import { Button } from "@/components/ui/button";
import useConfirm from "@/hooks/use-confirm";
import { Brand, BrandCreate, deleteBrand, deleteBrandBulk, getBrands } from "@/lib/api/brand";
import { Pagination } from "@/lib/types";
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

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 7 });
  const [rowSelection, setRowSelection] = useState({})

  const { data: brands, isFetching, refetch } = useQuery<Pagination<Brand>>({
    queryKey: ["brands", pagination],
    queryFn: () => getBrands(pagination)
  });

  const handleCompleteForm = () => {
    setDialog(null);
    refetch();
  }

  const handleEdit = (id: string) => {
    const selected = brands?.data.find((brand) => brand.id === id);
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

  const handleDeleteBulk = async (ids: string[]) => {
    try {
      if (ids.length === 0) return;

      const brandNames = brands?.data
        .filter((brand) => ids.includes(brand.id))
        .map((brand) => brand.name)
        .join(', ');

      const confirm = await confirmDelete({
        title: 'Видалення брендів',
        description: `Ви впевнені, що хочете видалити ці бренди?`,
      });
      if (!confirm) return;

      const response = await deleteBrandBulk(ids);
      if (response) {
        toast.success('Бренди успішно видалено');
        setRowSelection({});
        refetch();
      }

    } catch (error) {
      console.log(error);
      toast.error('Помилка видалення брендів');
    }
  }

  const columns = getBrandColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onDeleteBulk: handleDeleteBulk
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
          data={brands?.data || []}
          columns={columns}
          isLoading={isFetching}
          pageCount={brands?.totalPages || 0}
          pagination={pagination}
          setPagination={setPagination}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
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