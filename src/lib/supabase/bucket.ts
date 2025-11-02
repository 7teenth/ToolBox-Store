import { createClient } from "@/lib/supabase/client";
import * as uuid from "uuid";

export enum Buckets {
  products = 'products',
  categories = 'categories',
  brands = 'brands'
}

export const uploadFile = async (bucket: Buckets, file: File) => {
  const supabase = await createClient();

  const type = file.name.split('.').pop();
  const path = `${uuid.v4()}.${type}`

  const { data, error } = await supabase
    .storage
    .from(bucket)
    .upload(path, file)


  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  return data;
}

// export const getFilePublicUrl = async (bucket: Buckets, path: string) => {
//   const supabase = await createClient();

//   const { data } = supabase
//     .storage
//     .from(bucket)
//     .getPublicUrl(path)


//   return data.publicUrl;
// }
