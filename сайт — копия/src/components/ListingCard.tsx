import { Link } from "@tanstack/react-router";
import { Star, Zap } from "lucide-react";
import type { Listing } from "@/lib/listings";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      to="/item/$id"
      params={{ id: listing.id }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:-translate-y-1 hover:border-primary/50"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={listing.image}
          alt={listing.title}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-md bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur">
          {listing.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs text-muted-foreground">{listing.game}</p>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{listing.title}</h3>
        <p className="line-clamp-2 text-xs text-muted-foreground">{listing.shortDescription}</p>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <div className="text-lg font-bold text-foreground">
              {listing.price.toLocaleString("ru-RU")} ₽
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-accent text-accent" />
              {listing.seller.rating}
              <span className="text-muted-foreground/60">· {listing.seller.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-success">
            <Zap className="h-3 w-3" />
            {listing.deliveryTime}
          </div>
        </div>
      </div>
    </Link>
  );
}
