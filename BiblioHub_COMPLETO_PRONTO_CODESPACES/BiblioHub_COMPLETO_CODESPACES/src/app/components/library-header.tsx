import { Search, Bell, User, Menu, Sun, Moon, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

interface LibraryHeaderProps {
  onMenuClick: () => void;
  darkMode?: boolean;
  onToggleDark?: () => void;
  searchQuery?: string;
  onSearch?: (q: string) => void;
  userEmail?: string | null;
  onLogout?: () => void;
}

export function LibraryHeader({ onMenuClick, darkMode, onToggleDark, searchQuery = "", onSearch, userEmail, onLogout }: LibraryHeaderProps) {
  const userInitial = userEmail ? userEmail[0].toUpperCase() : "U";
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4 px-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="size-5" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-lg font-semibold">📚</span>
          </div>
          <span className="hidden font-bold sm:inline-block">BiblioHub</span>
        </div>

        <div className="flex flex-1 items-center gap-4 md:gap-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar livros, autores..."
              className="pl-8 pr-8"
              value={searchQuery}
              onChange={(e) => onSearch?.(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 size-9"
                onClick={() => onSearch?.("")}
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onToggleDark} title={darkMode ? "Modo claro" : "Modo escuro"}>
            {darkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-5" />
                <Badge className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full p-0 text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast.info("Prazo de devolução: 1984 vence em 2 dias")}>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">Devolução próxima</span>
                  <span className="text-xs text-muted-foreground">1984 vence em 2 dias</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success("Sapiens está disponível para empréstimo!")}>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">Livro disponível</span>
                  <span className="text-xs text-muted-foreground">Sapiens está disponível</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Nova recomendação baseada no seu histórico")}>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">Recomendação</span>
                  <span className="text-xs text-muted-foreground">Baseado no seu histórico</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative overflow-hidden rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <span className="text-sm font-bold">{userInitial}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span>Minha Conta</span>
                {userEmail && <span className="text-xs font-normal text-muted-foreground truncate">{userEmail}</span>}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast.info("Perfil em breve!")}>Perfil</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Veja seus empréstimos na barra lateral")}>Meus Empréstimos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Histórico em breve!")}>Histórico</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Configurações em breve!")}>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => { toast.success("Sessão encerrada. Até logo!"); setTimeout(() => onLogout?.(), 800); }}
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
