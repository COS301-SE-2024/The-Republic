import React, { useState } from 'react';
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


};

export default ResolutionModal;