"use client";

import { useState, useEffect, use } from "react";
import { Header } from "@/components/header";
import { Star, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function PresetDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [rating, setRating] = useState(0);
  const [preset, setPreset] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isHeavy, setIsHeavy] = useState(false);

  useEffect(() => {
    async function fetchPreset() {
      const { data, error } = await supabase
        .from('presets')
        .select('*')
        .eq('id', resolvedParams.id)
        .single();
      
      if (data) {
        setPreset(data);
      }
      setLoading(false);
    }
    fetchPreset();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="fixed -inset-[50px] bg-stars pointer-events-none z-0" />
        <Header />
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin z-10"></div>
      </div>
    );
  }

  if (!preset) {
    return (
      <div className="relative min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <div className="fixed -inset-[50px] bg-stars pointer-events-none z-0" />
        <Header />
        <div className="z-10 flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold">Preset não encontrado</h2>
          <Button onClick={() => window.history.back()} className="bg-white text-black hover:bg-zinc-200 px-6 py-2 rounded-full font-bold">
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const settings = [
    { id: "ircab", label: "IR CAB", value: preset.ir_cab },
    { id: "reverb", label: "REVERB", value: preset.reverb },
    { id: "mix", label: "MIX", value: preset.mix },
    { id: "fb", label: "FB", value: preset.fb },
    { id: "time", label: "TIME", value: preset.time_val },
    { id: "mod", label: "MOD", value: preset.mod },
    { id: "tone", label: "TONE", value: isHeavy ? Math.min(9, (Number(preset.tone) || 0) + 0.5) : preset.tone },
    { id: "gain", label: "GAIN", value: isHeavy ? Math.min(9, (Number(preset.gain) || 0) + 1) : preset.gain },
    { id: "type", label: "TYPE", value: isHeavy ? Math.min(9, (Number(preset.type) || 0) + 1) : preset.type },
  ];

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-x-hidden flex flex-col">
      {/* Background de Estrelas Fixo */}
      <div className="fixed -inset-[50px] bg-stars pointer-events-none z-0" />

      <Header />

      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-6 pt-32 pb-24 flex flex-col gap-10">
        
        {/* Cabeçalho do Preset */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
                {preset.nome}
              </h1>
              <p className="text-lg text-zinc-400 font-medium">
                {preset.banda}
              </p>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-zinc-800 text-zinc-300 text-sm font-bold tracking-wide uppercase shadow-sm">
              {preset.genero}
            </span>
          </div>
        </div>

        {/* Warning Box */}
        {preset.aviso && (
          <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5 text-yellow-500">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-sm font-medium leading-relaxed">{preset.aviso}</p>
          </div>
        )}

        {/* Visual da Cube Baby (2D) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col gap-6 shadow-2xl overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] gap-4">
            {settings.map((knob) => {
              const isDiscrete = knob.id === "ircab" || knob.id === "type";
              const intervals = isDiscrete ? 8 : 9;
              
              const safeValue = Math.min(Number(knob.value) || 0, intervals);
              const rotation = -135 + (safeValue / intervals) * 270;

              return (
                <div key={`knob-${knob.id}`} className="flex flex-col items-center gap-4">
                  {/* Círculo do Knob com Escala */}
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    {/* Escala (Dots ou Ticks) */}
                    {isDiscrete ? (
                      Array.from({ length: 9 }).map((_, i) => {
                        const angle = -135 + (i * 270) / 8;
                        return (
                          <div key={`dot-${i}`} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
                            <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full mx-auto" />
                          </div>
                        );
                      })
                    ) : (
                      Array.from({ length: 10 }).map((_, i) => {
                        const angle = -135 + (i * 270) / 9;
                        return (
                          <div key={`tick-${i}`} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
                            <div className="w-[2px] h-2 bg-zinc-400 rounded-full mx-auto" />
                          </div>
                        );
                      })
                    )}

                    {/* Knob Físico */}
                    <div className="relative w-11 h-11 rounded-full bg-zinc-950 border-2 border-zinc-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] z-10 flex items-center justify-center">
                      <div 
                        className="absolute w-1 h-3 bg-white rounded-full top-1 origin-[50%_18px] transition-transform duration-500 ease-out"
                        style={{ transform: `rotate(${rotation}deg)` }}
                      />
                    </div>
                  </div>
                  {/* Label */}
                  <span className={`text-[10px] font-bold tracking-wider transition-colors duration-500 ${isHeavy && (knob.id === 'gain' || knob.id === 'type' || knob.id === 'tone') ? 'text-white' : 'text-zinc-400'}`}>
                    {knob.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sliders Horizontais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-8 shadow-lg">
          {settings.map((setting) => (
            <div key={`slider-${setting.id}`} className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className={`text-sm font-bold tracking-wide transition-colors duration-500 ${isHeavy && (setting.id === 'gain' || setting.id === 'type' || setting.id === 'tone') ? 'text-white' : 'text-zinc-300'}`}>{setting.label}</label>
                <span className={`text-sm font-mono font-medium px-2 py-0.5 rounded transition-all duration-500 ${isHeavy && (setting.id === 'gain' || setting.id === 'type' || setting.id === 'tone') ? 'bg-white text-black' : 'bg-zinc-800 text-white'}`}>
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

        {/* Footer do Preset: Avaliação e Ação */}
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
                    className={`w-7 h-7 transition-colors duration-300 ${star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-700'}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <Button 
            size="lg" 
            onClick={() => setIsHeavy(!isHeavy)}
            className={`px-10 py-6 text-base font-bold rounded-full transition-all shadow-xl duration-500 ${isHeavy ? 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700' : 'bg-white text-black hover:bg-zinc-200'}`}
          >
            {isHeavy ? "Voltar ao original" : "Mais pesado"}
          </Button>
        </div>

      </main>
    </div>
  );
}
