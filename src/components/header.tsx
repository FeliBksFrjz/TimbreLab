"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between pointer-events-auto"
    >
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          TimbreLab
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/presets" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Biblioteca
          </Link>
          <Link href="/#planos" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Planos
          </Link>
        </nav>
      </div>
      <div>
        {user ? (
          <button onClick={handleSignOut} className="text-sm font-medium text-white hover:text-zinc-300 transition-colors cursor-pointer">
            Sair
          </button>
        ) : (
          <Link href="/login" className="text-sm font-medium text-white hover:text-zinc-300 transition-colors">
            Login
          </Link>
        )}
      </div>
    </motion.header>
  );
}
