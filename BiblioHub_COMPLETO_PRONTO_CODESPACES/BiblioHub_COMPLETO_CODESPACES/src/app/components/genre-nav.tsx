import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

const GENRE_ICONS: Record<string, string> = {
  "Ficção":     "📖",
  "Fantasia":   "🧙",
  "Ciência":    "🔬",
  "História":   "🏛️",
  "Romance":    "💞",
  "Mistério":   "🔍",
  "Não-ficção": "📰",
  "Biografia":  "👤",
  "Tecnologia": "💻",
};

interface GenreNavProps {
  activeCategory: string | null;
  onSelect: (category: string | null) => void;
  categoryCounts: Record<string, number>;
}

export function GenreNav({ activeCategory, onSelect, categoryCounts }: GenreNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  }

  const genres = Object.keys(categoryCounts).sort();

  return (
    <div className="relative flex items-center gap-2">
      <Button variant="ghost" size="icon" className="shrink-0" onClick={() => scroll("left")}>
        <ChevronLeft className="size-4" />
      </Button>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* "Todos" chip */}
        <button
          onClick={() => onSelect(null)}
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            !activeCategory
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-foreground hover:bg-muted"
          }`}
        >
          ✨ Todos
        </button>

        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => onSelect(genre)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === genre
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-muted"
            }`}
          >
            <span>{GENRE_ICONS[genre] ?? "📚"}</span>
            {genre}
            <span className={`rounded-full px-1.5 py-0.5 text-xs ${activeCategory === genre ? "bg-white/20" : "bg-muted text-muted-foreground"}`}>
              {categoryCounts[genre]}
            </span>
          </button>
        ))}
      </div>

      <Button variant="ghost" size="icon" className="shrink-0" onClick={() => scroll("right")}>
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
