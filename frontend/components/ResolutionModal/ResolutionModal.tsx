import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

interface ResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (resolutionData: { 
    type: string; 
    details: string; 
    proofImage?: File;
  }) => void;
}

const ResolutionModal: React.FC<ResolutionModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [resolutionType, setResolutionType] = useState('Self-Resolution');
  const [resolutionDetails, setResolutionDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({ 
        type: resolutionType, 
        details: resolutionDetails,
        proofImage: proofImage || undefined
      });
      onClose();
    } catch (err) {
      setError('Failed to submit resolution. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
    
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofImage(e.target.files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        theme === "dark" ? "bg-black text-white" : "bg-white text-gray-800"
      )}>
        <DialogHeader>
          <DialogTitle>Resolve Issue</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="resolutionType" className="block text-sm font-medium">
              Resolution Type
            </label>
            <select
              id="resolutionType"
              value={resolutionType}
              onChange={(e) => setResolutionType(e.target.value)}
              className={cn(
                "mt-1 block w-full pl-3 pr-10 py-2 text-base rounded-md",
                theme === "dark"
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-800 border-gray-300"
              )}
            >
              <option value="Self-Resolution">Self-Resolution: I have personally resolved the issue</option>
              <option value="Unknown-Resolution">Unknown Resolution: The issue is resolved, but the resolver is unknown</option>
              <option value="Third-Party-Resolution">Third-Party Resolution: The issue was resolved by another party</option>
              <option value="External-Resolution">External Resolution: An external entity has resolved the issue</option>
              <option value="Unspecified-Resolution">Unspecified Resolution: The issue is resolved, details unspecified</option>
            </select>
          </div>
          <div>
            <label htmlFor="details" className="block text-sm font-medium">
              Resolution Details
            </label>
            <Input
              id="details"
              value={resolutionDetails}
              onChange={(e) => setResolutionDetails(e.target.value)}
              className={cn(
                theme === "dark"
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-800 border-gray-300"
              )}
              placeholder="Provide more information about the resolution..."
            />
          </div>
          <div>
            <label htmlFor="proofImage" className="block text-sm font-medium">
              Proof Image (optional)
            </label>
            <label
              htmlFor="proofImage"
              className={cn(
                "mt-1 flex items-center px-4 py-2 rounded-lg shadow-lg tracking-wide uppercase border cursor-pointer",
                theme === "dark"
                  ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600 hover:text-white"
                  : "bg-white text-blue-700 border-blue-500 hover:bg-blue-500 hover:text-white"
              )}
            >
              <Upload className="w-4 h-4 mr-2" />
              <span className="text-base leading-normal">Upload Image</span>
              <Input
                id="proofImage"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>
          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}
          <div className="mt-6 flex justify-end space-x-2">
            <Button
              type="button"
              onClick={onClose}
              className={cn(
                "inline-flex justify-center rounded-md px-4 py-2 font-medium",
                theme === "dark"
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-white text-gray-800 hover:bg-gray-200"
              )}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "inline-flex justify-center rounded-md px-4 py-2 font-medium",
                theme === "dark"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-green-600 text-white hover:bg-green-700"
              )}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Resolution'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResolutionModal;