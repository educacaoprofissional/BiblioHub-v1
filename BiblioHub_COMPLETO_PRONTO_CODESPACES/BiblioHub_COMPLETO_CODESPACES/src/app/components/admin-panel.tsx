import { useEffect, useState } from "react";
import { api, type Loan } from "../api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

type Summary = { books:number; copies:number; available:number; activeLoans:number; overdue:number; reservations:number; readers:number };
type Reservation = { id:number; reserved_at:string; status:string; title:string; userName:string; userEmail:string };
type Reader = { id:number; name:string; email:string; created_at:string; activeLoans:number };

export function AdminPanel({ onChanged }: { onChanged: () => void }) {
  const [summary,setSummary]=useState<Summary|null>(null);
  const [loans,setLoans]=useState<Loan[]>([]);
  const [reservations,setReservations]=useState<Reservation[]>([]);
  const [readers,setReaders]=useState<Reader[]>([]);
  const [title,setTitle]=useState(""); const [author,setAuthor]=useState(""); const [category,setCategory]=useState("Ficção"); const [copies,setCopies]=useState("1");

  async function load(){
    try {
      const [s,l,r,u] = await Promise.all([
        api<Summary>("/api/admin/summary"),
        api<Loan[]>("/api/admin/loans"),
        api<Reservation[]>("/api/admin/reservations"),
        api<Reader[]>("/api/admin/readers"),
      ]);
      setSummary(s); setLoans(l); setReservations(r); setReaders(u);
    } catch(e){ toast.error(e instanceof Error ? e.message : "Erro no painel"); }
  }
  useEffect(()=>{ void load(); },[]);

  async function addBook(e:React.FormEvent){
    e.preventDefault();
    try {
      await api("/api/admin/books",{method:"POST",body:JSON.stringify({title,author,category,totalCopies:Number(copies)})});
      toast.success("Livro cadastrado"); setTitle(""); setAuthor(""); await load(); onChanged();
    } catch(e){ toast.error(e instanceof Error ? e.message : "Erro ao cadastrar"); }
  }
  async function returnLoan(id:number){
    try { await api(`/api/admin/loans/${id}/return`,{method:"POST"}); toast.success("Devolução registrada"); await load(); onChanged(); }
    catch(e){ toast.error(e instanceof Error ? e.message : "Erro"); }
  }
  async function cancelReservation(id:number){
    try { await api(`/api/admin/reservations/${id}/cancel`,{method:"POST"}); toast.success("Reserva cancelada"); await load(); }
    catch(e){ toast.error(e instanceof Error ? e.message : "Erro"); }
  }

  return <div className="space-y-8">
    <div><h2 className="text-2xl font-bold">Administração da Biblioteca</h2><p className="text-muted-foreground">Gerenciamento do acervo, circulação, reservas e leitores.</p></div>

    {summary && <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[["Títulos",summary.books],["Exemplares disponíveis",`${summary.available}/${summary.copies}`],["Empréstimos ativos",summary.activeLoans],["Atrasados",summary.overdue],["Reservas",summary.reservations],["Leitores",summary.readers]].map(([a,b])=><div key={String(a)} className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">{a}</p><p className="text-2xl font-bold">{b}</p></div>)}
    </div>}

    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={addBook} className="space-y-3 rounded-xl border bg-card p-5">
        <h3 className="font-semibold">Cadastrar livro</h3>
        <Input placeholder="Título" value={title} onChange={e=>setTitle(e.target.value)} required/>
        <Input placeholder="Autor" value={author} onChange={e=>setAuthor(e.target.value)} required/>
        <Input placeholder="Categoria" value={category} onChange={e=>setCategory(e.target.value)} required/>
        <Input type="number" min="1" placeholder="Exemplares" value={copies} onChange={e=>setCopies(e.target.value)} required/>
        <Button type="submit">Adicionar ao acervo</Button>
      </form>

      <div className="rounded-xl border bg-card p-5">
        <h3 className="mb-3 font-semibold">Empréstimos recentes</h3>
        <div className="space-y-2 max-h-96 overflow-auto">
          {loans.length===0 ? <p className="text-sm text-muted-foreground">Nenhum empréstimo.</p> : loans.map(l=><div key={l.id} className="rounded-lg border p-3 text-sm">
            <div className="font-medium">{l.title}</div><div className="text-muted-foreground">{l.userName} · {l.userEmail}</div>
            <div className={l.overdue?"text-destructive":"text-muted-foreground"}>Prazo: {new Date(l.dueAt).toLocaleDateString("pt-BR")} {l.overdue?"· ATRASADO":""}</div>
            {!l.returnedAt && <Button size="sm" variant="outline" className="mt-2" onClick={()=>returnLoan(l.id)}>Registrar devolução</Button>}
          </div>)}
        </div>
      </div>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border bg-card p-5">
        <h3 className="mb-3 font-semibold">Reservas ativas</h3>
        <div className="space-y-2 max-h-80 overflow-auto">
          {reservations.length===0 ? <p className="text-sm text-muted-foreground">Nenhuma reserva ativa.</p> : reservations.map(r=><div key={r.id} className="rounded-lg border p-3 text-sm"><div className="font-medium">{r.title}</div><div className="text-muted-foreground">{r.userName} · {r.userEmail}</div><Button size="sm" variant="outline" className="mt-2" onClick={()=>cancelReservation(r.id)}>Cancelar reserva</Button></div>)}
        </div>
      </div>
      <div className="rounded-xl border bg-card p-5">
        <h3 className="mb-3 font-semibold">Leitores cadastrados</h3>
        <div className="space-y-2 max-h-80 overflow-auto">
          {readers.map(r=><div key={r.id} className="rounded-lg border p-3 text-sm"><div className="font-medium">{r.name}</div><div className="text-muted-foreground">{r.email}</div><div className="text-xs text-muted-foreground">Empréstimos ativos: {r.activeLoans}</div></div>)}
        </div>
      </div>
    </div>
  </div>;
}
