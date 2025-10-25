import { useCart } from "@/context/CartContext";
import Head from "next/head";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import CheckoutForm from "@/components/CheckoutForm";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <Head>
        <title>Кошик | ToolBox Store</title>
      </Head>

      <div className="flex flex-col min-h-screen bg-white transition-colors">
        <Header />

        <main className="flex-1 max-w-6xl mx-auto py-10 px-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Левая колонка */}
          <div>
            <h1 className="text-4xl font-extrabold mb-8 text-gray-900">
              🛒 Кошик
            </h1>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-10 shadow-md">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Кошик порожній
                </h2>
                <p className="text-gray-500 mb-6">
                  Додайте товари з{" "}
                  <Link
                    href="/catalog"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    каталогу
                  </Link>{" "}
                  і поверніться сюди.
                </p>
                <Link href="/catalog">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow transition">
                    Перейти до каталогу
                  </button>
                </Link>
              </div>
            ) : (
              <>
                <ul className="space-y-6">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-5 transition hover:shadow-xl border border-gray-100"
                    >
                      {/* Левая часть: изображение + инфо */}
                      <div className="flex items-center gap-5">
                        <div className="relative w-20 h-20 shrink-0">
                          <img

                            alt={item.name}
                            className="w-full h-full object-cover rounded-xl border border-gray-200"
                          />
                          <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-bl-xl rounded-tr-xl shadow">
                            x{item.quantity}
                          </div>
                        </div>

                        <div>
                          <h2 className="font-semibold text-lg text-gray-900 leading-tight">
                            {item.name}
                          </h2>
                          <p className="text-sm text-gray-500 mt-1">
                            Ціна: {item.price} грн
                          </p>
                        </div>
                      </div>

                      {/* Правая часть: управление */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1 shadow-inner">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(item.quantity - 1, 1)
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md text-lg font-bold hover:bg-gray-200 transition"
                          >
                            −
                          </button>

                          <span className="px-3 text-base font-medium text-gray-800">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md text-lg font-bold hover:bg-gray-200 transition"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold transition"
                        >
                          ✖ Видалити
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl p-6 shadow-lg">
                  <p className="text-xl font-bold flex items-center gap-2">
                    <span>💰 Сума:</span> <span>{totalPrice} грн</span>
                  </p>
                  <button
                    onClick={clearCart}
                    className="mt-4 sm:mt-0 bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    Очистити кошик
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Правая колонка */}
          {items.length > 0 && (
            <CheckoutForm
              clearCart={clearCart}
              cartItems={items} // ✅ добавляем передачу корзины
            />
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};
