import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function TemplateAniversario1({ slug }) {
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nomeConvidado, setNomeConvidado] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');
  const [tempoRestante, setTempoRestante] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });

  // Data alvo da festa (exemplo para 2026, você pode ajustar depois via banco ou props)
  const dataEvento = new Date('2026-10-15T15:00:00');

  useEffect(() => {
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

    if (slug) {
      carregarEvento();
    }
  }, [slug]);

  // Lógica da Contagem Regressiva
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
    return <div className="min-h-screen flex items-center justify-center text-gray-500 bg-gray-50">Carregando convite...</div>;
  }

  if (erro || !evento) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gray-50">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Ops!</h1>
        <p className="text-gray-600">{erro || "Convite não encontrado."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 py-8">
      <div className="max-w-xl w-full bg-slate-800/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden p-6 md:p-10 text-center border border-slate-700">
        
        {/* Cabeçalho */}
        <span className="text-xs font-bold tracking-widest text-purple-400 uppercase bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800/50">
          Você é o nosso convidado especial
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-3 text-white tracking-tight">{evento.titulo}</h1>
        <p className="text-slate-300 mb-6 text-base md:text-lg leading-relaxed">{evento.descricao}</p>

        {/* Mensagem dos Pais */}
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/60 mb-6 text-sm text-slate-300 italic">
          "Passou um ano desde o dia mais feliz das nossas vidas. Venha comemorar conosco o primeiro aninho do nosso pequeno!"
        </div>

        {/* Contagem Regressiva */}
        <div className="grid grid-cols-4 gap-2 mb-8 bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-bold text-purple-400">{tempoRestante.dias}</span>
            <span className="text-xs uppercase text-slate-400">Dias</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-bold text-purple-400">{tempoRestante.horas}</span>
            <span className="text-xs uppercase text-slate-400">Horas</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-bold text-purple-400">{tempoRestante.minutos}</span>
            <span className="text-xs uppercase text-slate-400">Min</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-bold text-purple-400">{tempoRestante.segundos}</span>
            <span className="text-xs uppercase text-slate-400">Seg</span>
          </div>
        </div>

        {/* Bloco de Vídeo */}
        {evento.video_url && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-lg aspect-video bg-black border border-slate-700 flex items-center justify-center">
            <iframe 
              src={evento.video_url} 
              title="Vídeo do Aniversário" 
              className="w-full h-full"
              allowFullScreen 
            />
          </div>
        )}

        {/* Localização da Festa */}
        <div className="mb-8 bg-slate-900/50 p-5 rounded-2xl border border-slate-700 text-left">
          <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-1">Local da Festa</h3>
          <p className="text-slate-200 font-medium mb-3">Salão de Festas Alegria & Cia - Rua das Flores, 123 - Centro</p>
          <a 
            href="https://maps.google.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-purple-300 px-4 py-2 rounded-xl border border-purple-500/30 transition"
          >
            Ver no Google Maps 📍
          </a>
        </div>

        {/* Formulário de RSVP */}
        <div className="bg-purple-950/30 p-6 rounded-2xl border border-purple-900/40 mb-8">
          <h2 className="text-xl font-bold mb-3 text-purple-200">Confirme sua Presença</h2>
          {enviado ? (
            <div className="text-emerald-400 font-medium py-3 bg-emerald-950/40 rounded-xl border border-emerald-800/50">
              Presença confirmada com sucesso! Obrigado, {nomeConvidado}! 🎉
            </div>
          ) : (
            <form onSubmit={handleRSVP} className="flex flex-col gap-3">
              <input 
                type="text" 
                placeholder="Seu nome completo" 
                value={nomeConvidado}
                onChange={(e) => setNomeConvidado(e.target.value)}
                required
                className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-purple-900/40 cursor-pointer"
              >
                Confirmar Presença
              </button>
            </form>
          )}
        </div>

        {/* Área de Presentes / Pix */}
        {evento.chave_pix && (
          <div className="border-t border-slate-700 pt-6">
            <h2 className="text-lg font-bold mb-2 text-white">Lista de Presentes (Pix)</h2>
            <p className="text-sm text-slate-400 mb-3">Caso queira presentear o aniversariante, utilize a chave Pix abaixo:</p>
            <div className="bg-slate-900 p-3.5 rounded-xl font-mono text-sm text-purple-300 select-all border border-slate-700/80">
              {evento.chave_pix}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}