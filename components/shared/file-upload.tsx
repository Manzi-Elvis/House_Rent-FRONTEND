"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, FileText, ImageIcon, File } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onFileRemove?: () => void
  accept?: string
  maxSize?: number // in bytes
  className?: string
  disabled?: boolean
  selectedFile?: File | null
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  accept = ".jpg,.jpeg,.png,.pdf",
  maxSize = 5 * 1024 * 1024, // 5MB
  className,
  disabled = false,
  selectedFile = null,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`
    }

    const acceptedTypes = accept.split(",").map((type) => type.trim())
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
    const mimeType = file.type

    const isValidExtension = acceptedTypes.some((type) => type === fileExtension)
    const isValidMimeType = acceptedTypes.some((type) => {
      if (type.startsWith(".")) return false
      return mimeType.startsWith(type.replace("*", ""))
    })

    if (!isValidExtension && !isValidMimeType) {
      return `File type not supported. Accepted types: ${accept}`
    }

    return null
  }

  const handleFile = (file: File) => {
    setError(null)
    const validationError = validateFile(file)

    if (validationError) {
      setError(validationError)
      return
    }

    // Simulate upload progress
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          onFileSelect(file)
          return 100
        }
        return prev + 10
      })
    }, 100)
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (disabled) return

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFile(files[0])
      }
    },
    [disabled],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return ImageIcon
    if (file.type === "application/pdf") return FileText
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={cn("w-full", className)}>
      {!selectedFile ? (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-colors",
            dragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-muted-foreground/25",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-blue-500",
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleInputChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium mb-2">
              {dragActive ? "Drop file here" : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-muted-foreground">
              {accept.replace(/\./g, "").toUpperCase()} files up to {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {(() => {
                const IconComponent = getFileIcon(selectedFile)
                return <IconComponent className="h-8 w-8 text-blue-600" />
              })()}
              <div>
                <p className="font-medium text-sm">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            {onFileRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onFileRemove}
                disabled={disabled}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-3">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Uploading... {uploadProgress}%</p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  )
}
