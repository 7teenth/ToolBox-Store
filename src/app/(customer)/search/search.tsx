import { GetServerSideProps } from "next";
import Link from "next/link";



export default function SearchPage({}) {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Результати пошуку: ""</h1>

      {/* Категорії */}
      {/* {categories.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Категорії</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.id}`}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )} */}

      {/* Товари */}
      {/* {products.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-2">Товари</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((prod) => (
              <Link
                key={prod.id}
                href={`/product/${prod.id}`}
                className="bg-white rounded-lg shadow p-3 flex flex-col"
              >
                <img
                  src={prod.image_url || "/defaults/default-product.png"}
                  alt={prod.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h3 className="font-semibold">{prod.name}</h3>
                <p className="text-green-600 font-bold">{prod.price} грн</p>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p>Товари за цим запитом не знайдено.</p>
      )} */}
    </div>
  );
}