import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from './services/supabaseClient';

// Importe os dois templates
import TemplateAniversario1 from './templates/aniversario/TemplateAniversario1';
import TemplateToyStory from './templates/aniversario/TemplateToyStory';

export default function VisualizadorConvite() {
  const { slug } = useParams();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

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
        setErro('Convite não encontrado.');
      } finally {
        setLoading(false);
      }
    }

    if (slug) carregarEvento();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400 bg-slate-900">Carregando...</div>;
  }

  if (erro || !evento) {
    return <div className="min-h-screen flex items-center justify-center text-red-400 bg-slate-900">{erro || "Convite não encontrado."}</div>;
  }

  // A Mágica Acontece Aqui: O sistema olha a coluna "template" do Supabase e escolhe o arquivo certo!
  switch (evento.template) {
    case 'toy-story':
      return <TemplateToyStory slug={slug} eventoData={evento} />;
    default:
      return <TemplateAniversario1 slug={slug} eventoData={evento} />;
  }
}
