import React, { useState } from 'react';
import { Camera, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

export const ProofPhotoUpload = ({
  label,
  required = false,
  imageUrl,
  onImageSelected,
  description = 'Max size 1 MB (JPEG / PNG)',
}) => {
  const [preview, setPreview] = useState(imageUrl || null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size <= 1MB (1,048,576 bytes)
    if (file.size > 1048576) {
      setError('File exceeds maximum allowed size of 1 MB.');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      if (onImageSelected) {
        onImageSelected(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#1F2937]">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {preview && (
          <span className="inline-flex items-center text-[11px] font-medium text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Photo Captured
          </span>
        )}
      </div>

      <div className="relative border-2 border-dashed border-[#E2E8F0] hover:border-blue-400 rounded-xl p-3 bg-slate-50/50 transition-colors flex flex-col items-center justify-center text-center">
        {preview ? (
          <div className="relative group w-full">
            <img 
              src={preview} 
              alt={label} 
              className="w-full h-32 object-cover rounded-lg border border-[#E2E8F0]" 
            />
            <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium rounded-lg cursor-pointer transition-opacity">
              <Camera className="w-4 h-4 mr-1.5" /> Retake Photo
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        ) : (
          <label className="w-full py-4 flex flex-col items-center cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-blue-600">Click to capture / upload photo</span>
            <span className="text-[11px] text-[#64748B] mt-0.5">{description}</span>
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
          </label>
        )}
      </div>

      {error && (
        <div className="flex items-center text-[11px] text-rose-600 mt-1">
          <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
};

export default ProofPhotoUpload;
