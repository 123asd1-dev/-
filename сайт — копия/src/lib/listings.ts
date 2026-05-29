import img1 from "@/assets/listing-1.jpg";
import img2 from "@/assets/listing-2.jpg";
import img3 from "@/assets/listing-3.jpg";
import img4 from "@/assets/listing-4.jpg";
import img5 from "@/assets/listing-5.jpg";
import img6 from "@/assets/listing-6.jpg";

export type Listing = {
  id: string;
  title: string;
  game: string;
  category: string;
  price: number;
  image: string;
  shortDescription: string;
  description: string;
  seller: {
    name: string;
    rating: number;
    reviews: number;
    online: boolean;
  };
  deliveryTime: string;
  inStock: number;
};

export const listings: Listing[] = [
  {
    id: "neon-account",
    title: "Аккаунт Neon Strike — 250 уровень, все скины",
    game: "Neon Strike",
    category: "Аккаунты",
    price: 4990,
    image: img1,
    shortDescription: "Прокачанный аккаунт со всеми легендарными скинами сезона.",
    description:
      "Полностью прокачанный аккаунт 250 уровня. Открыты все легендарные скины текущего сезона, боевой пропуск максимального уровня, эксклюзивные эмоции и оружейные обвесы. Привязка к почте — передаю первую почту, доступ полностью ваш.",
    seller: { name: "NeonKing", rating: 4.97, reviews: 1284, online: true },
    deliveryTime: "до 15 минут",
    inStock: 1,
  },
  {
    id: "epic-sword",
    title: "Меч Изумрудной Зари — +15 заточка",
    game: "Aetheria Online",
    category: "Предметы",
    price: 1290,
    image: img2,
    shortDescription: "Легендарный меч с заточкой +15 и тремя самоцветами.",
    description:
      "Один из лучших мечей на сервере. Заточка +15, три слота самоцветов уже забиты редкими камнями. Передача через внутриигровой обмен в течение 30 минут после оплаты.",
    seller: { name: "AethraTrader", rating: 4.89, reviews: 612, online: true },
    deliveryTime: "до 30 минут",
    inStock: 3,
  },
  {
    id: "gold-1m",
    title: "Золото 1 000 000 — сервер Драконий Пик",
    game: "Aetheria Online",
    category: "Валюта",
    price: 690,
    image: img3,
    shortDescription: "Быстрая доставка золота на любого персонажа.",
    description:
      "Продаю золото на сервере Драконий Пик. Минимум — 100к, максимум — 10М за раз. Передача через аукцион или личный обмен. В наличии всегда.",
    seller: { name: "GoldRush", rating: 4.99, reviews: 5210, online: true },
    deliveryTime: "до 10 минут",
    inStock: 50,
  },
  {
    id: "ship-skin",
    title: "Скин корабля «Алый Метеор»",
    game: "Starfall Arena",
    category: "Скины",
    price: 2490,
    image: img4,
    shortDescription: "Эксклюзивный скин корабля с уникальным следом ускорителя.",
    description:
      "Скин «Алый Метеор» — был доступен только в лимитированном ивенте. Уникальный след ускорителя, кастомные звуки выстрела. Передача через подарок в игре.",
    seller: { name: "VoidPilot", rating: 4.92, reviews: 348, online: false },
    deliveryTime: "до 1 часа",
    inStock: 2,
  },
  {
    id: "potions-pack",
    title: "Набор зелий «Алхимик» (50 шт)",
    game: "Aetheria Online",
    category: "Предметы",
    price: 350,
    image: img5,
    shortDescription: "Полный набор зелий для рейдов: лечение, мана, баффы.",
    description:
      "50 зелий: 20 лечения большого, 20 маны, 10 баффов на атаку. Идеально для рейдов и PvP. Передача через почту в течение 10 минут.",
    seller: { name: "AlchemyMaster", rating: 4.95, reviews: 1820, online: true },
    deliveryTime: "до 10 минут",
    inStock: 25,
  },
  {
    id: "dragon-mount",
    title: "Маунт «Изумрудный Дракон»",
    game: "Aetheria Online",
    category: "Маунты",
    price: 3590,
    image: img6,
    shortDescription: "Редчайший летающий маунт с шансом дропа 0.1%.",
    description:
      "Дракон выбит с мирового босса лично. Передача через торговлю. Скорость полёта +30% к обычным маунтам, уникальная анимация взлёта.",
    seller: { name: "DragonHunter", rating: 5.0, reviews: 89, online: true },
    deliveryTime: "до 2 часов",
    inStock: 1,
  },
];

export const getListing = (id: string) => listings.find((l) => l.id === id);
