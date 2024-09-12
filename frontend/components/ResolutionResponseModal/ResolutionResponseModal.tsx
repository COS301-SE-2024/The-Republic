import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Resolution } from '@/lib/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Loader2, Star } from "lucide-react";

interface ResolutionResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRespond: (accept: boolean, rating?: number) => void;
  resolution: Resolution | null;
  canRespond: boolean;
  isLoading: boolean;
}

// Extend the Resolution type to include the organization property
interface ExtendedResolution extends Resolution {
  organization?: {
    name: string;
  };
}

const ResolutionResponseModal: React.FC<ResolutionResponseModalProps> = ({
  isOpen,
  onClose,
  onRespond,
  resolution,
  canRespond,
  isLoading
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  if (!resolution) {
    return null;
  }

  const extendedResolution = resolution as ExtendedResolution;

  const handleAccept = () => {
    if (extendedResolution.organization_id) {
      onRespond(true, rating);
    } else {
      onRespond(true);
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center space-x-1 mt-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-8 h-8 cursor-pointer transition-colors",
              (hoveredRating || rating) >= star
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            )}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("bg-card")}>
        <DialogHeader>
          <DialogTitle>Pending Resolution</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p><strong>Resolution Text:</strong> {extendedResolution.resolution_text}</p>
          {extendedResolution.resolved_by && 
            <p><strong>Resolved By:</strong> {extendedResolution.resolved_by}</p>
          }
          {extendedResolution.organization_id && extendedResolution.organization && 
            <p><strong>Organization:</strong> {extendedResolution.organization.name}</p>
          }
          {extendedResolution.proof_image && (
            <Image src={extendedResolution.proof_image} alt="Resolution Proof" className="mt-2 max-w-full h-auto" width={500} height={300} /> 
          )}
        </div>
        {canRespond && extendedResolution.organization_id && (
          <div>
            <p className="mt-4 mb-2">Please rate your satisfaction with this resolution:</p>
            {renderStarRating()}
          </div>
        )}
        {canRespond && (
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => onRespond(false)} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Reject
            </Button>
            <Button 
              onClick={handleAccept} 
              disabled={isLoading || (extendedResolution.organization_id && rating === 0) || false}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Accept
            </Button>
          </DialogFooter>
        )}
        {!canRespond && (
          <p className="mt-4 text-sm text-gray-500">
            You cannot respond to this resolution as you are not the issue owner or have any related issues.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResolutionResponseModal;