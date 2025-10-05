import { GetStaticProps } from "next";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";

type Category = {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
};

type Props = {
  categories: Category[];
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const BUCKET_NAME = "products";
const IMAGE_FOLDER = "assets";

const getPublicUrl = (path: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${IMAGE_FOLDER}/${path}`;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, image_url")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Ошибка Supabase:", error.message);
    return { props: { categories: [] } };
  }

  return {
    props: {
      categories: data ?? [],
    },
    revalidate: 60,
  };
};

export default function CatalogPage({ categories }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Категории</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/catalog/${cat.slug}`}>
              <div className="border rounded-lg shadow hover:shadow-lg transition p-4 cursor-pointer">
                <div className="relative w-full h-40 mb-3">
                  <Image
                    src={
                      cat.image_url
                        ? getPublicUrl(cat.image_url)
                        : "/fallback.png"
                    }
                    alt={cat.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded"
                  />
                </div>
                <h2 className="text-xl font-semibold">{cat.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
