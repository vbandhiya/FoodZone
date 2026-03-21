import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'
import { SearchProvider } from './context/SearchContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SearchProvider>
        <BrowserRouter>
          <App />
          <ToastContainer position="bottom-right" />
        </BrowserRouter>
      </SearchProvider>
    </AuthProvider>
  </StrictMode>,
)
