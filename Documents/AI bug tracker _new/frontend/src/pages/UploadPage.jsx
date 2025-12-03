import React from 'react'
import FileUploadArea from '../components/FileUploadArea'
import { Upload as UploadIcon } from 'lucide-react'

export default function UploadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <UploadIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-800">Upload & Analyze</h1>
        </div>
        <p className="text-gray-600">Upload your log files for intelligent analysis and debugging assistance</p>
      </div>

      <FileUploadArea />

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">🔒</div>
          <h3 className="font-bold text-gray-800 mb-2">Secure Redaction</h3>
          <p className="text-gray-600 text-sm">
            Sensitive data like IPs, API keys, and passwords are automatically redacted
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-purple-600 mb-2">⚡</div>
          <h3 className="font-bold text-gray-800 mb-2">AI Analysis</h3>
          <p className="text-gray-600 text-sm">
            Get instant analysis with root cause, suggested fixes, and severity ratings
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-green-600 mb-2">🚀</div>
          <h3 className="font-bold text-gray-800 mb-2">Smart Caching</h3>
          <p className="text-gray-600 text-sm">
            Similar logs are deduplicated to save time and resources
          </p>
        </div>
      </div>
    </div>
  )
}
