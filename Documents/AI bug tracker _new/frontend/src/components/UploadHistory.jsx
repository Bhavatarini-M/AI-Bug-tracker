import React, { useState, useEffect } from 'react'
import { Trash2, Eye, Loader } from 'lucide-react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const getSeverityColor = (severity) => {
  if (severity >= 4) return 'bg-red-100 text-red-800'
  if (severity >= 3) return 'bg-yellow-100 text-yellow-800'
  if (severity >= 2) return 'bg-blue-100 text-blue-800'
  return 'bg-green-100 text-green-800'
}

const getStatusColor = (status) => {
  if (status === 'completed') return 'bg-green-100 text-green-800'
  if (status === 'failed') return 'bg-red-100 text-red-800'
  return 'bg-yellow-100 text-yellow-800'
}

export default function UploadHistory() {
  const [uploads, setUploads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedUpload, setSelectedUpload] = useState(null)

  useEffect(() => {
    fetchUploads()
    const interval = setInterval(fetchUploads, 3000)
    return () => clearInterval(interval)
  }, [])

  const fetchUploads = async () => {
    try {
      const response = await axios.get(`${API_URL}/uploads`)
      setUploads(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch uploads')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (uploadId) => {
    if (!confirm('Are you sure you want to delete this upload?')) return

    try {
      await axios.delete(`${API_URL}/uploads/${uploadId}`)
      setUploads(uploads.filter(u => u.id !== uploadId))
    } catch (err) {
      setError('Failed to delete upload')
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 flex items-center justify-center min-h-64">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Upload History</h2>
        <p className="text-gray-600 text-sm mt-1">{uploads.length} files uploaded</p>
      </div>

      {uploads.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p>No uploads yet. Start by uploading a log file!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Filename</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Upload Time</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Size</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Severity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((upload) => (
                <tr key={upload.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{upload.filename}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(upload.upload_time).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {(upload.file_size / 1024).toFixed(2)} KB
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(upload.status)}`}>
                      {upload.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {upload.severity ? (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(upload.severity)}`}>
                        {upload.severity}/5
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => setSelectedUpload(upload)}
                      title="View details"
                      className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(upload.id)}
                      title="Delete"
                      className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">{selectedUpload.filename}</h3>
              <button
                onClick={() => setSelectedUpload(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">Status</p>
                <p className="text-gray-800">{selectedUpload.status}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Uploaded</p>
                <p className="text-gray-800">{new Date(selectedUpload.upload_time).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">File Size</p>
                <p className="text-gray-800">{(selectedUpload.file_size / 1024).toFixed(2)} KB</p>
              </div>
              {selectedUpload.results && (
                <div>
                  <p className="text-sm font-semibold text-gray-600">Issue Type</p>
                  <p className="text-gray-800">{selectedUpload.results.issue_type}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
