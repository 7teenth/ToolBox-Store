import React from "react";
import { Layout } from "../components/Layout";

const Contact: React.FC = () => {
  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Звʼязатися з нами
        </h1>

        <p className="text-lg text-gray-700 mb-8 text-center">
          Якщо у вас є запитання, пропозиції або потрібна допомога — напишіть
          нам. Ми завжди раді допомогти!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Контактна інформація */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Контактна інформація</h2>
            <p className="mb-2">📍 Харків, Україна</p>
            <p className="mb-2">
              📞{" "}
              <a
                href="tel:+380990817643"
                className="text-blue-600 hover:underline"
              >
                +38 (099) 081-76-43
              </a>
            </p>
            <p className="mb-2">
              📧{" "}
              <a
                href="mailto:support@toolbox.ua"
                className="text-blue-600 hover:underline"
              >
                support@toolbox.ua
              </a>
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Графік роботи: Пн–Пт з 9:00 до 18:00
            </p>
          </div>

          {/* Форма зворотного звʼязку */}
          <form className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              Форма зворотного звʼязку
            </h2>
            <input
              type="text"
              placeholder="Ваше імʼя"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              placeholder="Ваш email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              placeholder="Ваше повідомлення"
              rows={5}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Надіслати
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
