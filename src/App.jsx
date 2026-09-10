import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { supabase } from './services/supabaseClient';

import TemplateAniversario1 from './templates/aniversario/TemplateAniversario1';
import TemplateToyStory from './templates/aniversario/TemplateToyStory';

function VisualizadorConvite() {
  const { slug } = useParams();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [dadosBrutos, setDadosBrutos] = useState(null);

  useEffect(() => {
    async function carregarEvento() {
      try {
        console.log("Buscando slug:", slug);
        const { data, error } = await supabase
          .from('eventos')
          .select('*')
          .ilike('slug', slug)
          .single();

        console.log("Retorno Supabase - Data:", data, "Erro:", error);
        setDadosBrutos({ data, error });

        if (error) throw error;
        setEvento(data);
      } catch (err) {
        console.error('Erro ao carregar convite:', err);
        setErro(err.message || 'Convite não encontrado.');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      carregarEvento();
    } else {
      setLoading(false);
      setErro('Nenhum slug fornecido na URL.');
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-200 bg-slate-900 p-6 text-center font-mono">
        <p className="text-xl mb-4 animate-pulse">Carregando dados do Supabase...</p>
        <p className="text-sm text-yellow-400 mb-2">Slug procurado: {slug || 'Nenhum'}</p>
        <p className="text-xs text-cyan-400">Caminho real na barra: {window.location.pathname}</p>
      </div>
    );
  }

  console.log("Slug atual:", slug);

  if (erro || !evento) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6 font-mono text-left max-w-2xl mx-auto">
        <div className="bg-red-950/80 border-2 border-red-500 p-6 rounded-2xl w-full shadow-2xl">
          <h1 className="text-xl font-bold text-red-400 mb-3">⚠️ Diagnóstico de Erro</h1>
          <p className="text-sm mb-2"><strong className="text-yellow-300">Slug acessado na URL:</strong> {slug || 'undefined'}</p>
          <p className="text-sm mb-2"><strong className="text-cyan-300">Caminho real (pathname):</strong> {window.location.pathname}</p>
          <p className="text-sm mb-4"><strong className="text-red-300">Mensagem de Erro:</strong> {erro}</p>

          <div className="bg-black/60 p-4 rounded-xl overflow-x-auto text-xs text-slate-300 border border-red-900 mb-4">
            <p className="font-bold text-amber-400 mb-1">Retorno completo do Supabase:</p>
            <pre>{JSON.stringify(dadosBrutos, null, 2)}</pre>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            💡 <strong>Dica:</strong> Se o caminho real mostrar <code>/convite/Ravi-1-aninho</code> mas o slug continuar vazio, o problema está na estrutura das rotas do componente de rotas. Se o retorno do Supabase for <code>null</code>, valide se o slug cadastrado no banco bate perfeitamente.
          </p>
        </div>
      </div>
    );
  }

  switch (evento.template) {
    case 'toy-story':
      return <TemplateToyStory slug={slug} eventoData={evento} />;
    default:
      return <TemplateAniversario1 slug={slug} eventoData={evento} />;
  }
}

export default function App() {
  return (
    <Routes>
      <Route path="/convite/:slug" element={<VisualizadorConvite />} />
      <Route path="/" element={
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-mono">
          <p>Plataforma de Convites Digitais Ativa 🚀</p>
        </div>
      } />
    </Routes>
  );
}
