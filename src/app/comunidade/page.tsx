"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const GENRES = ["Metal", "Hard Rock", "Rock Clássico", "Grunge", "Rock Nacional", "Blues", "Worship"];

type Post = {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  genre: string;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ComunidadePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState(GENRES[0]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const { data } = await supabase
        .from("community_posts")
        .select("*")
        .eq("genre", selectedGenre)
        .order("created_at", { ascending: false });
      setPosts(data ?? []);
      setLoading(false);
    }
    fetchPosts();
  }, [selectedGenre]);

  return (
    <div className="relative min-h-screen bg-[#000000] flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 pt-32 pb-24 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Comunidade</h1>
          {user && (
            <button
              onClick={() => router.push("/comunidade/novo")}
              className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors"
            >
              Novo post
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedGenre === genre
                  ? "bg-white text-black"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-zinc-500 text-center py-20">Nenhum post nessa categoria ainda.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl px-5 py-4 flex flex-col gap-1"
              >
                <span className="text-white font-semibold">{post.title}</span>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span>{post.user_id}</span>
                  <span>·</span>
                  <span>{formatDate(post.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
