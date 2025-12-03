import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bug, Home, Upload } from 'lucide-react'

export default function Navigation() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Bug className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">AI Bug Tracker</h1>
          </div>
          
          <div className="flex gap-8">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/')
                  ? 'bg-white text-blue-600'
                  : 'text-white hover:bg-blue-500'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/upload"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/upload')
                  ? 'bg-white text-blue-600'
                  : 'text-white hover:bg-blue-500'
              }`}
            >
              <Upload className="w-5 h-5" />
              <span>Upload Log</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
