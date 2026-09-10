import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function TemplateToyStory({ slug, eventoData }) {
  const [evento, setEvento] = useState(eventoData || null);
  const [loading, setLoading] = useState(!eventoData);
  const [nomeConvidado, setNomeConvidado] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');
  const [tempoRestante, setTempoRestante] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });

  const dataEvento = evento?.data_evento ? new Date(evento.data_evento) : new Date('2027-01-17T15:00:00');

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
  }, [dataEvento]);

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

  const imagemCapaUrl = evento.capa_url || "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop";
  const fotoAniversarianteUrl = evento.foto_url || "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop";
  
  const woodyUrl = "https://ohvuepigcgrfqscuscyb.supabase.co/storage/v1/object/sign/Resources/Toy-story/IMG-20260910-WA0013.jpg?token=eyJraWQiOiI0NDM2Mzc4NC03YzMxLTQ5ODctYTUxNi1jZmQwZTE3YjUzN2YiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJSZXNvdXJjZXMvVG95LXN0b3J5L0lNRy0yMDI2MDkxMC1XQTAwMTMuanBnIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4OTA1ODU4NSwiZXhwIjo0OTQyNjU4NTg1fQ.HlS9z1vvmOjnInRbYvLwhYrmFcoyOE0jpqDn77QrKMY";

  return (
    <div className="min-h-screen bg-sky-500 text-slate-900 flex flex-col items-center relative overflow-x-hidden">

      {/* Efeito visual de nuvens no fundo */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#fff_2px,transparent_2px)] [background-size:24px_24px]"></div>

      {/* BLOCO 1: CAPA */}
      <div className="w-full h-80 md:h-96 relative bg-sky-600 overflow-hidden flex items-end justify-center shadow-md">
        <img 
          src={imagemCapaUrl} 
          alt="Capa Toy Story"
          className="absolute inset-0 w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sky-950/90 via-sky-900/40 to-transparent"></div>

        {/* Foto do Aniversariante Flutuando */}
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

      {/* CORPO DA HISTÓRIA */}
      <div className="max-w-xl w-full relative z-10 px-4 pt-10 pb-16">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden p-6 md:p-10 text-center border-4 border-amber-400 relative">

          {/* FIGURINHA DO WOODY COM TRATAMENTO DE COR PARA SUMIR O FUNDO PRETO */}
          <div className="flex justify-center mb-6">
            <div className="bg-sky-950 p-3 rounded-2xl shadow-lg border-2 border-amber-400 transform -rotate-2 w-36 md:w-44 flex flex-col items-center">
              <img 
                src={woodyUrl} 
                alt="Xerife Woody" 
                className="w-full h-36 object-contain mix-blend-screen filter contrast-125"
              />
              <span className="block text-[10px] font-black text-amber-300 uppercase mt-2 tracking-widest">
                Xerife Woody 🤠
              </span>
            </div>
          </div>

          {/* TÍTULO DO LIVRO DE AVENTURAS */}
          <div className="my-2 flex flex-col items-center">
            <h1 className="text-5xl md:text-6xl font-black text-amber-300 uppercase tracking-wider drop-shadow-[0_4px_0_#1e3a8a] [-webkit-text-stroke:2px_#1e3a8a] transform -rotate-2">
              {evento.titulo}
            </h1>
            <div className="bg-red-600 text-yellow-300 text-base md:text-lg font-black px-6 py-1.5 rounded-xl uppercase tracking-widest shadow-lg border-2 border-amber-300 transform rotate-1 -mt-2">
              FAZ 1 ANO
            </div>
          </div>

          <p className="text-slate-700 mt-6 mb-6 text-base md:text-lg font-medium leading-relaxed">{evento.descricao}</p>

          {/* ATO 1: BALÃO DE FALA */}
          <div className="relative bg-sky-100 border-4 border-sky-400 rounded-3xl p-5 mb-8 text-left shadow-md">
            <div className="absolute -top-4 left-8 bg-amber-400 text-sky-950 text-xs font-black px-3 py-1 rounded-full border-2 border-sky-500 uppercase">
              🤠 Mensagem do Xerife
            </div>
            <p className="text-sky-950 font-bold text-sm md:text-base mt-2 italic">
              "Você é um amigo(a) e está convidado ! O nosso xerife mirim irá completar 1 aninho de pura alegria e a nossa caixa de brinquedos inteira está convocada para essa missão épica!"
            </p>
          </div>

          {/* CONTAGEM REGRESSIVA */}
          <div className="mb-8">
            <h3 className="text-xs font-black text-red-600 uppercase tracking-widest mb-2">⏱️ Lançamento do Foguete em:</h3>
            <div className="grid grid-cols-4 gap-2 bg-sky-950 text-white p-4 rounded-2xl border-2 border-amber-400 shadow-inner">
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
          </div>

          {/* ATO 2: O DIÁRIO DOS PAIS */}
          <div className="mb-8 bg-yellow-50 p-5 rounded-2xl border-2 border-yellow-300 text-left shadow-sm">
            <h3 className="text-xs font-black text-amber-800 uppercase tracking-wide mb-2">📖 Capítulo 1: O Primeiro Ano</h3>
            <p className="text-slate-700 text-sm leading-relaxed font-medium">
              "Parece que foi ontem que voamos para a paternidade. Cada sorriso, cada passinho e cada descoberta tornaram os nossos dias uma verdadeira aventura digna de cinema. Venham celebrar com a gente!"
            </p>
          </div>

          {/* VÍDEO DA AVENTURA */}
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

          {/* ATO 3: QUADRINHO DE LOCALIZAÇÃO */}
          <div className="mb-8 bg-amber-50 p-5 rounded-2xl border-2 border-amber-300 text-left shadow-sm">
            <h3 className="text-xs font-black text-red-600 uppercase tracking-wide mb-1">📍 Coordenadas da Base (Local)</h3>
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

          {/* ATO 4: ÁLBUM DE FIGURINHAS */}
          <div className="mb-8 text-left bg-sky-50 p-4 rounded-2xl border-2 border-sky-300">
            <h3 className="text-xs font-black text-sky-900 uppercase tracking-wide mb-3 text-center">📸 Álbum de Figurinhas do Herói</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="relative group overflow-hidden rounded-xl border-2 border-white shadow bg-white p-1 transform -rotate-1">
                <img src="https://ohvuepigcgrfqscuscyb.supabase.co/storage/v1/object/sign/Resources/ravi-um-aninho/IMG-20260907-WA0052.jpeg?token=eyJraWQiOiI0NDM2Mzc4NC03YzMxLTQ5ODctYTUxNi1jZmQwZTE3YjUzN2YiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJSZXNvdXJjZXMvcmF2aS11bS1hbmluaG8vSU1HLTIwMjYwOTA3LVdBMDA1Mi5qcGVnIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4OTA2NjA0OCwiZXhwIjoxODIwNjAyMDQ4fQ.Hf5Ylw9M6mftC_GsritOdm56vBrFocqYOl7iu-8_9DQ" alt="Momento 3" className="rounded-lg object-cover h-24 w-full" />
              </div>
              <div className="relative group overflow-hidden rounded-xl border-2 border-white shadow bg-white p-1 transform -rotate-1">
                <img src="https://ohvuepigcgrfqscuscyb.supabase.co/storage/v1/object/sign/Resources/ravi-um-aninho/IMG-20260907-WA0052.jpeg?token=eyJraWQiOiI0NDM2Mzc4NC03YzMxLTQ5ODctYTUxNi1jZmQwZTE3YjUzN2YiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJSZXNvdXJjZXMvcmF2aS11bS1hbmluaG8vSU1HLTIwMjYwOTA3LVdBMDA1Mi5qcGVnIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4OTA2NjA0OCwiZXhwIjoxODIwNjAyMDQ4fQ.Hf5Ylw9M6mftC_GsritOdm56vBrFocqYOl7iu-8_9DQ" alt="Momento 3" className="rounded-lg object-cover h-24 w-full" />
              </div>
              <div className="relative group overflow-hidden rounded-xl border-2 border-white shadow bg-white p-1 transform -rotate-1">
                <img src="https://ohvuepigcgrfqscuscyb.supabase.co/storage/v1/object/sign/Resources/ravi-um-aninho/IMG-20260907-WA0052.jpeg?token=eyJraWQiOiI0NDM2Mzc4NC03YzMxLTQ5ODctYTUxNi1jZmQwZTE3YjUzN2YiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJSZXNvdXJjZXMvcmF2aS11bS1hbmluaG8vSU1HLTIwMjYwOTA3LVdBMDA1Mi5qcGVnIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4OTA2NjA0OCwiZXhwIjoxODIwNjAyMDQ4fQ.Hf5Ylw9M6mftC_GsritOdm56vBrFocqYOl7iu-8_9DQ" alt="Momento 3" className="rounded-lg object-cover h-24 w-full" />
              </div>
              <div className="relative group overflow-hidden rounded-xl border-2 border-white shadow bg-white p-1 transform -rotate-1">
                <img src="https://ohvuepigcgrfqscuscyb.supabase.co/storage/v1/object/sign/Resources/ravi-um-aninho/IMG-20260907-WA0052.jpeg?token=eyJraWQiOiI0NDM2Mzc4NC03YzMxLTQ5ODctYTUxNi1jZmQwZTE3YjUzN2YiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJSZXNvdXJjZXMvcmF2aS11bS1hbmluaG8vSU1HLTIwMjYwOTA3LVdBMDA1Mi5qcGVnIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4OTA2NjA0OCwiZXhwIjoxODIwNjAyMDQ4fQ.Hf5Ylw9M6mftC_GsritOdm56vBrFocqYOl7iu-8_9DQ" alt="Momento 3" className="rounded-lg object-cover h-24 w-full" />
              </div>
              <div className="relative group overflow-hidden rounded-xl border-2 border-white shadow bg-white p-1 transform -rotate-1">
                <img src="https://ohvuepigcgrfqscuscyb.supabase.co/storage/v1/object/sign/Resources/ravi-um-aninho/IMG-20260907-WA0052.jpeg?token=eyJraWQiOiI0NDM2Mzc4NC03YzMxLTQ5ODctYTUxNi1jZmQwZTE3YjUzN2YiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJSZXNvdXJjZXMvcmF2aS11bS1hbmluaG8vSU1HLTIwMjYwOTA3LVdBMDA1Mi5qcGVnIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4OTA2NjA0OCwiZXhwIjoxODIwNjAyMDQ4fQ.Hf5Ylw9M6mftC_GsritOdm56vBrFocqYOl7iu-8_9DQ" alt="Momento 3" className="rounded-lg object-cover h-24 w-full" />
              </div>
              <div className="relative group overflow-hidden rounded-xl border-2 border-white shadow bg-white p-1 transform -rotate-1">
                <img src="https://ohvuepigcgrfqscuscyb.supabase.co/storage/v1/object/sign/Resources/ravi-um-aninho/IMG-20260907-WA0052.jpeg?token=eyJraWQiOiI0NDM2Mzc4NC03YzMxLTQ5ODctYTUxNi1jZmQwZTE3YjUzN2YiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJSZXNvdXJjZXMvcmF2aS11bS1hbmluaG8vSU1HLTIwMjYwOTA3LVdBMDA1Mi5qcGVnIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4OTA2NjA0OCwiZXhwIjoxODIwNjAyMDQ4fQ.Hf5Ylw9M6mftC_GsritOdm56vBrFocqYOl7iu-8_9DQ" alt="Momento 3" className="rounded-lg object-cover h-24 w-full" />
              </div>
              <div className="relative group overflow-hidden rounded-xl border-2 border-white shadow bg-white p-1 transform -rotate-1">
                <img src="https://ohvuepigcgrfqscuscyb.supabase.co/storage/v1/object/sign/Resources/ravi-um-aninho/IMG-20260907-WA0052.jpeg?token=eyJraWQiOiI0NDM2Mzc4NC03YzMxLTQ5ODctYTUxNi1jZmQwZTE3YjUzN2YiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJSZXNvdXJjZXMvcmF2aS11bS1hbmluaG8vSU1HLTIwMjYwOTA3LVdBMDA1Mi5qcGVnIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4OTA2NjA0OCwiZXhwIjoxODIwNjAyMDQ4fQ.Hf5Ylw9M6mftC_GsritOdm56vBrFocqYOl7iu-8_9DQ" alt="Momento 3" className="rounded-lg object-cover h-24 w-full" />
              </div>
              <div className="relative group overflow-hidden rounded-xl border-2 border-white shadow bg-white p-1 transform -rotate-1">
                <img src="https://ohvuepigcgrfqscuscyb.supabase.co/storage/v1/object/sign/Resources/ravi-um-aninho/IMG-20260907-WA0052.jpeg?token=eyJraWQiOiI0NDM2Mzc4NC03YzMxLTQ5ODctYTUxNi1jZmQwZTE3YjUzN2YiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJSZXNvdXJjZXMvcmF2aS11bS1hbmluaG8vSU1HLTIwMjYwOTA3LVdBMDA1Mi5qcGVnIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4OTA2NjA0OCwiZXhwIjoxODIwNjAyMDQ4fQ.Hf5Ylw9M6mftC_GsritOdm56vBrFocqYOl7iu-8_9DQ" alt="Momento 3" className="rounded-lg object-cover h-24 w-full" />
              </div>
              <div className="relative group overflow-hidden rounded-xl border-2 border-white shadow bg-white p-1 transform -rotate-1">
                <img src="https://ohvuepigcgrfqscuscyb.supabase.co/storage/v1/object/sign/Resources/ravi-um-aninho/IMG-20260907-WA0052.jpeg?token=eyJraWQiOiI0NDM2Mzc4NC03YzMxLTQ5ODctYTUxNi1jZmQwZTE3YjUzN2YiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJSZXNvdXJjZXMvcmF2aS11bS1hbmluaG8vSU1HLTIwMjYwOTA3LVdBMDA1Mi5qcGVnIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4OTA2NjA0OCwiZXhwIjoxODIwNjAyMDQ4fQ.Hf5Ylw9M6mftC_GsritOdm56vBrFocqYOl7iu-8_9DQ" alt="Momento 3" className="rounded-lg object-cover h-24 w-full" />
              </div>
            </div>
          </div>

          {/* FORMULÁRIO DE RSVP */}
          <div className="bg-sky-100 p-6 rounded-2xl border-2 border-sky-300 mb-8 shadow-sm">
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

          {/* CAIXA DE TESOUROS (PIX) */}
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
