'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  onImageUpload: (file: File) => void
  loading?: boolean
}

export default function ImageUpload({ onImageUpload, loading }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    multiple: false,
    disabled: loading,
  })

  const handleAnalyze = () => {
    if (selectedFile) onImageUpload(selectedFile)
  }

  const handleClear = () => {
    setPreview(null)
    setSelectedFile(null)
  }

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-outfit font-semibold text-emerald-100 mb-4">Upload Image</h2>

      {!preview ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-emerald-400 bg-emerald-500/10 pulse-ring'
              : 'border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/5'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="icon-circle w-14 h-14 mx-auto mb-4">
            <Upload className="w-6 h-6 text-emerald-400" />
          </div>
          {isDragActive ? (
            <p className="text-emerald-300 text-base">Drop the image here...</p>
          ) : (
            <>
              <p className="text-emerald-200/60 text-base mb-1">Drag & drop an image here, or click to select</p>
              <p className="text-emerald-200/40 text-sm">Supports: JPG, JPEG, PNG</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden border border-emerald-500/20">
            <img src={preview} alt="Preview" className="w-full h-auto max-h-96 object-contain bg-dark-800" />
            {!loading && (
              <button
                onClick={handleClear}
                className="absolute top-3 right-3 bg-red-500/80 backdrop-blur-sm text-white p-2 rounded-full hover:bg-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              loading ? 'bg-emerald-500/20 text-emerald-300/50 cursor-not-allowed' : 'glow-btn text-white'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </span>
            ) : 'Analyze Image'}
          </button>

          {!loading && (
            <button
              onClick={handleClear}
              className="w-full py-3 rounded-xl font-medium text-emerald-200/60 border border-emerald-500/15 hover:bg-emerald-500/5 transition-all"
            >
              Upload Another Image
            </button>
          )}
        </div>
      )}
    </div>
  )
}
