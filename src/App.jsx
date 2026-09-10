import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import TemplateAniversario1 from './templates/aniversario/TemplateAniversario1';

function Home() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Plataforma de Convites Digitais</h1>
      <p className="text-gray-600 mb-4">Seja bem-vindo ao seu painel de controle e portfólio.</p>
      <p className="text-sm text-purple-600 font-medium">
        Para testar o convite do seu filho, acesse na barra de endereços: <code className="bg-gray-100 p-1 rounded">/convite/aniversario-do-lucas</code>
      </p>
    </div>
  );
}

function PaginaConviteDinamico() {
  const { slug } = useParams();
  return <TemplateAniversario1 slug={slug} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/convite/:slug" element={<PaginaConviteDinamico />} />
      </Routes>
    </BrowserRouter>
  );
}