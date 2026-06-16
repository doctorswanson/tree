import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { CharacterProvider } from '@/store/CharacterProvider'
import PasscodeGate from '@/components/layout/PasscodeGate'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PasscodeGate>
      <CharacterProvider>
        <App />
      </CharacterProvider>
    </PasscodeGate>
  </React.StrictMode>
)
