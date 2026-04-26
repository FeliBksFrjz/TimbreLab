"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Iniciando login...");
    console.log("Email:", email);
    console.log("Supabase URL definida?", !!process.env.NEXT_PUBLIC_SUPABASE_URL);

    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("Resposta do Supabase SignIn:", { data, error });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/presets");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden">
      {/* Background de Estrelas Fixo */}
      <div className="fixed -inset-[50px] bg-stars pointer-events-none z-0" />

      <Header />

      <main className="relative z-10 w-full max-w-md px-6 pt-24">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-white mb-8 tracking-tight">Entrar no TimbreLab</h1>
          
          <form className="w-full flex flex-col gap-5" onSubmit={handleLogin}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-zinc-400">Email</label>
              <input 
                type="email" 
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-zinc-400">Senha</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
              />
            </div>

            <Button type="submit" size="lg" disabled={loading} className="w-full bg-white text-black hover:bg-zinc-200 mt-2 py-6 text-base font-bold rounded-xl transition-all shadow-lg">
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            
            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
          </form>

          <p className="mt-8 text-zinc-400 text-sm">
            Não tem conta?{" "}
            <Link href="/register" className="text-white font-semibold hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
