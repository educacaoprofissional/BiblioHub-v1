import { Star, BookOpen, Heart, Clock, BookmarkPlus } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface BookCardProps {
  title: string; author: string; rating: number; category: string; available: boolean; imageUrl: string;
  availableCopies?: number; totalCopies?: number; isFavorite?: boolean; isBorrowed?: boolean; isReadLater?: boolean; isReserved?: boolean;
  onFavorite?:()=>void; onBorrow?:()=>void; onReadLater?:()=>void; onReserve?:()=>void;
}
export function BookCard(p: BookCardProps) {
  const {title,author,rating,category,available,imageUrl,availableCopies,totalCopies,isFavorite,isBorrowed,isReadLater,isReserved,onFavorite,onBorrow,onReadLater,onReserve}=p;
  return <Card className="group overflow-hidden transition-all hover:shadow-lg">
    <div className="relative aspect-[2/3] overflow-hidden bg-muted"><ImageWithFallback src={imageUrl} alt={title} className="size-full object-cover transition-transform group-hover:scale-105"/>
      <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100"><Button size="icon" variant="secondary" onClick={onFavorite} title="Favorito"><Heart className={`size-4 ${isFavorite?"fill-red-500 text-red-500":""}`}/></Button><Button size="icon" variant="secondary" onClick={onReadLater} title="Ler mais tarde"><Clock className={`size-4 ${isReadLater?"fill-blue-500 text-blue-500":""}`}/></Button></div>
      {isBorrowed && <Badge className="absolute left-2 top-2 bg-green-600 text-white">Com você</Badge>}
      {isReserved && !isBorrowed && <Badge className="absolute left-2 top-2 bg-amber-600 text-white">Reservado</Badge>}
    </div>
    <CardContent className="p-4"><h3 className="line-clamp-2 font-semibold">{title}</h3><p className="text-sm text-muted-foreground">{author}</p><div className="mt-2 flex flex-wrap items-center gap-2"><span className="flex items-center gap-1 text-sm"><Star className="size-4 fill-yellow-400 text-yellow-400"/>{rating}</span><Badge variant="outline" className="text-xs">{category}</Badge>{availableCopies!==undefined&&<span className="text-xs text-muted-foreground">{availableCopies}/{totalCopies} disponível(is)</span>}</div></CardContent>
    <CardFooter className="p-4 pt-0">{isBorrowed?<Button className="w-full" variant="outline" onClick={onBorrow}><BookOpen className="mr-2 size-4"/>Devolver</Button>:available?<Button className="w-full" onClick={onBorrow}><BookOpen className="mr-2 size-4"/>Emprestar</Button>:<Button className="w-full" variant="secondary" onClick={onReserve} disabled={isReserved}><BookmarkPlus className="mr-2 size-4"/>{isReserved?"Reserva ativa":"Reservar"}</Button>}</CardFooter>
  </Card>;
}
