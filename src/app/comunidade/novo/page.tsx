"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const GENRES = ["Metal", "Hard Rock", "Rock Clássico", "Grunge", "Rock Nacional", "Blues", "Worship"];

export default function NovoPostPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState(GENRES[0]);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase.from("community_posts").insert({
      title,
      genre,
      content,
      user_id: user.id,
    });

    if (insertError) {
      setError("Erro ao publicar o post. Tente novamente.");
      setSubmitting(false);
      return;
    }

    router.push("/comunidade");
  }

  if (authLoading || !user) return null;

  return (
    <div className="relative min-h-screen bg-[#000000] flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-2xl mx-auto px-6 pt-32 pb-24 flex flex-col gap-8">
        <h1 className="text-2xl font-bold text-white">Novo post</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-400">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Título do post"
              className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-400">Gênero</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-zinc-600 transition-colors"
            >
              {GENRES.map((g) => (
                <option key={g} value={g} className="bg-zinc-900">
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-400">Conteúdo</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={8}
              placeholder="Escreva seu post..."
              className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors resize-none"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Publicando..." : "Publicar"}
          </button>
        </form>
      </main>
    </div>
  );
}
