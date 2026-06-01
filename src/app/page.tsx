"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { SlidersHorizontal, Layers, Sparkles, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-[#000000] flex flex-col items-center">
      {/* Header Fixo Transparente */}
      <Header />

      {/* Hero Section */}
      <section className="relative w-full min-h-screen">
        {/* Fundo Preto Puro com z-index menor */}
        <div className="absolute inset-0 bg-[#000000] z-0" />

        {/* Conteúdo com z-index maior */}
        <div className="relative z-[2] flex flex-col items-center justify-start md:justify-center text-center w-full min-h-screen px-6 pt-20 md:pt-0">
          {/* Imagem 2D da Cube Baby com Framer Motion */}
          <motion.img
            src="/images/cube-baby.png"
            alt="Cube Baby"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full max-w-[90%] md:max-w-[700px] h-auto object-contain mx-auto"
          />

          {/* Título Principal */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight"
          >
            O Timbre Perfeito em Segundos
          </motion.h1>

          {/* Botão de CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
          >
            <Link href="/presets">
              <Button size="lg" className="bg-white text-black hover:bg-zinc-200 px-8 py-6 text-base font-semibold rounded-full transition-all shadow-xl">
                Entrar na Biblioteca
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-[2] w-full max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: SlidersHorizontal,
              title: "Ajustes Precisos",
              description: "Visualize a posição exata de cada knob em nossa escala de 0 a 9, idêntica à pedaleira física."
            },
            {
              icon: Layers,
              title: "Biblioteca Categorizada",
              description: "Filtre por gêneros musicais e bandas para descobrir timbres clássicos em segundos."
            },
            {
              icon: Sparkles,
              title: "IA Premium",
              description: "Peça qualquer timbre ao nosso agente IA e ele construirá o preset ideal na hora para você."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm hover:bg-zinc-800/50 transition-colors"
            >
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="relative z-[2] w-full max-w-5xl mx-auto px-6 py-24 md:py-32 mb-20 scroll-mt-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Escolha seu Plano</h2>
          <p className="text-lg text-zinc-400">Cancele quando quiser. Sem compromisso.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Plano Básico */}
          <div className="flex flex-col p-8 rounded-3xl bg-zinc-900 border border-zinc-800">
            <h3 className="text-2xl font-bold text-white mb-2">Básico</h3>
            <p className="text-zinc-400 mb-6">O essencial para encontrar seu timbre.</p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-white">R$ --</span>
              <span className="text-zinc-500">/mês</span>
            </div>
            <ul className="flex flex-col gap-4 mb-10 flex-1">
              {[
                "Acesso a todos os presets",
                "Filtros por gênero e banda",
                "Botão 'Mais pesado'"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button size="lg" variant="outline" className="w-full bg-transparent border-zinc-700 text-white hover:bg-zinc-800 py-6 text-base font-semibold rounded-xl">
              Começar Básico
            </Button>
          </div>

          {/* Plano Premium */}
          <div className="flex flex-col p-8 rounded-3xl bg-zinc-900 border-2 border-white relative shadow-2xl md:scale-105">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Recomendado
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
            <p className="text-zinc-400 mb-6">O poder completo da IA e personalização.</p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-white">R$ --</span>
              <span className="text-zinc-500">/mês</span>
            </div>
            <ul className="flex flex-col gap-4 mb-10 flex-1">
              {[
                "Tudo do plano Básico",
                "Agente IA gerador de presets",
                "Botões 'Mais leve' / 'Mais limpo'",
                "Salvar favoritos na nuvem"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white font-medium">
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button size="lg" className="w-full bg-white text-black hover:bg-zinc-200 py-6 text-base font-bold rounded-xl transition-all">
              Assinar Premium
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
