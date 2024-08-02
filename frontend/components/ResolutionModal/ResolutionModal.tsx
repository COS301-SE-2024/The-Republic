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
  onSubmit: (resolutionData: { type: string; details: string }) => void;
}

const ResolutionModal: React.FC<ResolutionModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [resolutionType, setResolutionType] = useState('I fixed the problem');
  const [resolutionDetails, setResolutionDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({ type: resolutionType, details: resolutionDetails });
      onClose();
    } catch (err) {
      setError('Failed to submit resolution. Please try again.');
    } finally {
      setIsSubmitting(false);
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