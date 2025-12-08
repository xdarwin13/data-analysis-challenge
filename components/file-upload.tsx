"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Upload, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  isProcessing: boolean
}

export default function FileUpload({ onFileSelect, isProcessing }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file && (file.type === "text/csv" || file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
        setSelectedFileName(file.name)
        onFileSelect(file)
      }
    },
    [onFileSelect],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        setSelectedFileName(file.name)
        onFileSelect(file)
      }
    },
    [onFileSelect],
  )

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-white/80 hover:border-blue-400 hover:bg-white"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            {selectedFileName ? (
              <FileSpreadsheet className="w-8 h-8 text-blue-600" />
            ) : (
              <Upload className="w-8 h-8 text-blue-600" />
            )}
          </div>

          {selectedFileName ? (
            <div>
              <p className="text-lg font-medium text-slate-900 mb-1">{selectedFileName}</p>
              <p className="text-sm text-slate-600">Archivo seleccionado</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-slate-900 mb-1">Arrastra y suelta tu archivo aquí</p>
              <p className="text-sm text-slate-600">o haz clic para seleccionar</p>
            </div>
          )}

          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileInput}
            className="hidden"
            id="file-input"
            disabled={isProcessing}
          />
          <label htmlFor="file-input">
            <Button variant="outline" disabled={isProcessing} asChild>
              <span className="cursor-pointer">{isProcessing ? "Procesando..." : "Seleccionar archivo"}</span>
            </Button>
          </label>

          <p className="text-xs text-slate-500">Formatos soportados: CSV, Excel (.xlsx, .xls)</p>
        </div>
      </div>
    </div>
  )
}
