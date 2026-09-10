import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // ou o seu roteador atual
import { supabase } from './services/supabaseClient';

// Importa os templates disponíveis
import TemplateAniversario1 from './templates/aniversario/TemplateAniversario1';
import TemplateToyStory from './templates/aniversario/TemplateToyStory';

export default function VisualizadorConvite() {
  const { slug } = useParams();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (!error) setEvento(data);
      setLoading(false);
    }
    carregarDados();
  }, [slug]);

  if (loading) return <div>Carregando...</div>;
  if (!evento) return <div>Convite não encontrado.</div>;

  // Lógica de escolha do template com base no que está salvo no banco
  switch (evento.template) {
    case 'toy-story':
      return <TemplateToyStory slug={slug} eventoData={evento} />;
    default:
      return <TemplateAniversario1 slug={slug} eventoData={evento} />;
  }
}
