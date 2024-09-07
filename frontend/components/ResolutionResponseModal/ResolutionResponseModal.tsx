// ResolutionResponseModal.tsx

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Resolution } from '@/lib/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Loader2 } from "lucide-react";

interface ResolutionResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRespond: (accept: boolean) => void;
  resolution: Resolution | null;
  canRespond: boolean;
  isLoading: boolean;
}

const ResolutionResponseModal: React.FC<ResolutionResponseModalProps> = ({
  isOpen,
  onClose,
  onRespond,
  resolution,
  canRespond,
  isLoading
}) => {
  if (!resolution) {
    return null; // or return some placeholder content
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("bg-card")}>
        <DialogHeader>
          <DialogTitle>Pending Resolution</DialogTitle>
        </DialogHeader>
        {resolution && (
          <div className="mt-4">
            <p><strong>Resolution Text:</strong> {resolution.resolution_text}</p>
            {resolution.resolved_by && 
              <p><strong>Resolved By:</strong> {resolution.resolved_by}</p>
            }
            {resolution.proof_image && (
              <Image src={resolution.proof_image} alt="Resolution Proof" className="mt-2 max-w-full h-auto" width={500} height={300} /> 
            )}
          </div>
        )}
        {canRespond && (
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => onRespond(false)} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Reject
            </Button>
            <Button onClick={() => onRespond(true)} disabled={isLoading}>
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