import React, { ChangeEvent, useRef } from 'react';
import { Camera, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageInputProps {
  onImageSelected: (base64: string, previewUrl: string, mimeType: string) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Split to get pure base64
        const base64Clean = result.split(',')[1];
        onImageSelected(base64Clean, result, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 text-center transition-colors">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ImageIcon className="text-blue-500 dark:text-blue-400 w-10 h-10" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Upload Khata Receipt</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Take a photo of your handwritten ledger or upload a PDF.</p>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group"
          >
            <Upload className="mb-2 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-300">Upload File</span>
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
          >
            <Camera className="mb-2" />
            <span className="text-sm font-medium">Use Camera</span>
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,application/pdf"
          capture="environment"
          onChange={handleFileChange}
        />
        
        <p className="mt-6 text-xs text-slate-400 dark:text-slate-500">
          Supports JPG, PNG, PDF. Optimized for handwritten text.
        </p>
      </div>
    </div>
  );
};

export default ImageInput;