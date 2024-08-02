import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [resolutionType, setResolutionType] = useState('I fixed the problem');
  const [resolutionDetails, setResolutionDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
    
  const [proofImage, setProofImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolve Issue</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="resolutionType" className="block text-sm font-medium text-gray-700">
                Resolution Type
              </label>
              <select
                id="resolutionType"
                value={resolutionType}
                onChange={(e) => setResolutionType(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option>I fixed the problem</option>
                <option>I don't know who fixed it</option>
                <option>It was fixed by someone else</option>
              </select>
           </div>
            <div>
              <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                Additional Details
              </label>
              <textarea
                id="details"
                value={resolutionDetails}
                onChange={(e) => setResolutionDetails(e.target.value)}
                rows={3}
                className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Provide more information about the resolution..."
              ></textarea>
                      </div>
                      
                      <div>
  <label htmlFor="proofImage" className="block text-sm font-medium text-gray-700">
    Proof Image (optional)
  </label>
  <input
    type="file"
    id="proofImage"
    ref={fileInputRef}
    onChange={handleFileChange}
    accept="image/*"
    className="mt-1 block w-full text-sm text-gray-500
    file:mr-4 file:py-2 file:px-4
    file:rounded-full file:border-0
    file:text-sm file:font-semibold
    file:bg-violet-50 file:text-violet-700
    hover:file:bg-violet-100"
  />
</div>
            {error && (
              <div className="text-red-500 text-sm mt-2">
                {error}
              </div>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Resolution'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResolutionModal;