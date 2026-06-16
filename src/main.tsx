import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { CharacterProvider } from '@/store/CharacterProvider'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CharacterProvider>
      <App />
    </CharacterProvider>
  </React.StrictMode>
)
