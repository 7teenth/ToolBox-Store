"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Upload, X } from "lucide-react"
import type React from "react"
import { useRef, useState } from "react"

export type UploadedImage = {
  id: string
  url: string
  file?: File
}

type UploadImageProps = {
  images?: UploadedImage[]
  onChange?: (images: UploadedImage[]) => void
  maxImages?: number
  withTypes?: boolean
  className?: string
}

export function UploadImage({
  images = [],
  onChange,
  maxImages = 10,
  withTypes = false,
  className,
}: UploadImageProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(images)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateImages = (newImages: UploadedImage[]) => {
    setUploadedImages(newImages)
    onChange?.(newImages)
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const remainingSlots = maxImages - uploadedImages.length
    const filesToAdd = Array.from(files).slice(0, remainingSlots)

    const newImages: UploadedImage[] = filesToAdd.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      file
    }))

    updateImages([...uploadedImages, ...newImages])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const removeImage = (id: string) => {
    const newImages = uploadedImages.filter((img) => img.id !== id)
    updateImages(newImages)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...uploadedImages]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    updateImages(newImages)
  }

  const canAddMore = uploadedImages.length < maxImages

  return (
    <div className={cn("space-y-4", className)}>
      {canAddMore && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-primary/10 p-3">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">Натисніть або перетягніть зображення</p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG, WEBP до 10MB ({uploadedImages.length}/{maxImages})
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {uploadedImages.map((image, index) => (
            <Card key={image.id} className="relative group overflow-hidden size-36">
              <div className="aspect-square relative">
                <img
                  src={image.url || "/placeholder.jpg"}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col flex-wrap items-center justify-end gap-5 p-2.5">
                  <div className="flex justify-center items-center gap-2">
                    {index > 0 && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => moveImage(index, index - 1)}
                      >
                        ←
                      </Button>
                    )}
                    {index < uploadedImages.length - 1 && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => moveImage(index, index + 1)}
                      >
                        →
                      </Button>
                    )}
                  </div>

                  <div className="w-full flex justify-end">
                    <Button size="icon" variant="destructive" className="h-6 w-6" onClick={() => removeImage(image.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {
                  withTypes && index <= 1 && (
                    <div className="absolute top-2 left-2">
                      <Badge variant={index === 0 ? "default" : "secondary"} className="text-xs">
                        {index === 0 ? "Головне" : "Hover"}
                      </Badge>
                    </div>
                  )
                }

                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="text-xs bg-background">
                    {index + 1}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
