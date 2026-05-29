import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/lib/listings";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GameMart — площадка для геймеров" },
      {
        name: "description",
        content:
          "Покупайте и продавайте аккаунты, валюту, предметы и скины — быстро, безопасно, с проверенными продавцами.",
      },
    ],
  }),
  component: Index,
});

const categories = ["Все", "Аккаунты", "Валюта", "Предметы", "Скины", "Маунты"];

function Index() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section
        className="relative overflow-hidden border-b border-border"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Маркетплейс для{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              геймеров
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Аккаунты, валюта, предметы и скины из любимых игр. Безопасные сделки,
            проверенные продавцы, мгновенная доставка.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((c, i) => (
              <button
                key={c}
                className={
                  "rounded-full border px-4 py-2 text-sm font-medium transition " +
                  (i === 0
                    ? "border-transparent text-primary-foreground"
                    : "border-border bg-card hover:border-primary/50")
                }
                style={i === 0 ? { background: "var(--gradient-primary)" } : undefined}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Свежие объявления</h2>
            <p className="text-sm text-muted-foreground">
              {listings.length} активных лотов от продавцов
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </main>

      <footer className="mt-16 border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2026 GameMart. Демо-площадка.
      </footer>
    </div>
  );
}
