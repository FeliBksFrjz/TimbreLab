"use client";

import { useState, useEffect, use } from "react";
import { Header } from "@/components/header";
import { Star, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

function Knob({
  rotation,
  styleType,
}: {
  rotation: number;
  styleType: "smooth" | "dots";
}) {
  const size = 60;
  const knobSize = 42;
  const center = size / 2;
  const markerRadius = 27;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {styleType === "dots" &&
        Array.from({ length: 9 }).map((_, i) => {
          const angle = -135 + (i * 270) / 8;
          const rad = (angle * Math.PI) / 180;
          const x = center + markerRadius * Math.sin(rad);
          const y = center - markerRadius * Math.cos(rad);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 3,
                height: 3,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.9)",
                left: x,
                top: y,
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}

      <div
        style={{
          position: "absolute",
          width: knobSize,
          height: knobSize,
          left: (size - knobSize) / 2,
          top: (size - knobSize) / 2,
          borderRadius: "50%",
          backgroundColor: "#1a1d24",
          border: "3px solid #5a5f6a",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 2,
            height: 10,
            backgroundColor: "white",
            borderRadius: 1,
            top: 4,
            left: "calc(50% - 1px)",
            transformOrigin: `50% ${knobSize / 2 - 8}px`,
            transform: `rotate(${rotation}deg)`,
            transition: "transform 0.5s ease-out",
          }}
        />
      </div>
    </div>
  );
}

function Footswitch() {
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: "radial-gradient(circle at 40% 38%, #e8e8e8, #b0b0b0 45%, #808080 75%)",
        border: "3px solid #999",
        boxShadow: "0 4px 12px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.3)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 4,
          left: 4,
          right: 4,
          bottom: 4,
          borderRadius: "50%",
          background: "radial-gradient(circle at 38% 35%, rgba(255,255,255,0.8), rgba(200,200,200,0.4) 40%, rgba(150,150,150,0.3) 60%, transparent 80%)",
        }}
      />
    </div>
  );
}

export default function PresetDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [rating, setRating] = useState(0);
  const [preset, setPreset] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isHeavy, setIsHeavy] = useState(false);

  useEffect(() => {
    async function fetchPreset() {
      const { data } = await supabase
        .from("presets")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();
      if (data) setPreset(data);
      setLoading(false);
    }
    fetchPreset();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#000000] flex items-center justify-center">
        <Header />
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin z-10" />
      </div>
    );
  }

  if (!preset) {
    return (
      <div className="relative min-h-screen bg-[#000000] flex flex-col items-center justify-center text-white">
        <Header />
        <div className="z-10 flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold">Preset não encontrado</h2>
          <Button
            onClick={() => window.history.back()}
            className="bg-white text-black hover:bg-zinc-200 px-6 py-2 rounded-full font-bold"
          >
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const settings = [
    { id: "volume", label: "VOLUME", value: 6.0 },
    { id: "ircab", label: "IR CAB", value: preset.ir_cab },
    { id: "reverb", label: "REVERB", value: preset.reverb },
    { id: "mix", label: "MIX", value: preset.mix },
    { id: "fb", label: "FB", value: preset.fb },
    { id: "time", label: "TIME", value: preset.time_val },
    { id: "mod", label: "MOD", value: preset.mod },
    {
      id: "tone",
      label: "TONE",
      value: isHeavy ? Math.min(9, (Number(preset.tone) || 0) + 0.5) : preset.tone,
    },
    {
      id: "gain",
      label: "GAIN",
      value: isHeavy ? Math.min(9, (Number(preset.gain) || 0) + 1) : preset.gain,
    },
    {
      id: "type",
      label: "TYPE",
      value: isHeavy ? Math.min(9, (Number(preset.type) || 0) + 1) : preset.type,
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#000000] overflow-x-hidden flex flex-col">
      <Header />

      <main className="relative z-[2] flex-1 w-full max-w-5xl mx-auto px-6 pt-32 pb-24 flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
                {preset.nome}
              </h1>
              <p className="text-lg text-zinc-400 font-medium">{preset.banda}</p>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-zinc-800 text-zinc-300 text-sm font-bold tracking-wide uppercase shadow-sm">
              {preset.genero}
            </span>
          </div>
        </div>

        {preset.aviso && (
          <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5 text-yellow-500">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-sm font-medium leading-relaxed">{preset.aviso}</p>
          </div>
        )}

        {/* Cube Baby */}
        <div
          style={{
            backgroundColor: "#1a1a1e",
            borderRadius: 12,
            padding: "32px 20px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 28,
            boxShadow: "0 2px 16px rgba(0,0,0,0.4)",
            maxWidth: 720,
            margin: "0 auto",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", minWidth: 680, paddingRight: 20 }}>
            {settings.map((knob) => {
              let styleType: "smooth" | "dots" = "smooth";
              if (knob.id === "ircab" || knob.id === "type") styleType = "dots";

              const intervals = styleType === "dots" ? 8 : 9;
              const value = Math.min(Number(knob.value) || 0, intervals);
              const rotation = -135 + (value / intervals) * 270;

              return (
                <div key={`knob-${knob.id}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <Knob rotation={rotation} styleType={styleType} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: "rgba(255,255,255,0.85)", textTransform: "uppercase" as const }}>
                    {knob.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minWidth: 680, paddingLeft: 32, paddingRight: 20, paddingTop: 8 }}>
            {[0, 1, 2].map((i) => (
              <Footswitch key={i} />
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-8 shadow-lg">
          {settings.filter((s) => s.id !== "volume").map((setting) => (
            <div key={`slider-${setting.id}`} className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label
                  className={`text-sm font-bold tracking-wide transition-colors duration-500 ${
                    isHeavy && (setting.id === "gain" || setting.id === "type" || setting.id === "tone")
                      ? "text-white"
                      : "text-zinc-300"
                  }`}
                >
                  {setting.label}
                </label>
                <span
                  className={`text-sm font-mono font-medium px-2 py-0.5 rounded transition-all duration-500 ${
                    isHeavy && (setting.id === "gain" || setting.id === "type" || setting.id === "tone")
                      ? "bg-white text-black"
                      : "bg-zinc-800 text-white"
                  }`}
                >
                  {Number(setting.value || 0).toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="9"
                step="0.5"
                value={Number(setting.value || 0)}
                readOnly
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-not-allowed accent-white transition-all duration-500"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-8 border-t border-zinc-800/50">
          <div className="flex flex-col gap-3 items-center sm:items-start">
            <span className="text-sm font-medium text-zinc-400">Avalie este preset</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 transition-colors duration-300 ${
                      star <= rating ? "fill-yellow-500 text-yellow-500" : "text-zinc-700"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => setIsHeavy(!isHeavy)}
            className={`px-10 py-6 text-base font-bold rounded-full transition-all shadow-xl duration-500 ${
              isHeavy
                ? "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700"
                : "bg-white text-black hover:bg-zinc-200"
            }`}
          >
            {isHeavy ? "Voltar ao original" : "Mais pesado"}
          </Button>
        </div>
      </main>
    </div>
  );
}
