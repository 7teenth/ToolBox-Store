import React from "react";
import { Layout } from "../../../components/Layout";

export default function About() {
  return (
    <Layout>
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6 text-center">Про нас</h1>
        <p className="text-lg text-gray-700 mb-4">
          ToolBox Store — це більше, ніж просто магазин інструментів. Ми —
          команда, яка вірить у силу якісного обладнання, перевірених брендів і
          чесного сервісу.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Наша мета — зробити професійні та побутові інструменти доступними для
          кожного. Ми ретельно відбираємо продукцію, щоб ви могли бути впевнені
          в її надійності, довговічності та ефективності.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          У нас ви знайдете все: від викруток і рівнів — до електроінструментів
          та аксесуарів. Ми працюємо з майстрами, будівельниками, домашніми
          умільцями та всіма, хто цінує якість.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Ми також постійно оновлюємо асортимент, слідкуємо за новинками ринку
          та пропонуємо вигідні акції. ToolBox Store — це місце, де інструмент
          стає партнером у вашій справі.
        </p>
        <div className="mt-8 text-center">
          <span className="text-xl font-semibold text-blue-600">
            Надійність. Якість. Професіоналізм.
          </span>
        </div>
      </section>
    </Layout>
  );
};
