'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = 'application/pdf',
  maxSize = 10 * 1024 * 1024, // 10MB por defecto
  error,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    maxSize,
    multiple: false,
  });

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      {selectedFile ? (
        <div className="border-2 border-[#219EBC] rounded-lg p-4 bg-[#8ECAE6] bg-opacity-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-[#219EBC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-[#023047] font-semibold">{selectedFile.name}</p>
                <p className="text-sm text-[#6b7280]">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleRemoveFile}
            >
              Eliminar
            </Button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-[#219EBC] bg-[#8ECAE6] bg-opacity-10 shadow-md'
              : 'border-gray-300 hover:border-[#219EBC] hover:bg-[#8ECAE6] hover:bg-opacity-5'
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-3">
            <svg
              className={`mx-auto h-12 w-12 transition-colors ${
                isDragActive ? 'text-[#219EBC]' : 'text-gray-400'
              }`}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isDragActive ? (
              <p className="text-[#219EBC] font-semibold">Suelta el archivo aquí...</p>
            ) : (
              <>
                <p className="text-[#023047] font-medium">
                  Arrastra y suelta un archivo PDF aquí, o haz clic para seleccionar
                </p>
                <p className="text-sm text-[#6b7280]">
                  Solo archivos PDF (máx. {maxSize / 1024 / 1024}MB)
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {(fileRejections.length > 0 || error) && (
        <div className="mt-4">
          <Alert type="error">
            {error ||
              fileRejections[0]?.errors[0]?.message ||
              'Error al subir el archivo'}
          </Alert>
        </div>
      )}
    </div>
  );
};


