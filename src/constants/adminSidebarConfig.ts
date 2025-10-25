import { ChartPie, CreditCard, Layers, ListTree, MessageSquare, Package, Settings, ShoppingCart, Tags, Users } from "lucide-react";

export const adminSidebarConfig = [
  {

    title: "Моніторинг",
    items: [
      {
        title: "Аналітика",
        url: "/admin/dashboard",
        icon: ChartPie
      }
    ],
  },
  {
    title: "Каталог",
    items: [
      {
        title: "Товари",
        url: "/admin/products",
        icon: Package
      },
      {
        title: "Категорії",
        url: "/admin/categories",
        icon: ListTree
      },
      {
        title: "Атрибути",
        url: "/admin/attributes",
        icon: Tags
      },
      {
        title: "Бренди",
        url: "/admin/brands",
        icon: Layers
      }
    ]
  },
  {
    title: "Продажі",
    items: [
      {
        title: "Замовлення",
        url: "/admin/orders",
        icon: ShoppingCart,
        items: [
          {
            title: "Саб1",
            url: "#",
          },
          {
            title: "Саб2",
            url: "#",
          },
          {
            title: "Саб3",
            url: "#",
          }
        ]
      },
      {
        title: "Платежі",
        url: "/admin/payments",
        icon: CreditCard
      }
    ]
  },
  {
    title: "Клієнти",
    items: [
      {
        title: "Клієнти",
        url: "/admin/customers",
        icon: Users
      },
      {
        title: "Відгуки",
        url: "/admin/reviews",
        icon: MessageSquare
      }
    ]
  },
  {
    title: "Система",
    items: [
      {
        title: "Налаштування",
        url: "/admin/settings",
        icon: Settings
      }
    ]
  }
];