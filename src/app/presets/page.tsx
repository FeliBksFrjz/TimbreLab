"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Search, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const GENRES = ["Todos", "Metal", "Hard Rock", "Rock Clássico", "Blues", "Rock Nacional", "Grunge", "Worship"];

export default function PresetsPage() {
  const { user } = useAuth();
  const [presets, setPresets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Todos");

  useEffect(() => {
    async function fetchPresets() {
      const { data } = await supabase.from('presets').select('*');
      if (data) setPresets(data);
      setLoading(false);
    }
    fetchPresets();
  }, []);

  const filteredPresets = presets.filter(preset => {
    const matchesGenre = selectedGenre === "Todos" || preset.genero === selectedGenre;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      (preset.nome?.toLowerCase() || "").includes(searchLower) ||
      (preset.banda?.toLowerCase() || "").includes(searchLower);
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="relative min-h-screen bg-[#000000] overflow-x-hidden flex flex-col">
      <Header />

      <main className="relative z-[2] flex-1 w-full max-w-7xl mx-auto px-6 pt-32 pb-24 flex flex-col gap-10">

        {/* Barra de Busca */}
        <div className="relative max-w-2xl mx-auto w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por música ou artista..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-14 pr-6 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors shadow-lg"
          />
        </div>

        {/* Tabs de Filtro */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedGenre === genre
                  ? "bg-white text-black shadow-md scale-105"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700"
              }`}
            >
              {genre}
            </button>
          ))}
          <button
            onClick={() => setSelectedGenre("Comunidade")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              selectedGenre === "Comunidade"
                ? "bg-white text-black shadow-md scale-105"
                : "bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 hover:border-zinc-700"
            }`}
          >
            Comunidade
          </button>
        </div>

        {/* Grid de Presets */}
        {selectedGenre === "Comunidade" ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Lock className="w-8 h-8 text-zinc-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Em breve!</h2>
            <p className="text-zinc-400 max-w-md">
              Assinantes poderão compartilhar seus próprios presets.
            </p>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredPresets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPresets.map(preset => {
              const isLocked = !user && !preset.gratuito;

              if (isLocked) {
                return (
                  <Link
                    href="/login"
                    key={preset.id}
                    className="relative flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl p-6 overflow-hidden shadow-lg hover:border-zinc-700 transition-all"
                  >
                    <div className="opacity-40">
                      <h3 className="text-xl font-bold text-white mb-1">{preset.nome}</h3>
                      <p className="text-sm text-zinc-400 mb-6">{preset.banda}</p>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-md bg-zinc-800 text-zinc-300 text-xs font-semibold tracking-wide uppercase">
                          {preset.genero}
                        </span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 rounded-2xl">
                      <Lock className="w-12 h-12 text-white drop-shadow-lg" />
                      <span className="text-xs font-semibold text-zinc-300 tracking-wide">Faça login para ver</span>
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  href={`/presets/${preset.id}`}
                  key={preset.id}
                  className="group flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all hover:-translate-y-1 hover:shadow-2xl shadow-lg"
                >
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-zinc-200 transition-colors">
                    {preset.nome}
                  </h3>
                  <p className="text-sm text-zinc-400 mb-6">{preset.banda}</p>

                  <div className="flex items-center gap-3 mb-8">
                    <span className="px-3 py-1 rounded-md bg-zinc-800 text-zinc-300 text-xs font-semibold tracking-wide uppercase">
                      {preset.genero}
                    </span>
                  </div>

                  <div className="mt-auto">
                    <Button className="w-full bg-white text-black hover:bg-zinc-200 font-bold rounded-xl py-6 pointer-events-none transition-colors">
                      Ver
                    </Button>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-zinc-500">
            Nenhum preset encontrado para a sua busca.
          </div>
        )}
      </main>
    </div>
  );
}
