import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Star, MessageCircle, CheckCircle2, CreditCard, Wallet, Bitcoin, Smartphone, Minus, Plus, X } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { getListing } from "@/lib/listings";

export const Route = createFileRoute("/item/$id")({
  loader: ({ params }) => {
    const listing = getListing(params.id);
    if (!listing) throw notFound();
    return { listing };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.listing.title} — GameMart` },
          { name: "description", content: loaderData.listing.shortDescription },
          { property: "og:title", content: loaderData.listing.title },
          { property: "og:description", content: loaderData.listing.shortDescription },
          { property: "og:image", content: loaderData.listing.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Лот не найден</h1>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">
          На главную
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Что-то пошло не так</h1>
        <button onClick={reset} className="mt-4 text-primary hover:underline">
          Попробовать снова
        </button>
      </div>
    </div>
  ),
  component: ItemPage,
});

function ItemPage() {
  const { listing } = Route.useLoaderData();
  const [buyOpen, setBuyOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState<string>("card");
  const [done, setDone] = useState(false);

  const paymentMethods = [
    { id: "card", label: "Банковская карта", icon: CreditCard, desc: "Visa, Mastercard, МИР" },
    { id: "sbp", label: "СБП", icon: Smartphone, desc: "Быстрая оплата по QR" },
    { id: "wallet", label: "Электронный кошелёк", icon: Wallet, desc: "ЮMoney, QIWI" },
    { id: "crypto", label: "Криптовалюта", icon: Bitcoin, desc: "BTC, USDT, ETH" },
  ];

  const total = listing.price * qty;
  const maxQty = listing.inStock;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад к объявлениям
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div
              className="overflow-hidden rounded-2xl border border-border bg-card"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <img
                src={listing.image}
                alt={listing.title}
                width={1024}
                height={1024}
                className="aspect-square w-full object-cover"
              />
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">Описание</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {listing.description}
              </p>

              <div className="mt-6">
                <Feature
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  label="В наличии"
                  value={`${listing.inStock} шт`}
                />
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {listing.game} · {listing.category}
              </p>
              <h1 className="mt-2 text-2xl font-bold leading-tight">{listing.title}</h1>

              <div className="my-6 flex items-baseline gap-2">
                <span className="text-4xl font-bold">
                  {listing.price.toLocaleString("ru-RU")} ₽
                </span>
              </div>

              <button
                onClick={() => { setDone(false); setQty(1); setBuyOpen(true); }}
                className="w-full rounded-xl py-3.5 text-base font-semibold text-primary-foreground transition hover:opacity-90"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
              >
                Купить сейчас
              </button>
              <button className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-3 text-sm font-medium transition hover:bg-muted">
                <MessageCircle className="h-4 w-4" />
                Написать продавцу
              </button>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                Продавец
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {listing.seller.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-semibold">
                    {listing.seller.name}
                    {listing.seller.online && (
                      <span className="inline-flex items-center gap-1 text-xs text-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                        онлайн
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    {listing.seller.rating} · {listing.seller.reviews} отзывов
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {buyOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setBuyOpen(false)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-t-2xl border border-border bg-card sm:rounded-2xl"
            style={{ boxShadow: "var(--shadow-card)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setBuyOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              aria-label="Закрыть"
            >
              <X className="h-5 w-5" />
            </button>

            {done ? (
              <div className="px-6 py-10 text-center">
                <div
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                >
                  <CheckCircle2 className="h-7 w-7 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-bold">Заказ оформлен</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Демо — продавец получит уведомление и свяжется с вами.
                </p>
                <button
                  onClick={() => setBuyOpen(false)}
                  className="mt-6 w-full rounded-xl py-3 text-sm font-semibold text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  Готово
                </button>
              </div>
            ) : (
              <div className="max-h-[85vh] overflow-y-auto px-6 py-5">
                <h2 className="text-lg font-bold">Оформление покупки</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Проверьте детали заказа</p>

                <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3">
                  <img src={listing.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{listing.title}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {listing.game} · продавец {listing.seller.name}
                    </div>
                  </div>
                  <div className="text-sm font-bold">
                    {listing.price.toLocaleString("ru-RU")} ₽
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 text-sm font-medium">Количество</div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary transition hover:bg-muted disabled:opacity-50"
                      disabled={qty <= 1}
                      aria-label="Уменьшить"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={maxQty}
                      value={qty}
                      onChange={(e) => {
                        const v = Math.min(maxQty, Math.max(1, Number(e.target.value) || 1));
                        setQty(v);
                      }}
                      className="h-10 w-20 rounded-lg border border-border bg-input/60 text-center text-sm outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary transition hover:bg-muted disabled:opacity-50"
                      disabled={qty >= maxQty}
                      aria-label="Увеличить"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <span className="ml-1 text-xs text-muted-foreground">
                      доступно {maxQty} шт
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 text-sm font-medium">Способ оплаты</div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {paymentMethods.map((m) => {
                      const Icon = m.icon;
                      const active = payment === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => setPayment(m.id)}
                          className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                            active
                              ? "border-primary bg-primary/10"
                              : "border-border bg-secondary/40 hover:bg-secondary"
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">{m.label}</div>
                            <div className="truncate text-xs text-muted-foreground">{m.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-4 py-3">
                  <span className="text-sm text-muted-foreground">Итого к оплате</span>
                  <span className="text-xl font-bold">{total.toLocaleString("ru-RU")} ₽</span>
                </div>

                <button
                  onClick={() => setDone(true)}
                  className="mt-4 w-full rounded-xl py-3.5 text-base font-semibold text-primary-foreground transition hover:opacity-90"
                  style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                >
                  Подтвердить и оплатить
                </button>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Деньги передаются продавцу только после получения товара
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Feature({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}
