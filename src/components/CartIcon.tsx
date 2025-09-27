import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

const CartIcon = () => {
  const { items } = useCart();
  const total = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href="/cart">
      <button
        className="relative p-2 rounded-full hover:bg-gray-700 transition"
        title="Кошик"
        aria-label="Кошик"
      >
        <FiShoppingCart className="h-6 w-6 text-white hover:text-gray-300 transition" />
        {total > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {total}
          </span>
        )}
      </button>
    </Link>
  );
};

export default CartIcon;
