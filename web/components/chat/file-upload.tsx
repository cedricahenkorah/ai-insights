"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  File,
  FileSpreadsheet,
  ImageIcon,
  Loader2,
  Paperclip,
  Send,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import axios from "axios";

export default function FileUpload({
  onAnalysisComplete,
  csvAnalysis,
}: {
  onAnalysisComplete: (data: string) => void;
  csvAnalysis: string | null;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview URL for images
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFile(file);
  };

  const handleFile = (file: File | null) => {
    setError(null);

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Optional: Validate file type/size here
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError(`File size exceeds 10MB limit`);
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  // After the handleFile function, add this new function:

  const renderCsvPreview = () => {
    if (!selectedFile || !selectedFile.name.endsWith(".csv")) return null;

    // For large CSV files, we'll just show a message instead of trying to preview
    if (selectedFile.size > 1024 * 1024) {
      // 1MB
      return (
        <div className="mt-2 p-3 bg-muted rounded-md text-sm">
          <p className="font-medium">CSV file detected</p>
          <p className="text-muted-foreground">
            Large CSV file ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
          </p>
        </div>
      );
    }

    // For smaller files, we could implement a preview here
    return (
      <div className="mt-2 p-3 bg-muted rounded-md text-sm">
        <p className="font-medium">CSV file detected</p>
        <p className="text-muted-foreground">
          Ready to process {selectedFile.name}
        </p>
      </div>
    );
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0] || null;
    handleFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post("/api/analyze-csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onAnalysisComplete(response?.data);
      clearFile();
    } catch {
      setError("Failed to process CSV.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = () => {
    if (!selectedFile)
      return <Paperclip className="h-5 w-5 text-muted-foreground" />;

    if (selectedFile.type.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    }

    // Add specific icon for CSV files
    if (
      selectedFile.name.endsWith(".csv") ||
      selectedFile.type === "text/csv"
    ) {
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    }

    return <File className="h-5 w-5 text-blue-500" />;
  };

  return (
    <div className={`w-full ${!csvAnalysis ? "max-w-2xl" : ""}`}>
      <div
        className={cn(
          "relative border rounded-lg p-3 min-h-[120px] bg-background transition-colors",
          "border-input hover:border-indigo-600 focus-within:border-indigo-600",
          isDragging && "border-primary border-dashed bg-primary/5",
          error && "border-destructive"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col gap-2">
          {/* File Input Area */}
          <label
            htmlFor="file-upload"
            className={cn(
              "flex items-center justify-center w-full cursor-pointer",
              "rounded-md border-2 border-dashed p-2 transition-colors",
              "border-muted-foreground/25 hover:border-indigo-600",
              isDragging && "border-primary bg-primary/5",
              selectedFile && "border-none p-0 justify-start"
            )}
          >
            {!selectedFile ? (
              <div className="flex flex-col items-center gap-2 text-center">
                <Paperclip className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">
                    Drop your file here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Support for images, PDFs, CSV, and text files (max 10MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md w-full">
                {getFileIcon()}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    clearFile();
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            )}
            <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              // accept="image/*,.pdf,.txt,.md,.csv"
              accept=".csv"
              aria-label="Upload file"
            />
          </label>

          {/* Image Preview */}
          {previewUrl && (
            <div className="mt-2 relative rounded-md overflow-hidden border border-input">
              <Image
                src={previewUrl || "/placeholder.svg"}
                alt="Preview"
                className="max-h-[200px] w-full object-contain bg-checkerboard"
                layout="responsive"
                width={500}
                height={500}
              />
            </div>
          )}

          {/* CSV Preview */}
          {renderCsvPreview()}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm mt-1">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end mt-2">
            <Button
              type="button"
              className={`rounded-full bg-indigo-600 hover:bg-indigo-700`}
              onClick={handleSubmit}
              disabled={!selectedFile || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Analyze CSV
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
