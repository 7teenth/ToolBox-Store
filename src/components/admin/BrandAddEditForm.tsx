import { UploadedImage, UploadImage } from "@/components/admin/UploadImage";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandCreate, createBrand, updateBrand } from "@/lib/api/brand";
import { Buckets, uploadFile } from "@/lib/supabase/bucket";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";
import * as yup from "yup";

type BrandFormData = Omit<BrandCreate, "id" | "created_at" | "updated_at" | "image_url">

const schema = yup.object().shape({
  name: yup.string().required("Назва обов'язкова"),
  slug: yup.string().required("Slug обов'язковий")
})

interface BrandAddEditFormProps {
  type: "add" | "edit" | null;
  selectedBrand?: BrandCreate | null;
  onComplete: () => void;
  onCancel?: () => void;
}

export const BrandAddEditForm = ({ type, selectedBrand, onComplete, onCancel }: BrandAddEditFormProps) => {
  const isEdit = type === "edit";

  const form = useForm<BrandFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: selectedBrand?.name || "",
      slug: selectedBrand?.slug || ""
    }
  });

  const defaultImages = selectedBrand?.image_url
    ? [{
      id: selectedBrand.image_url,
      url: `${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/brands/${selectedBrand.image_url}`,
    }]
    : [];

  const [images, setImages] = useState<UploadedImage[]>(defaultImages);

  const uploadImages = async (images: UploadedImage[]) => {

    if (images.length === 0 || images.every((image) => !image.file)) return;

    const promises = images.map(async (image) => {
      if (!image.file) return;

      return uploadFile(Buckets.brands, image.file);
    })

    toast.promise(Promise.all(promises), {
      loading: 'Завантаження зображення',
      success: 'Зображення завантажено',
      error: 'Помилка завантаження зображення'
    })

    return Promise.all(promises);
  }

  const handleFormSubmit = async (data: BrandFormData) => {
    try {
      let imageUrl = isEdit ? selectedBrand?.image_url : null;

      if (images.length > 0) {
        const uploadResponse = await uploadImages(images);
        if (uploadResponse) {
          imageUrl = uploadResponse[0]?.path;
        }
      }

      const request = isEdit
        ? updateBrand(selectedBrand?.id!, { ...data, image_url: imageUrl })
        : createBrand({ ...data, image_url: imageUrl });

      const response = await request;

      if (!response) throw new Error('Request failed');

      toast.success(isEdit ? 'Бренд успішно змінено' : 'Бренд успішно створено');
      form.reset();
      setImages([]);
      onComplete();

    } catch (error) {
      console.error(error);
      toast.error(isEdit ? 'Помилка редагування бренду' : 'Помилка створення бренду');
    }
  };


  const handleFormCancel = async () => {
    form.reset();
    setImages([]);
    onCancel?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Назва</FormLabel>
              <FormControl>
                <Input
                  placeholder="Назва"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    form.setValue("slug", slugify(e.target.value, { lower: true }))
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="Slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Label>Зображення</Label>
        <UploadImage images={images} onChange={setImages} maxImages={1} />

        <div className="flex justify-end gap-2">
          <Button type="button" onClick={handleFormCancel} variant="secondary">Скасувати</Button>
          <Button type="submit">{isEdit ? "Редагувати" : "Додати"}</Button>
        </div>
      </form>
    </Form>
  )
}