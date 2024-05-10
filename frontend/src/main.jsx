import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {NewBingoContextProvider} from './pages/customizeBingoView/context/NewBingoContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NewBingoContextProvider>
    <App />
    </NewBingoContextProvider>
  </React.StrictMode>,
)
