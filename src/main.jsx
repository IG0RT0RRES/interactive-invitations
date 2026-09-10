import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- Importante
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* O BrowserRouter precisa envolver o App para o useParams funcionar */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)
