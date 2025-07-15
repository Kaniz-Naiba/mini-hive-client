import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext' // ✅ make sure the path is correct

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>     {/* ✅ wrap App inside AuthProvider */}
      <App />
    </AuthProvider>
  </StrictMode>
)
