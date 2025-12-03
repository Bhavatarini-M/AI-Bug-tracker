import React from 'react'
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react'

const getSeverityColor = (severity) => {
  if (severity >= 4) return { bg: 'bg-red-100', border: 'border-red-300', badge: 'bg-red-600', text: 'text-red-900', icon: AlertCircle }
  if (severity >= 3) return { bg: 'bg-yellow-100', border: 'border-yellow-300', badge: 'bg-yellow-600', text: 'text-yellow-900', icon: AlertTriangle }
  if (severity >= 2) return { bg: 'bg-blue-100', border: 'border-blue-300', badge: 'bg-blue-600', text: 'text-blue-900', icon: Info }
  return { bg: 'bg-green-100', border: 'border-green-300', badge: 'bg-green-600', text: 'text-green-900', icon: CheckCircle }
}

export default function ResultsPanel({ analysis, loading, error }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Analyzing log file...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Analysis Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return null
  }

  const colors = getSeverityColor(analysis.severity_rating || 1)
  const SeverityIcon = colors.icon

  return (
    <div className={`bg-white rounded-lg shadow-lg p-8 border-l-4 ${colors.border}`}>
      {/* Header with Severity Badge */}
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${colors.bg} ${colors.text}`}>
          <SeverityIcon className="w-5 h-5" />
          <span className="font-semibold">Severity: {analysis.severity_rating}/5</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Issue Type */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-600 mb-2">ISSUE TYPE</p>
          <p className="text-lg font-bold text-gray-800">{analysis.issue_type || 'N/A'}</p>
        </div>

        {/* Timestamp */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-600 mb-2">ANALYZED AT</p>
          <p className="text-lg font-bold text-gray-800">
            {analysis.timestamp ? new Date(analysis.timestamp).toLocaleString() : 'N/A'}
          </p>
        </div>
      </div>

      {/* Root Cause */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm font-semibold text-blue-900 mb-2">ROOT CAUSE</p>
        <p className="text-gray-700 leading-relaxed">{analysis.root_cause || 'N/A'}</p>
      </div>

      {/* Suggested Fix */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm font-semibold text-green-900 mb-2">SUGGESTED FIX</p>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{analysis.suggested_fix || 'N/A'}</p>
      </div>

      {/* Severity Rating Details */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm font-semibold text-yellow-900 mb-3">SEVERITY BREAKDOWN</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${colors.badge}`}
            style={{ width: `${(analysis.severity_rating / 5) * 100}%` }}
          ></div>
        </div>
        <div className="mt-2 grid grid-cols-5 gap-2 text-xs text-center">
          <span className="text-gray-600">Low</span>
          <span className="text-gray-600">-</span>
          <span className="text-gray-600">Medium</span>
          <span className="text-gray-600">-</span>
          <span className="text-gray-600">Critical</span>
        </div>
      </div>
    </div>
  )
}
