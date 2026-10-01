import { useState } from "react";
import { BookOpen, Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { api, setToken, type User } from "../api";

interface LoginPageProps { onLogin: (user: User) => void; }

export function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("aluno@bibliohub.edu.br");
  const [password, setPassword] = useState("biblioteca123");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      if (mode === "register") {
        await api("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
      }
      const result = await api<{ token: string; user: User }>("/api/auth/login", {
        method: "POST", body: JSON.stringify({ email, password }),
      });
      setToken(result.token); onLogin(result.user);
    } catch (err) { setError(err instanceof Error ? err.message : "Falha no acesso."); }
    finally { setLoading(false); }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg"><BookOpen className="size-8" /></div>
          <div><h1 className="text-2xl font-bold tracking-tight">BiblioHub</h1><p className="text-sm text-muted-foreground">Biblioteca Digital Institucional</p></div>
        </div>
        <div className="rounded-xl border bg-card p-8 shadow-sm space-y-6">
          <div><h2 className="text-lg font-semibold">{mode === "login" ? "Entrar na plataforma" : "Criar acesso"}</h2><p className="text-sm text-muted-foreground mt-1">Use um e-mail institucional @bibliohub.edu.br.</p></div>
          {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && <div className="space-y-1.5"><label className="text-sm font-medium">Nome</label><Input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome completo" required /></div>}
            <div className="space-y-1.5"><label className="text-sm font-medium">E-mail institucional</label><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Senha</label><div className="relative"><Input type={showPass?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} minLength={6} required className="pr-10"/><button type="button" onClick={()=>setShowPass(v=>!v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label={showPass?"Ocultar senha":"Mostrar senha"}>{showPass?<EyeOff className="size-4"/>:<Eye className="size-4"/>}</button></div></div>
            <Button type="submit" className="w-full" disabled={loading}>{loading?<><Loader2 className="size-4 animate-spin"/>Aguarde...</>:mode === "login"?"Entrar":"Cadastrar e entrar"}</Button>
          </form>
          <Button variant="outline" className="w-full" onClick={()=>{setMode(mode==="login"?"register":"login");setError("");}}>{mode === "login"?<><UserPlus className="mr-2 size-4"/>Criar conta</>:"Já tenho uma conta"}</Button>
          <div className="rounded-lg bg-muted/50 px-4 py-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Credenciais de demonstração</p>
            <p>Leitor: <span className="font-mono">aluno@bibliohub.edu.br</span> / <span className="font-mono">biblioteca123</span></p>
            <p>ADM: <span className="font-mono">admin@bibliohub.edu.br</span> / <span className="font-mono">admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
