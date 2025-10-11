import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { debounce } from "lodash";
import InputMask from "react-input-mask";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";

interface NovaPoshtaResponse<T> {
  success: boolean;
  data: T[];
}

interface City {
  Description: string;
}

interface Warehouse {
  Description: string;
}

interface CheckoutFormProps {
  clearCart: () => void;
  cartItems: any[]; // массив товаров из корзины
}

const capitalizeWords = (value: string) =>
  value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  clearCart,
  cartItems,
}) => {
  const [cityQuery, setCityQuery] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("");

  const [warehouses, setWarehouses] = useState<string[]>([]);
  const [warehouse, setWarehouse] = useState("");

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  const [phoneError, setPhoneError] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const phoneRef = useRef<HTMLInputElement>(null);

  const debouncedFetchCities = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.length < 3 || query === selectedCity) return;
        try {
          const res = await axios.post<NovaPoshtaResponse<City>>(
            "https://api.novaposhta.ua/v2.0/json/",
            {
              apiKey: "7024283c44e0a9aca63e6cb073fe6f97",
              modelName: "Address",
              calledMethod: "getCities",
              methodProperties: { FindByString: query },
            }
          );
          const list = res.data.data.map((c) => c.Description);
          setCities(list);
        } catch (error) {
          console.error("Помилка при отриманні міст:", error);
        }
      }, 500),
    [selectedCity]
  );

  useEffect(() => {
    debouncedFetchCities(cityQuery);
  }, [cityQuery, debouncedFetchCities]);

  useEffect(() => {
    if (!selectedCity) return;

    const fetchWarehouses = async () => {
      try {
        const res = await axios.post<NovaPoshtaResponse<Warehouse>>(
          "https://api.novaposhta.ua/v2.0/json/",
          {
            apiKey: "7024283c44e0a9aca63e6cb073fe6f97",
            modelName: "Address",
            calledMethod: "getWarehouses",
            methodProperties: { CityName: selectedCity },
          }
        );
        const list = res.data.data.map((w) => w.Description);
        setWarehouses(list);
      } catch (error) {
        console.error("Помилка при отриманні відділень:", error);
      }
    };

    fetchWarehouses();
  }, [selectedCity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const phoneRegex = /^\+380 \(\d{2}\) \d{3}-\d{2}-\d{2}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError(true);
      phoneRef.current?.focus();
      return;
    }

    setShowPreview(true);
  };

  const confirmOrder = async () => {
    setShowPreview(false);

    try {
      const full_name = `${name} ${surname}`.trim();

      // Проверка существующего пользователя
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("phone", phone)
        .single();

      let userId: string | null = null;

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Помилка при пошуку користувача:", fetchError);
      }

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const { data: newUser, error: userError } = await supabase
          .from("users")
          .insert([
            {
              full_name,
              phone,
              role: "customer",
              is_active: true,
            },
          ])
          .select()
          .single();

        if (userError || !newUser) {
          console.error("Помилка при створенні користувача:", userError);
          toast.error("Не вдалося створити користувача");
          return;
        }

        userId = newUser.id;
      }

      // Создание заказа
      const { data: newOrder, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: userId,
            name,
            surname,
            phone,
            email,
            city: selectedCity,
            warehouse,
            comment,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (orderError || !newOrder) {
        console.error("Помилка при оформленні замовлення:", orderError);
        toast.error("Помилка при оформленні замовлення");
        return;
      }

      // Добавление товаров в order_items
      const orderItemsPayload = cartItems.map((item) => ({
        order_id: newOrder.id,
        product_id: item.id,
        quantity: item.quantity || 1,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsPayload);

      if (itemsError) {
        console.error(
          "Помилка при додаванні товарів до замовлення:",
          itemsError
        );
        toast.error("Не вдалося зберегти товари замовлення");
        return;
      }

      toast.success("Замовлення успішно оформлено!", {
        duration: 4000,
        position: "bottom-center",
      });

      clearCart();

      setName("");
      setSurname("");
      setPhone("");
      setEmail("");
      setCityQuery("");
      setSelectedCity("");
      setWarehouse("");
      setComment("");
    } catch (err) {
      console.error("Невідома помилка при оформленні:", err);
      toast.error("Сталася невідома помилка");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        🧾 Оформлення замовлення
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Ім’я"
          value={name}
          onChange={(e) => setName(capitalizeWords(e.target.value))}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
          required
        />
        <input
          type="text"
          placeholder="Прізвище"
          value={surname}
          onChange={(e) => setSurname(capitalizeWords(e.target.value))}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
          required
        />
      </div>

      <InputMask
        mask="+380 (99) 999-99-99"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
          setPhoneError(false);
        }}
      >
        {(inputProps) => (
          <input
            {...inputProps}
            ref={phoneRef}
            type="tel"
            id="phone"
            name="phone"
            placeholder="Телефон"
            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 outline-none transition ${
              phoneError
                ? "border-red-500 ring-red-300"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            required
          />
        )}
      </InputMask>

      {phoneError && (
        <p className="text-red-500 text-sm mt-1 sm:col-span-2">
          Невірний формат. Використовуйте +380 (XX) XXX-XX-XX
        </p>
      )}

      <input
        type="email"
        id="email"
        name="email"
        placeholder="Email (необов’язково)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
      />

      {/* Місто */}
      <div className="relative col-span-1 sm:col-span-2">
        <input
          type="text"
          id="city"
          name="city"
          placeholder="Місто"
          value={cityQuery}
          onChange={(e) => {
            setCityQuery(e.target.value);
            setSelectedCity("");
          }}
          onBlur={() => setTimeout(() => setCities([]), 100)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
          required
        />
        {cities.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto animate-fade-in">
            {cities.map((c) => (
              <li
                key={c}
                onMouseDown={() => {
                  setSelectedCity(c);
                  setCityQuery(c);
                  setCities([]);
                }}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition text-gray-800"
              >
                {c}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Відділення */}
      <div className="relative col-span-1 sm:col-span-2">
        <input
          type="text"
          id="warehouse"
          name="warehouse"
          placeholder="Оберіть відділення"
          value={warehouse}
          onChange={(e) => setWarehouse(e.target.value)}
          onBlur={() => setTimeout(() => setWarehouses([]), 100)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
          required
        />
        {warehouses.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto animate-fade-in">
            {warehouses.map((w) => (
              <li
                key={w}
                onMouseDown={() => {
                  setWarehouse(w);
                  setWarehouses([]);
                }}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition text-gray-800"
              >
                {w}
              </li>
            ))}
          </ul>
        )}
      </div>

      <textarea
        id="comment"
        name="comment"
        placeholder="Коментар до замовлення"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
        rows={3}
      />

      {!showPreview && (
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition"
        >
          ✅ Оформити замовлення
        </button>
      )}

      {showPreview && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-md space-y-4 animate-fade-in mt-4">
          <h3 className="text-xl font-bold text-gray-800">
            🔍 Перевірте замовлення
          </h3>
          <ul className="text-gray-700 space-y-1">
            <li>
              <strong>Ім’я:</strong> {name}
            </li>
            <li>
              <strong>Прізвище:</strong> {surname}
            </li>
            <li>
              <strong>Телефон:</strong> {phone}
            </li>
            <li>
              <strong>Email:</strong> {email || "—"}
            </li>
            <li>
              <strong>Місто:</strong> {selectedCity}
            </li>
            <li>
              <strong>Відділення:</strong> {warehouse}
            </li>
            <li>
              <strong>Коментар:</strong> {comment || "—"}
            </li>
          </ul>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setShowPreview(false)}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
            >
              🔄 Редагувати
            </button>
            <button
              type="button"
              onClick={confirmOrder}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              ✅ Підтвердити замовлення
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
