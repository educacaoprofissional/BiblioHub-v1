import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { BookOpen, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface FeaturedSectionProps {
  imageUrl: string;
  isBorrowed?: boolean;
  onBorrow?: () => void;
  onDetails?: () => void;
}

export function FeaturedSection({ imageUrl, isBorrowed, onBorrow, onDetails }: FeaturedSectionProps) {
  return (
    <Card className="overflow-hidden border-2">
      <CardContent className="p-0">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto">
            <ImageWithFallback
              src={imageUrl}
              alt="Livro em destaque"
              className="size-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-4 p-6">
            <Badge className="w-fit">Destaque da Semana</Badge>
            <h2 className="text-3xl font-bold">O Guia do Mochileiro das Galáxias</h2>
            <p className="text-muted-foreground">por Douglas Adams</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 font-medium">4.9</span>
              </div>
              <span className="text-sm text-muted-foreground">(2,847 avaliações)</span>
            </div>
            <p className="line-clamp-4">
              Uma hilariante aventura espacial que acompanha Arthur Dent após a Terra ser destruída
              para dar lugar a uma rodovia hiperespacial. Um clássico da ficção científica que mistura
              humor britânico com reflexões filosóficas sobre a vida, o universo e tudo mais.
            </p>
            <div className="flex gap-2">
              <Button size="lg" onClick={onBorrow} variant={isBorrowed ? "outline" : "default"}>
                <BookOpen className="mr-2 size-4" />
                {isBorrowed ? "Devolver" : "Emprestar Agora"}
              </Button>
              <Button size="lg" variant="outline" onClick={onDetails}>
                Ver Detalhes
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
