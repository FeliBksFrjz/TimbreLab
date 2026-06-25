"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/presets");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#000000] flex flex-col items-center justify-center overflow-hidden">
      <Header />

      <main className="relative z-[2] w-full max-w-md px-6 pt-24 pb-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-white mb-8 tracking-tight text-center">Criar conta no TimbreLab</h1>
          
          <form className="w-full flex flex-col gap-5" onSubmit={handleRegister}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-zinc-400">Nome completo</label>
              <input 
                type="text" 
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
              />
            </div>

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

            <Button type="submit" size="lg" disabled={loading} className="w-full bg-white text-black hover:bg-zinc-200 mt-4 py-6 text-base font-bold rounded-xl transition-all shadow-lg">
              {loading ? "Criando..." : "Criar conta"}
            </Button>

            {error && <p className="text-red-500 text-sm font-medium text-center mt-2">{error}</p>}
            {success && <p className="text-emerald-500 text-sm font-medium text-center mt-2">{success}</p>}
          </form>

          <p className="mt-8 text-zinc-400 text-sm">
            Já tem conta?{" "}
            <Link href="/login" className="text-white font-semibold hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
