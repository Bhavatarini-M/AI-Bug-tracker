import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function LogViewer({ originalLog, redactedLog }) {
  const [showRedacted, setShowRedacted] = useState(true)

  const displayLog = showRedacted ? redactedLog : originalLog

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Log Content</h2>
        <button
          onClick={() => setShowRedacted(!showRedacted)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showRedacted ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          {showRedacted ? 'Show Original' : 'Show Redacted'}
        </button>
      </div>

      <div className="mb-3">
        <p className="text-sm font-semibold text-gray-600">
          {showRedacted ? '🔒 Redacted Log' : '📄 Original Log'}
        </p>
      </div>

      <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96 border border-gray-700">
        <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap break-words">
          {displayLog || 'No log content to display'}
        </pre>
      </div>

      {showRedacted && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <strong>ℹ️ Note:</strong> Sensitive information like IPs, API keys, file paths, and usernames have been redacted before sending to AI.
        </div>
      )}
    </div>
  )
}
