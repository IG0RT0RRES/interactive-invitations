import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function TemplateToyStory({ slug, eventoData }) {
  // Se eventoData já vier pronto do roteador dinâmico, ótimo. Se não, busca direto.
  const [evento, setEvento] = useState(eventoData || null);
  const [loading, setLoading] = useState(!eventoData);
  const [nomeConvidado, setNomeConvidado] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');
  const [tempoRestante, setTempoRestante] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });

  const dataEvento = new Date('2026-10-15T15:00:00');

  useEffect(() => {
    if (!evento) {
      async function carregarEvento() {
        try {
          const { data, error } = await supabase
            .from('eventos')
            .select('*')
            .eq('slug', slug)
            .single();

          if (error) throw error;
          setEvento(data);
        } catch (err) {
          console.error('Erro ao carregar convite:', err);
          setErro('Convite não encontrado ou indisponível.');
        } finally {
          setLoading(false);
        }
      }
      if (slug) carregarEvento();
    }
  }, [slug, evento]);

  useEffect(() => {
    const timer = setInterval(() => {
      const agora = new Date();
      const diferenca = dataEvento - agora;

      if (diferenca > 0) {
        const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
        const minutos = Math.floor((diferenca / 1000 / 60) % 60);
        const segundos = Math.floor((diferenca / 1000) % 60);
        setTempoRestante({ dias, horas, minutos, segundos });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRSVP = async (e) => {
    e.preventDefault();
    if (!nomeConvidado.trim()) return;

    try {
      const { error } = await supabase.from('rsvps').insert([
        {
          evento_id: evento.id,
          nome_convidado: nomeConvidado,
        }
      ]);

      if (error) throw error;
      setEnviado(true);
    } catch (err) {
      console.error('Erro ao salvar RSVP:', err);
      alert('Ocorreu um erro ao confirmar presença. Tente novamente.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-blue-900 bg-sky-200 font-bold">Preparando o brinquedo...</div>;
  }

  if (erro || !evento) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-sky-900 text-white">
        <h1 className="text-2xl font-bold text-red-400 mb-2">Ops!</h1>
        <p className="text-sky-200">{erro || "Convite não encontrado."}</p>
      </div>
    );
  }

  // Imagens temáticas padrão de Toy Story (céu com nuvens)
  const imagemCapaUrl = evento.capa_url || "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop";
  const fotoAniversarianteUrl = evento.foto_url || "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-sky-500 text-slate-900 flex flex-col items-center relative overflow-hidden">
      
      {/* Efeito visual de nuvens no fundo (estilo Toy Story) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#fff_2px,transparent_2px)] [background-size:24px_24px]"></div>

      {/* Bloco da Capa Estilo Toy Story */}
      <div className="w-full h-80 md:h-96 relative bg-sky-600 overflow-hidden flex items-end justify-center shadow-md">
        <img 
          src={imagemCapaUrl} 
          alt="Capa Toy Story"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sky-950/80 via-sky-900/30 to-transparent"></div>

        {/* Foto do Aniversariante Flutuando em Destaque */}
        <div className="relative z-10 -mb-6 flex flex-col items-center">
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full p-2 bg-gradient-to-tr from-amber-400 via-red-500 to-yellow-300 shadow-2xl">
            <img 
              src={fotoAniversarianteUrl} 
              alt="Aniversariante" 
              className="w-full h-full object-cover rounded-full border-4 border-white shadow-inner"
            />
          </div>
          <span className="mt-3 bg-amber-400 text-sky-950 text-xs md:text-sm font-black px-5 py-1.5 rounded-full shadow-lg border-2 border-red-500 uppercase tracking-widest">
            ⭐ Ao Infinito e Além! ⭐
          </span>
        </div>
      </div>

      {/* Card Principal de Conteúdo */}
      <div className="max-w-xl w-full relative z-10 px-4 pt-10 pb-16">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden p-6 md:p-10 text-center border-4 border-amber-400">
          
          {/* Cabeçalho */}
          <span className="text-xs font-black tracking-widest text-red-600 uppercase bg-red-100 px-3 py-1 rounded-full border border-red-300">
            Convite Oficial do Andy
          </span>
          <h1 className="text-4xl md:text-5xl font-black mt-4 mb-3 text-sky-950 tracking-tight">{evento.titulo}</h1>
          <p className="text-slate-700 mb-6 text-base md:text-lg font-medium leading-relaxed">{evento.descricao}</p>

          {/* Mensagem Temática */}
          <div className="bg-sky-50 p-4 rounded-2xl border-2 border-dashed border-sky-300 mb-6 text-sm text-sky-900 font-medium italic">
            "Você tem um amigo em mim! Venha comemorar conosco essa grande aventura de 1 aninho!"
          </div>

          {/* Contagem Regressiva Estilo Alvo/Brinquedo */}
          <div className="grid grid-cols-4 gap-2 mb-8 bg-sky-950 text-white p-4 rounded-2xl border-2 border-amber-400 shadow-inner">
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-black text-amber-400">{tempoRestante.dias}</span>
              <span className="text-[10px] uppercase font-bold text-sky-200">Dias</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-black text-amber-400">{tempoRestante.horas}</span>
              <span className="text-[10px] uppercase font-bold text-sky-200">Horas</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-black text-amber-400">{tempoRestante.minutos}</span>
              <span className="text-[10px] uppercase font-bold text-sky-200">Min</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-black text-amber-400">{tempoRestante.segundos}</span>
              <span className="text-[10px] uppercase font-bold text-sky-200">Seg</span>
            </div>
          </div>

          {/* Bloco de Vídeo */}
          {evento.video_url && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg aspect-video bg-black border-2 border-sky-400 flex items-center justify-center">
              <iframe 
                src={evento.video_url} 
                title="Vídeo do Aniversário" 
                className="w-full h-full"
                allowFullScreen 
              />
            </div>
          )}

          {/* Localização da Festa */}
          <div className="mb-8 bg-amber-50 p-5 rounded-2xl border-2 border-amber-300 text-left">
            <h3 className="text-xs font-black text-red-600 uppercase tracking-wide mb-1">📍 Local da Missão</h3>
            <p className="text-slate-800 font-bold mb-3">Salão de Festas Quarto do Andy - Rua dos Brinquedos, 1995</p>
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-xs font-bold bg-amber-400 hover:bg-amber-500 text-sky-950 px-4 py-2 rounded-xl shadow transition"
            >
              Abrir no Google Maps 🚀
            </a>
          </div>

          {/* Formulário de RSVP */}
          <div className="bg-sky-100 p-6 rounded-2xl border-2 border-sky-300 mb-8">
            <h2 className="text-xl font-black mb-3 text-sky-950">Vai participar da brincadeira?</h2>
            {enviado ? (
              <div className="text-emerald-700 font-bold py-3 bg-emerald-100 rounded-xl border border-emerald-400">
                Missão cumprida! Presença confirmada, {nomeConvidado}! 🤠
              </div>
            ) : (
              <form onSubmit={handleRSVP} className="flex flex-col gap-3">
                <input 
                  type="text" 
                  placeholder="Nome do Convidado / Família" 
                  value={nomeConvidado}
                  onChange={(e) => setNomeConvidado(e.target.value)}
                  required
                  className="px-4 py-3 rounded-xl bg-white border-2 border-sky-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                />
                <button 
                  type="submit" 
                  className="bg-red-600 hover:bg-red-500 text-white font-black py-3 rounded-xl transition shadow-lg shadow-red-600/30 cursor-pointer uppercase tracking-wider"
                >
                  Confirmar Presença 🎯
                </button>
              </form>
            )}
          </div>

          {/* Área de Presentes / Pix */}
          {evento.chave_pix && (
            <div className="border-t-2 border-slate-200 pt-6">
              <h2 className="text-lg font-black mb-2 text-sky-950">Caixa de Tesouros (Pix)</h2>
              <p className="text-xs text-slate-600 mb-3 font-medium">Deseja enviar uma lembrança para o aniversariante? Use a chave Pix:</p>
              <div className="bg-sky-950 p-3.5 rounded-xl font-mono text-sm text-amber-300 select-all border border-amber-400 font-bold">
                {evento.chave_pix}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
