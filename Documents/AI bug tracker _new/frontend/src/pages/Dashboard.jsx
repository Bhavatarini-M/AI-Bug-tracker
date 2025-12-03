import React from 'react'
import UploadHistory from '../components/UploadHistory'
import { BarChart3 } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        </div>
        <p className="text-gray-600">View all your uploaded logs and their analysis results</p>
      </div>

      <UploadHistory />
    </div>
  )
}
