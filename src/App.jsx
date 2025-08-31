import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NewReflectionPage from './pages/NewReflectionPage'
import ReflectionDetailPage from './pages/ReflectionDetailPage'
import HistoryPage from './pages/HistoryPage'
import { ReflectionProvider } from './context/ReflectionContext'

function App() {
  return (
    <ReflectionProvider>
      <Router>
        <div className="mobile-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/new" element={<NewReflectionPage />} />
            <Route path="/reflection/:id" element={<ReflectionDetailPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </div>
      </Router>
    </ReflectionProvider>
  )
}

export default App
